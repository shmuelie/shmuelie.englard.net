import { apply, ApplyOptions, Thing } from 'https://unpkg.com/microdata-tooling@1.0.4'
import 'https://unpkg.com/shieldsio-elements@1.0.0'
import { allComponents, provideFluentDesignSystem } from 'https://unpkg.com/@fluentui/web-components@2.5.16'
import { StateEngine } from './state-engine.js'
import { podcasts } from './podcasts.js'
import { youtubeChannels } from './youtube.js'
import {} from './index.htm.js'

// Loaded Fluent UI system.
provideFluentDesignSystem().register(allComponents);

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