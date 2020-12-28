export function fromPath(root: HTMLElement, path: string): HTMLElement {
    const parts = path.split(".");
    if (parts.length === 0) {
        return root;
    }
    let currentElement = root;
    for (const part of parts) {
        const nextElement = currentElement.querySelector<HTMLElement>("*[itemprop=" + part + "]");
        if (nextElement) {
            currentElement = nextElement;
        } else {
            throw new Error("Unable to find part");
        }
    }
    return currentElement;
}

export function dataBind(element: HTMLElement, data: any): void {
    if (element.lastElementChild instanceof HTMLTemplateElement) {
        const template = element.lastElementChild as HTMLTemplateElement;
        if (Array.isArray(data)) {
            for (const item of data) {
                const bindingElement = template.content.cloneNode(true) as HTMLElement;
                dataBind(bindingElement, item);
                element.appendChild(bindingElement);
            }
        } else {
            const bindingElement = template.content.cloneNode(true) as HTMLElement;
            dataBind(bindingElement, data);
            element.appendChild(bindingElement);
        }
        template.remove();
    } else {
        for (const propertyName in data) {
            if (propertyName === "content") {
                element.innerText = data.content;
            } else if (propertyName === "html") {
                element.innerHTML = data.html;
            } else if ((element as any)[propertyName] !== undefined) {
                (element as any)[propertyName] = data[propertyName];
            } else if (typeof data[propertyName] === "object") {
                if (Array.isArray(data[propertyName])) {
                    const contentElement = element.querySelector<HTMLElement>("*[itemprop=" + propertyName + "]") || element;
                    if ((data[propertyName] as any[]).length > 0) {
                        if (typeof data[propertyName][0] === "string") {
                            for (const item of data[propertyName]) {
                                const p = document.createElement("p");
                                p.innerText = item;
                                contentElement.appendChild(p);
                            }
                        } else if (typeof data[propertyName][0] === "object") {
                            dataBind(contentElement, data[propertyName])
                        }
                    }
                } else {
                    const nextElement = element.querySelector<HTMLElement>("*[itemprop=" + propertyName + "]");
                    if (nextElement) {
                        dataBind(nextElement, data[propertyName])
                    }
                }
            } else if (typeof data[propertyName] === "string") {
                (element.querySelector<HTMLElement>("*[itemprop=" + propertyName + "]") || element).innerText = data[propertyName];
            }
        }
    }
}