export interface LifecycleCallbacks {
    /**
     * Invoked each time the custom element is appended into a document-connected element. This will happen each time the node is moved, and may happen before the element's contents have been fully parsed.
     *
     * Note: connectedCallback may be called once your element is no longer connected, use Node.isConnected to make sure.
     */
    connectedCallback?(): void;
    /**
     * Invoked each time the custom element is disconnected from the document's DOM.
     */
    disconnectedCallback?(): void;
    /**
     * Invoked each time the custom element is moved to a new document.
     */
    adoptedCallback?(): void;
    /**
     * Invoked each time one of the custom element's attributes is added, removed, or changed. Which attributes to notice change for is specified in a static get observedAttributes method
     * @param name
     * @param oldValue
     * @param newValue
     */
    attributeChangedCallback?(name: string, oldValue: string, newValue: string): void;
}

export enum DiagnalRibbonCorner {
    TopRight = "right-top",
    BottomRight = "right-bottom",
    TopLeft = "left-top",
    BottomLeft = "left-bottom"
}

export class DiagnalRibbon extends HTMLElement {
    private readonly hyperLink: HTMLAnchorElement;
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

    private createStyleLink(): HTMLLinkElement {
        const link = document.createElement("link");
        link.href = "https://cdnjs.cloudflare.com/ajax/libs/github-fork-ribbon-css/0.2.3/gh-fork-ribbon.min.css";
        link.rel = "stylesheet";
        return link;
    }

    private createHyperLink(): HTMLAnchorElement {
        const a = document.createElement("a");
        a.classList.add("github-fork-ribbon");
        return a;
    }

    public get href() : string | null {
        return this.getAttribute("href");
    }
    public set href(v : string | null) {
        if (v === null) {
            this.removeAttribute("href");
        } else {
            this.setAttribute("href", v);
        }
    }

    public get text() : string | null {
        return this.getAttribute("text");
    }
    public set text(v : string | null) {
        if (v === null) {
            this.removeAttribute("text");
        } else {
            this.setAttribute("test", v);
        }
    }

    public get corner() : DiagnalRibbonCorner {
        return this.getAttribute("corner") as DiagnalRibbonCorner || DiagnalRibbonCorner.TopRight;
    }
    public set corner(v : DiagnalRibbonCorner) {
        this.setAttribute("corner", v);
    }

    private update(): void {
        const corners = [ DiagnalRibbonCorner.BottomLeft, DiagnalRibbonCorner.BottomRight, DiagnalRibbonCorner.TopLeft, DiagnalRibbonCorner.TopRight ];
        for (const corner of corners) {
            if (corner === this.corner) {
                this.hyperLink.classList.add(corner);
            } else {
                this.hyperLink.classList.remove(corner);
            }
        }

        this.hyperLink.href = this.href ?? "";

        this.hyperLink.setAttribute("data-ribbon", this.text ?? "");
        this.hyperLink.title = this.text ?? "";
        this.hyperLink.innerText = this.text ?? "";
    }

    attributeChangedCallback?(_: string, __: string, ___: string): void {
        this.update();
    }

    static get observedAttributes(): string[] {
        return ["href", "text", "corner"];
    }
}

customElements.define("diagnal-ribbon", DiagnalRibbon);

declare global {
    interface HTMLElementTagNameMap {
        "diagnal-ribbon": DiagnalRibbon;
    }
}