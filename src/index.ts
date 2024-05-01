import 'https://unpkg.com/shieldsio-elements@1.0.0'
import { allComponents, baseLayerLuminance, provideFluentDesignSystem, StandardLuminance } from 'https://unpkg.com/@fluentui/web-components@2.6.1'
import { StateEngine } from './state-engine.js'
import { DesignToken } from 'https://unpkg.com/@microsoft/fast-foundation@2.49.6'
import { getEmbededBlogPosts, parseResponse } from './drop-in-blog-embed.js'
import { ApplyOptions, apply, Thing } from 'https://unpkg.com/microdata-tooling@1.0.4'

const systemIsDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

// Loaded Fluent UI system.
baseLayerLuminance.setValueFor(document.body, systemIsDarkMode ? StandardLuminance.DarkMode : StandardLuminance.LightMode);
provideFluentDesignSystem().register(allComponents).withDesignTokenRoot(document);
DesignToken.registerRoot(document);

// Configure and create state engine.
const stateEngine = new StateEngine();
stateEngine.tagConfigs["FLUENT-TABS"] = {
    attribute: "activeid",
    event: "change"
};
stateEngine.initialize(document.body);

async function loadBlog(): Promise<void> {
    const response = await getEmbededBlogPosts();
    const posts = parseResponse(response);

    const applyOptions: ApplyOptions = {
    };
    const postsElement = document.querySelector('fluent-tab-panel.blog > section.blog-posts > div') as HTMLElement;
    apply(posts as unknown as Thing, postsElement, applyOptions);
}

if (document.readyState !== 'loading') {
    loadBlog();
} else {
    document.addEventListener('DOMContentLoaded', function() {
        loadBlog();
    });
}