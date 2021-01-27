import 'https://platform.twitter.com/widgets.js';
export class LinkedInWidget extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.link = this.createLink();
        this.shadowRoot?.append(this.createStyle(), this.createLogo(), this.link);
    }
    createLink() {
        const link = document.createElement("a");
        link.target = "_blank";
        link.style.textDecoration = "none";
        link.innerText = "Follow";
        link.href = this.href || "https://www.linkedin.com/";
        return link;
    }
    createLogo() {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M34.5,3H5.6C4.2,3,3,4.1,3,5.4v29.1C3,35.9,4.2,37,5.6,37h29C35.9,37,37,35.9,37,34.6V5.4C37,4.1,35.9,3,34.5,3zM13,32H8V16h5V32zM10.5,13.9c-1.9,0-3.4-1.5-3.4-3.4c0-1.9,1.5-3.4,3.4-3.4s3.4,1.5,3.4,3.4C13.9,12.4,12.4,13.9,10.5,13.9zM32,32h-5v-7.9c0-2.4-1-4-2.6-4c-2.3,0-3.4,2.1-3.4,4.6V32h-5V16h5v2.1c0.8-1.4,2.2-2.5,4.7-2.5c4.7,0,6.3,1.7,6.3,5.4V32z");
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.appendChild(path);
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("width", "28");
        rect.setAttribute("height", "28");
        rect.setAttribute("x", "5");
        rect.setAttribute("y", "5");
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "-12 -10 60 60");
        svg.setAttribute("x", "0");
        svg.setAttribute("y", "0");
        svg.setAttribute("preserveAspectRatio", "xMinYMin meet");
        svg.appendChild(rect);
        svg.appendChild(g);
        return svg;
    }
    createStyle() {
        const style = document.createElement("style");
        style.textContent = "svg{width:26px;border-radius:3px 0 0 3px;background:#006097;}svg rect{fill:#FFFFFF;stroke-width:0;}svg g{fill:#006097;}a{font-size:14px;border-radius:0 3px 3px 0;border-left:1px solid #FFFFFF;background:#006097;color:#FFFFFF;padding:4px 8px;margin-left:-3px;position:relative;top:-8px;display:inline-block;}";
        return style;
    }
    attributeChangedCallback(name, _, newValue) {
        if (name === "href") {
            this.link.href = newValue || "https://www.linkedin.com/";
        }
    }
    static get observedAttributes() {
        return ["href"];
    }
    get href() {
        return this.getAttribute("href");
    }
    set href(v) {
        if (v === null) {
            this.removeAttribute("href");
        }
        else {
            this.setAttribute("href", v);
        }
    }
}
customElements.define("linkedin-widget", LinkedInWidget);
export class TwitterWidget extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    get userName() {
        return this.getAttribute("username");
    }
    set userName(v) {
        if (v === null) {
            this.removeAttribute("username");
        }
        else {
            this.setAttribute("username", v);
        }
    }
    get showCount() {
        return this.hasAttribute("showcount");
    }
    set showCount(v) {
        if (v) {
            this.setAttribute("showcount", "");
        }
        else if (this.hasAttribute("showcount")) {
            this.removeAttribute("showcount");
        }
    }
    get dnt() {
        return this.hasAttribute("dnt");
    }
    set dnt(v) {
        if (v) {
            this.setAttribute("dnt", "");
        }
        else if (this.hasAttribute("dnt")) {
            this.removeAttribute("dnt");
        }
    }
    get largeSize() {
        return this.hasAttribute("largesize");
    }
    set largeSize(v) {
        if (v) {
            this.setAttribute("largesize", "");
        }
        else if (this.hasAttribute("largesize")) {
            this.removeAttribute("largesize");
        }
    }
    get showUserName() {
        return this.hasAttribute("showusername");
    }
    set showUserName(v) {
        if (v) {
            this.setAttribute("showusername", "");
        }
        else if (this.hasAttribute("showusername")) {
            this.removeAttribute("showusername");
        }
    }
    createWidget() {
        if (!this.isConnected) {
            return;
        }
        while (this.shadowRoot?.firstElementChild) {
            this.shadowRoot?.removeChild(this.shadowRoot?.firstElementChild);
        }
        if (this.userName !== null && this.shadowRoot !== null) {
            const container = document.createElement("div");
            this.shadowRoot.appendChild(container);
            twttr.widgets.createFollowButton(this.userName, container, {
                dnt: this.dnt,
                lang: this.lang,
                showCount: this.showCount,
                showScreenName: this.showUserName,
                size: this.largeSize ? "large" : undefined
            }).then((value) => {
                const valueHTML = value;
                valueHTML.style.width = "62.8px";
                valueHTML.style.height = "20px";
                valueHTML.style.visibility = "";
                valueHTML.style.position = "";
            });
        }
    }
    static get observedAttributes() {
        return ["username", "showcount", "dnt", "largesize", "showusername"];
    }
    attributeChangedCallback(_, __, ___) {
        this.createWidget();
    }
    connectedCallback() {
    }
}
customElements.define("twitter-widget", TwitterWidget);
export var GithubWidgetType;
(function (GithubWidgetType) {
    GithubWidgetType["Star"] = "star";
    GithubWidgetType["Watch"] = "watch";
    GithubWidgetType["Fork"] = "fork";
    GithubWidgetType["Follow"] = "follow";
    GithubWidgetType["Sponsor"] = "sponsor";
})(GithubWidgetType || (GithubWidgetType = {}));
export class GithubWidget extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.frame = document.createElement("iframe");
        this.frame.frameBorder = "0";
        this.frame.scrolling = "no";
        this.frame.style.width = "var(--width,auto)";
        this.frame.style.height = "var(--height,auto)";
        this.shadowRoot?.append(this.frame);
    }
    get user() {
        return this.getAttribute("user");
    }
    set user(v) {
        if (v === null) {
            this.removeAttribute("user");
        }
        else {
            this.setAttribute("user", v);
        }
    }
    get repo() {
        return this.getAttribute("repo");
    }
    set repo(v) {
        if (v === null) {
            this.removeAttribute("repo");
        }
        else {
            this.setAttribute("user", v);
        }
    }
    get type() {
        return this.getAttribute("type");
    }
    set type(v) {
        if (v === null) {
            this.removeAttribute("type");
        }
        else {
            this.setAttribute("type", v);
        }
    }
    get count() {
        return this.hasAttribute("count");
    }
    set count(v) {
        if (v) {
            this.setAttribute("count", "");
        }
        else if (this.hasAttribute("count")) {
            this.removeAttribute("count");
        }
    }
    get largeSize() {
        return this.hasAttribute("largeSize");
    }
    set largeSize(v) {
        if (v) {
            this.setAttribute("largesize", "");
        }
        else if (this.hasAttribute("largesize")) {
            this.removeAttribute("largesize");
        }
    }
    attributeChangedCallback(_, __, ___) {
        if ((this.user || this.repo) && this.type && !(this.user && this.repo)) {
            this.frame.src = "https://ghbtns.com/github-btn.html?" + (this.user ? "user=" + this.user : "repo=" + this.repo) + "&type=" + this.type + "&count=" + (this.count ? "true" : "false") + (this.largeSize ? "&size=large" : "");
        }
    }
    static get observedAttributes() {
        return ["user", "repo", "type", "count", "largesize"];
    }
}
customElements.define("github-widget", GithubWidget);
export var StackExchangeWidgetTheme;
(function (StackExchangeWidgetTheme) {
    StackExchangeWidgetTheme["Default"] = "";
    StackExchangeWidgetTheme["Clean"] = "clean";
    StackExchangeWidgetTheme["Dark"] = "dark";
    StackExchangeWidgetTheme["Hotdog"] = "hotdog";
})(StackExchangeWidgetTheme || (StackExchangeWidgetTheme = {}));
export class StackExchangeWidget extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.link = document.createElement("a");
        this.shadowRoot?.appendChild(this.link);
        this.img = document.createElement("img");
        this.link.appendChild(this.img);
        this.update();
    }
    get userId() {
        return this.getAttribute("userid");
    }
    set userId(v) {
        if (v === null) {
            this.removeAttribute("userid");
        }
        else {
            this.setAttribute("userid", v);
        }
    }
    get userName() {
        return this.getAttribute("username");
    }
    set userName(v) {
        if (v === null) {
            this.removeAttribute("username");
        }
        else {
            this.setAttribute("username", v);
        }
    }
    get theme() {
        return this.getAttribute("theme");
    }
    set theme(v) {
        if (v === null) {
            this.removeAttribute("theme");
        }
        else {
            this.setAttribute("theme", v);
        }
    }
    attributeChangedCallback(_, __, ___) {
        this.update();
    }
    static get observedAttributes() {
        return ["username", "userid", "theme"];
    }
    update() {
        if (this.userId !== null && this.userName !== null) {
            this.link.href = "https://stackexchange.com/users/" + this.userId;
            this.img.src = "https://stackexchange.com/users/flair/" + this.userId + ".png" + (this.theme === null || this.theme === StackExchangeWidgetTheme.Default ? "" : "?theme=" + this.theme);
            this.img.alt = "profile for " + this.userName + " on Stack Exchange, a network of free, community-driven Q&amp;A sites";
            this.img.title = this.img.alt;
        }
    }
}
customElements.define("stackexchange-widget", StackExchangeWidget);
export function dataBindWidget(data) {
    if (data.contactType === "LinkedIn") {
        const widget = document.createElement("linkedin-widget");
        widget.href = data.url;
        return widget;
    }
    else if (data.contactType === "Twitter") {
        const widget = document.createElement("twitter-widget");
        widget.userName = data.identifier;
        return widget;
    }
    else if (data.contactType === "GitHub") {
        const widget = document.createElement("github-widget");
        widget.type = GithubWidgetType.Follow;
        widget.user = data.identifier;
        return widget;
    }
    else if (data.contactType === "StackExchange") {
        const widget = document.createElement("stackexchange-widget");
        widget.userId = data.identifier;
        widget.userName = data.name;
        return widget;
    }
    throw new Error("Unknown contact type");
}
