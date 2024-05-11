import 'https://unpkg.com/shieldsio-elements@1.0.0'
import { allComponents, baseLayerLuminance, provideFluentDesignSystem, StandardLuminance } from 'https://unpkg.com/@fluentui/web-components@2.6.1'
import { StateEngine } from './state-engine.js'
import { DesignToken, Tabs } from 'https://unpkg.com/@microsoft/fast-foundation@2.49.6'
import { register, unregister, ProviderCallback, SchemaConfig } from 'https://unpkg.com/hashed-es6@1.0.2'
import { FluentBlog } from './fluent-blog.js'

const systemIsDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

// Loaded Fluent UI system.
baseLayerLuminance.setValueFor(document.body, systemIsDarkMode ? StandardLuminance.DarkMode : StandardLuminance.LightMode);
provideFluentDesignSystem().register(allComponents).withDesignTokenRoot(document);
DesignToken.registerRoot(document);

const rootTabs = document.getElementById("rootTabs") as Tabs;

// Configure and create state engine.
const stateEngine = new StateEngine();
stateEngine.tagConfigs["FLUENT-TABS"] = {
    attribute: "activeid",
    event: "change"
};
stateEngine.tagConfigs["FLUENT-BLOG"] = {
    attribute: "blog-state",
    event: "change"
};
stateEngine.initialize(document.body);