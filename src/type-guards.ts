/**
 * Is an object a schema.org type.
 *
 * @param obj The object to test.
 * @param type the desired type.
 */
export function isSchemaType<T>(obj: any, type: string): obj is T {
    return typeof obj === "object" && "@type" in obj && obj["@type"] === type;
}

/**
 * Check if an object is an array of a type
 *
 * @description Pretty much just an Array.isArray call. Doesn't actually check if the array is of the given type.
 * @param obj The object to check.
 */
export function isArray<T>(obj: any): obj is T[] {
    return typeof obj === "object" && Array.isArray(obj);
}

/**
 * Check if an @see Element is a given tag.
 * @param element The Element to check.
 * @param tag The wanted tag name.
 */
export function isElement<T extends Element>(element: Element, tag: string): element is T {
    return element.tagName === tag.toUpperCase();
}