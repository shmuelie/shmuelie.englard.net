import { ContactPoint, Thing, WithContext } from './schema'
import { dataBindWidget } from './contact-widgets.js'
import { isArray, isElement, isSchemaType } from './type-guards.js'
import { formatDateTime, formatPhone } from './formatters.js'

/**
 * Get the schema type of an @see HTMLElement.
 * @param element The HTMLElement to check for.
 */
function getElementType(element: HTMLElement): string | null {
    while (!element.hasAttribute("itemscope")) {
        if (element.parentElement === null) {
            return null;
        }
        element = element.parentElement;
    }
    const itemType = element.getAttribute("itemtype");
    if (itemType === null) {
        return null;
    }
    const schemaOrg = "https://schema.org/";
    return itemType.substr(schemaOrg.length);
}

/**
 * Get a property from an object.
 *
 * @description Helps keep type safety when trying to access property using indexing.
 * @param obj Object to get property of.
 * @param propertyName Name of property to get.
 */
function getProperty<T>(obj: any, propertyName: string): T | null {
    if (propertyName in obj) {
        return obj[propertyName] as T;
    }
    return null;
}

/**
 * Bind a @see Thing to a HTML element tree.
 * @param element The root HTMLElement to bind to.
 * @param data The Thing to bind from.
 */
export function dataBind(element: HTMLElement, data: Thing): void {
    if (typeof data === "string") {
        dataBindAsString(element, data);
    } else if (isArray<Thing>(data)) {
        dataBindAsArray(element, data);
    } else {
        const currentType = getElementType(element);
        if (currentType === null) {
            throw new Error("Unknown element data type");
        }
        if (currentType !== data['@type']) {
            throw new Error("Data type does not match element type");
        }
        if (element.dataset.formatter && (element.dataset.formatter in thingFormatters) && thingFormatters[element.dataset.formatter](data, element)) {
            return;
        }
        for (const propertyName of Object.keys(data).filter(pn => !pn.startsWith("@"))) {
            const propertyValue = getProperty<Thing>(data, propertyName);
            const elementProperty = element.querySelector<HTMLElement>("*[itemprop=" + propertyName + "]");
            if (elementProperty !== null && propertyValue !== null) {
                dataBind(elementProperty, propertyValue);
            }
        }
    }
}

/**
 * Bind an array of @see Thing to a HTML element tree.
 * @param element The root HTMLElement to bind to.
 * @param data The array of Thing to bind from.
 */
function dataBindAsArray(element: HTMLElement, data: Thing[]): void {
    for (const item of data) {
        const tmpl = (typeof item === "string") ? element.querySelector<HTMLTemplateElement>("template[data-type=Text]") : element.querySelector<HTMLTemplateElement>("template[data-type=" + item["@type"] + "]");
        if (tmpl && tmpl.content.firstElementChild) {
            const clone = tmpl.content.firstElementChild.cloneNode(true) as HTMLElement;
            dataBind(clone, item);
            element.appendChild(clone);
        }
    }
}

/**
 * Bind a string to a HTML element tree.
 * @param element The root HTMLElement to bind to.
 * @param data The string to bind from.
 */
function dataBindAsString(element: HTMLElement, data: string): void {
    if (element.dataset.formatter && (element.dataset.formatter in stringFormatters) && stringFormatters[element.dataset.formatter](data, element)) {
        return;
    }
    element.innerText = data;
}

function dateFormatter(data: string, element: HTMLElement): boolean {
    if (isElement<HTMLTimeElement>(element, "time")) {
        element.innerText = formatDateTime(data);
        element.dateTime = data;
        return true;
    }
    return false;
}

function emailFormatter(data: string, element: HTMLElement): boolean {
    /** From https://emailregex.com/ */
    const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    if (isElement<HTMLAnchorElement>(element, "a") && emailRegex.test(data)) {
        element.href = "mailto:" + data;
        element.innerText = data;
        return true;
    }
    return false;
}

function telephoneFormatter(data: string, element: HTMLElement): boolean {
    if (isElement<HTMLAnchorElement>(element, "a")) {
        const tel = formatPhone(data);
        if (tel) {
            element.href = tel.link;
            element.innerText = tel.display;
            return true;
        }
    }
    return false;
}

function anchorFormatter(data: string, element: HTMLElement): boolean {
    if (isElement<HTMLAnchorElement>(element, "a")) {
        element.href = data;
        return true;
    }
    return false;
}

function metaFormatter(data: string, element: HTMLElement): boolean {
    if (isElement<HTMLMetaElement>(element, "meta")) {
        element.content = data;
        return true;
    }
    return false;
}

function imageFormatter(data: string, element: HTMLElement): boolean {
    if (isElement<HTMLImageElement>(element, "img")) {
        element.src = data;
        return true;
    }
    return false;
}

function contactPointFormatter(data: Thing, element: HTMLElement): boolean {
    if (isSchemaType<ContactPoint>(data, "ContactPoint")) {
        element.appendChild(dataBindWidget(data));
    }
    return false; // Always allow for more processing after this.
}

export const stringFormatters: {[name: string]: (data: string, element: HTMLElement) => boolean} = {
    "date": dateFormatter,
    "meta": metaFormatter,
    "image": imageFormatter,
    "email": emailFormatter,
    "telephone": telephoneFormatter,
    "anchor": anchorFormatter
};

export const thingFormatters: {[name: string]: (data: Thing, element: HTMLElement) => boolean} ={
    "contactPoint": contactPointFormatter
};

export function jsonLdBind<T extends Thing>(data: WithContext<T>, root: Document): void {
    const script = root.querySelector<HTMLScriptElement>("script[type='application/ld+json']");
    if (script) {
        script.text = JSON.stringify(data);
    }
}