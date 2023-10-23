import { contantPoints } from './me.js'
import { apply, ApplyOptions, Thing } from 'https://unpkg.com/microdata-tooling@1.0.4'
import { ContactPoint } from './schema.js'
import { BadgeStyle, SimpleIcons, icons, SimpleIconBadge, ShieldIOStaticBadge } from 'https://unpkg.com/shieldsio-elements@1.0.0'
import { allComponents, provideFluentDesignSystem } from 'https://unpkg.com/@fluentui/web-components@2.5.16'
import { StateEngine } from './state-engine.js'
import { podcasts } from './podcasts.js'
import { youtubeChannels } from './youtube.js'
import {} from './index.htm.js'

// Loaded Fluent UI system.
provideFluentDesignSystem().register(allComponents);

// Configuration for data binding contact points.
const contactOptions: ApplyOptions = {
    typeHelpers: {
        "ContactPoint": (data: Thing, element: HTMLElement): boolean => {
            const contact = data as ContactPoint;
            // Ensure that contact and contact's type are not empty.
            if (contact && contact.contactType) {
                let widget: SimpleIconBadge | ShieldIOStaticBadge;
                if (icons[contact.contactType as string]) { // If contact's type has a simple icon, use it.
                    widget = document.createElement("simpleicon-badge");
                    widget.logo = contact.contactType as SimpleIcons;
                } else { // If contact's type doesn't have a simple icon, use simple badge with no icon.
                    widget = document.createElement("shieldio-badge");
                    widget.message = contact.contactType as string;
                }
                widget.badgeStyle = BadgeStyle.ForTheBadge;
                const link = document.createElement("a");
                link.target = "_blank";
                link.style.textDecoration = "none";
                link.href = contact.url as string ?? "";
                link.rel = "me";
                link.appendChild(widget);
                element.appendChild(link);
            }
            return false;
        }
    }
};

// Use data binding to create contact points.
apply((contantPoints as any) as Thing, document.querySelector("section[itemprop=contactPoint]") as HTMLElement, contactOptions);
apply((contantPoints as any) as Thing, document.querySelector("div[itemprop=contactPoint]") as HTMLElement, contactOptions);

// Configuration for data binding podcasts.
const podcastOptions: ApplyOptions = {
};

// Use data binding to create podcasts.
apply((podcasts as any) as Thing, document.querySelector('section.podcasts > div') as HTMLElement, podcastOptions);

const youtubeChannelOptions: ApplyOptions = {
};

apply((youtubeChannels as any) as Thing, document.querySelector('section.youtubeChannels > div') as HTMLElement, youtubeChannelOptions);

// Configure and create state engine.
const stateEngine = new StateEngine();
stateEngine.tagConfigs["FLUENT-TABS"] = {
    attribute: "activeid",
    event: "change"
};
stateEngine.initialize(document.body);

const contactButton = document.getElementById("contactButton");
const contactDialog = document.getElementById("contactDialog");
contactDialog.addEventListener("dismiss", function () {
    contactDialog.hide();
});
contactButton.addEventListener("click", function () {
    contactDialog.show();
});