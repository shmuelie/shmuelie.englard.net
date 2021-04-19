import { Me } from './me.js'
import './diagnal-ribbon.js'
import { apply, Thing } from 'https://unpkg.com/microdata-tooling@1.0.3/dist/index.min.js'
import { dataBindWidget } from './contact-widgets.js'
import { formatDateTime, formatPhone } from './formatters.js'
import { ContactPoint } from './schema.js'

apply(Me as Thing, document.querySelector("html") as HTMLElement, {
    linkFormatter: (data: string, elementData: DOMStringMap): string | null => {
        if ("formatter" in elementData) {
            if (elementData["formatter"] === "telephone") {
                return formatPhone(data)?.display || null;
            }
            if (elementData["formatter"] === "email") {
                return data.replace(/^mailto\:/, "");
            }
        }
        return null;
    },
    timeFormatter: (data: string, _: DOMStringMap): string => {
        if (data === "") {
            return "Present";
        }
        return formatDateTime(data);
    },
    typeHelpers: {
        "ContactPoint": (data: Thing, element: HTMLElement): boolean => {
            element.appendChild(dataBindWidget(data as ContactPoint));
            return false;
        }
    }
});
const ldScript = document.querySelector("script[type='application/ld+json'");
if (ldScript) {
    ldScript.textContent = JSON.stringify(Me);
}