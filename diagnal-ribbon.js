export var DiagnalRibbonCorner;
(function (DiagnalRibbonCorner) {
    DiagnalRibbonCorner["TopRight"] = "right-top";
    DiagnalRibbonCorner["BottomRight"] = "right-bottom";
    DiagnalRibbonCorner["TopLeft"] = "left-top";
    DiagnalRibbonCorner["BottomLeft"] = "left-bottom";
})(DiagnalRibbonCorner || (DiagnalRibbonCorner = {}));
export class DiagnalRibbon extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.hyperLink = this.createHyperLink();
        if (this.shadowRoot) {
            this.shadowRoot.appendChild(this.createStyleLink());
            this.shadowRoot.appendChild(this.hyperLink);
        }
        this.update();
    }
    createStyleLink() {
        const link = document.createElement("link");
        link.href = "https://cdnjs.cloudflare.com/ajax/libs/github-fork-ribbon-css/0.2.3/gh-fork-ribbon.min.css";
        link.rel = "stylesheet";
        return link;
    }
    createHyperLink() {
        const a = document.createElement("a");
        a.classList.add("github-fork-ribbon");
        return a;
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
    get text() {
        return this.getAttribute("text");
    }
    set text(v) {
        if (v === null) {
            this.removeAttribute("text");
        }
        else {
            this.setAttribute("test", v);
        }
    }
    get corner() {
        return this.getAttribute("corner") || DiagnalRibbonCorner.TopRight;
    }
    set corner(v) {
        this.setAttribute("corner", v);
    }
    update() {
        const corners = [DiagnalRibbonCorner.BottomLeft, DiagnalRibbonCorner.BottomRight, DiagnalRibbonCorner.TopLeft, DiagnalRibbonCorner.TopRight];
        for (const corner of corners) {
            if (corner === this.corner) {
                this.hyperLink.classList.add(corner);
            }
            else {
                this.hyperLink.classList.remove(corner);
            }
        }
        this.hyperLink.href = this.href || "";
        this.hyperLink.setAttribute("data-ribbon", this.text || "");
        this.hyperLink.title = this.text || "";
        this.hyperLink.innerText = this.text || "";
    }
    attributeChangedCallback(_, __, ___) {
        this.update();
    }
    static get observedAttributes() {
        return ["href", "text", "corner"];
    }
}
customElements.define("diagnal-ribbon", DiagnalRibbon);
