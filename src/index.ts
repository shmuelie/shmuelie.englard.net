import 'https://unpkg.com/shieldsio-elements@1.0.0'
import { allComponents, baseLayerLuminance, provideFluentDesignSystem, StandardLuminance } from 'https://unpkg.com/@fluentui/web-components@2.6.1'
import { DesignToken, Tabs } from 'https://unpkg.com/@microsoft/fast-foundation@2.49.6'
import { register } from 'https://unpkg.com/hashed-es6@1.0.3'
import './fluent-blog.js'

const systemIsDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

// Loaded Fluent UI system.
baseLayerLuminance.setValueFor(document.body, systemIsDarkMode ? StandardLuminance.DarkMode : StandardLuminance.LightMode);
provideFluentDesignSystem().register(allComponents).withDesignTokenRoot(document);
DesignToken.registerRoot(document);

const rootTabs = document.getElementById("rootTabs") as Tabs;
const updateRootTabsState = register({
    ["rootTabs"]: rootTabs.activeid ?? ""
}, function (values: Record<string, any>) {
    const activeid = values['rootTabs'];
    if (activeid) {
        rootTabs.activeid = activeid ?? "";
    }
});
rootTabs.addEventListener("change", function () {
    updateRootTabsState({
        ["rootTabs"]: rootTabs.activeid
    })
});