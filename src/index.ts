import { Me } from './me.js'
import './diagnal-ribbon.js'
import { apply, Thing } from 'https://unpkg.com/microdata-tooling@1.0.3/dist/index.min.js'
import { formatDateTime, formatPhone } from './formatters.js'
import { ContactPoint } from './schema.js'
import './shieldio-widgets.js'
import { ShieldIOStyle } from './shieldio-widgets.js'

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
            if (contact) {
                const widget = document.createElement("shieldio-static-widget");
                const link = document.createElement("a");
                link.target = "_blank";
                link.style.textDecoration = "none";
                switch (contact.contactType) {
                    case "LinkedIn":
                        widget.logo = "linkedin";
                        widget.color = "0077B5";
                        widget.badgeStyle = ShieldIOStyle.Flat;
                        widget.logoColor = "white";
                        widget.message = "LinkedIn";
                        link.href = contact.url as string|| "https://www.linkedin.com/";
                        break;
                    case "Twitter":
                        widget.logo = "twitter";
                        widget.color = "1DA1F2";
                        widget.badgeStyle = ShieldIOStyle.Flat;
                        widget.logoColor = "white";
                        widget.message = "Twitter";
                        link.href = "https://twitter.com/" + (contact.identifier as string | null);
                        break;
                    case "GitHub":
                        widget.logo = "github";
                        widget.logoColor = "black";
                        widget.badgeStyle = ShieldIOStyle.Social;
                        widget.message = " ";
                        widget.label = "GitHub";
                        link.href = "https://github.com/" + (contact.identifier as string | null);
                        break;
                }
                element.appendChild(widget);
            }
            return false;
        }
    }
});
const ldScript = document.querySelector("script[type='application/ld+json'");
if (ldScript) {
    ldScript.textContent = JSON.stringify(Me);
}