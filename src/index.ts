import { contantPoints, jobs } from './me.js'
import { apply, ApplyOptions, Thing } from 'https://unpkg.com/microdata-tooling@1.0.4'
import { formatDateTime, formatPhone } from './formatters.js'
import { ContactPoint } from './schema.js'
import { BadgeStyle, SimpleIcons, icons } from 'https://unpkg.com/shieldsio-elements@1.0.0'
import 'https://unpkg.com/@fluentui/web-components@1.4.1'
import { StateEngine } from './state-engine.js'

const applyOptions: ApplyOptions = {
    linkFormatter: (data: string, elementData: DOMStringMap): string | null => {
        if ("formatter" in elementData) {
            if (elementData["formatter"] === "telephone") {
                return formatPhone(data);
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
};

apply((contantPoints as any) as Thing, document.querySelector("section[itemprop=contactPoint]") as HTMLElement, applyOptions);
apply((jobs as any) as Thing, document.querySelector("fluent-accordion[itemprop=worksFor]") as HTMLElement, applyOptions);

const stateEngine = new StateEngine();
stateEngine.tagConfigs["FLUENT-TABS"] = {
    attribute: "activeid",
    event: "change"
};
stateEngine.initialize(document.body);