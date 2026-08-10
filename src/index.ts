import 'https://unpkg.com/shieldsio-elements@1.1.1'
import 'https://unpkg.com/@awesome.me/webawesome@3.5.0/dist/components/tab-group/tab-group.js'
import 'https://unpkg.com/@awesome.me/webawesome@3.5.0/dist/components/tab/tab.js'
import 'https://unpkg.com/@awesome.me/webawesome@3.5.0/dist/components/tab-panel/tab-panel.js'
import 'https://unpkg.com/@awesome.me/webawesome@3.5.0/dist/components/card/card.js'
import 'https://unpkg.com/@awesome.me/webawesome@3.5.0/dist/components/spinner/spinner.js'
import 'https://unpkg.com/@awesome.me/webawesome@3.5.0/dist/components/icon/icon.js'
import { register } from 'https://unpkg.com/hashed-es6@1.0.3'
import './blog/BlogElement.js'

const rootTabs = document.querySelector("wa-tab-group")!;
const updateRootTabsState = register({
    ["rootTabs"]: rootTabs.getAttribute("active") ?? ""
}, function (values: Record<string, any>) {
    const active = values['rootTabs'];
    if (active) {
        (rootTabs as any).active = active;
    }
});
rootTabs.addEventListener("wa-tab-show", function (e: Event) {
    const detail = (e as CustomEvent).detail;
    if (detail?.name) {
        updateRootTabsState({
            ["rootTabs"]: detail.name
        });
    }
});

const postSlug = new URLSearchParams(window.location.search).get("p");
if (postSlug) {
    const blogElement = document.querySelector("blog-element");
    if (blogElement) {
        (rootTabs as any).active = "blog";
        updateRootTabsState({ ["rootTabs"]: "blog" });
        blogElement.setAttribute("current-slug", postSlug);
    }
}