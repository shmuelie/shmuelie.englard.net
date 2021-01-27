export function isSchemaType(obj, type) {
    return typeof obj === "object" && "@type" in obj && obj["@type"] === type;
}
export function isArray(obj) {
    return typeof obj === "object" && Array.isArray(obj);
}
export function isElement(element, tag) {
    return element.tagName === tag.toUpperCase();
}
