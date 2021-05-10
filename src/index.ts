import { Me } from './me.js'
import './diagnal-ribbon.js'
import { apply, Thing } from 'https://unpkg.com/microdata-tooling@1.0.3/dist/index.min.js'
import { formatDateTime, formatPhone } from './formatters.js'
import { ContactPoint } from './schema.js'
import './shieldio-widgets.js'
import { BadgeStyle } from './shieldio-widgets.js'
import { SimpleIcon } from './simple-icons.js'

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
                const widget = document.createElement("shieldio-badge");
                widget.badgeStyle = BadgeStyle.ForTheBadge;
                widget.message = contact.contactType as string || "";
                const link = document.createElement("a");
                link.target = "_blank";
                link.style.textDecoration = "none";
                link.href = contact.url as string || "";
                switch (contact.contactType) {
                    case "LinkedIn":
                        widget.logo = SimpleIcon.LinkedIn;
                        widget.color = "0077B5";
                        widget.logoColor = "white";
                        break;
                    case "Twitter":
                        widget.logo = SimpleIcon.Twitter;
                        widget.color = "1DA1F2";
                        widget.logoColor = "white";
                        break;
                    case "GitHub":
                        widget.logo = SimpleIcon.GitHub;
                        widget.logoColor = "black";
                        widget.color = "555555";
                        break;
                    case "StackOverflow":
                        widget.logo = SimpleIcon.StackOverflow;
                        widget.color = "ff901e";
                        widget.logoColor = "white";
                        break;
                    case "Facebook":
                        widget.logo = SimpleIcon.Facebook;
                        widget.color = "1877F2";
                        widget.logoColor = "white";
                        break;
                    case "NuGet":
                        widget.logo = SimpleIcon.NuGet;
                        widget.color = "004880";
                        widget.logoColor = "white";
                        break;
                    case "NPM":
                        widget.logo = SimpleIcon.Npm;
                        widget.color = "CB3837";
                        widget.logoColor = "white";
                        break;
                }
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