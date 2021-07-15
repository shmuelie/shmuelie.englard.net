import { Me } from './me.js'
import './diagnal-ribbon.js'
import { apply, Thing } from 'https://unpkg.com/microdata-tooling@1.0.3/dist/index.min.js'
import { formatDateTime, formatPhone } from './formatters.js'
import { ContactPoint } from './schema.js'
import { BadgeStyle, SimpleIcons, icons } from 'https://unpkg.com/shieldsio-elements@1.0.0/dist/index.min.js'
import 'https://unpkg.com/@fluentui/web-components@1.1.1'

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
            const contact = data as ContactPoint;
            if (contact && contact.contactType && icons[contact.contactType as string]) {
                const widget = document.createElement("simpleicon-badge");
                widget.badgeStyle = BadgeStyle.ForTheBadge;
                widget.logo = contact.contactType as SimpleIcons;
                const link = document.createElement("a");
                link.target = "_blank";
                link.style.textDecoration = "none";
                link.href = contact.url as string || "";
                link.appendChild(widget);
                element.appendChild(link);
            }
            return false;
        }
    }
});
const ldScript = document.querySelector("script[type='application/ld+json'");
if (ldScript) {
    ldScript.textContent = JSON.stringify(Me);
}