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

export enum ShieldIOStyle {
    Plastic = "plastic",
    Flat = "flat",
    FlatSquare = "flat-square",
    ForTheBadge = "for-the-badge",
    Social = "social"
}

export class ShieldIOStaticWidget extends HTMLElement implements LifecycleCallbacks {
    private readonly img: HTMLImageElement;

    constructor() {
        super();

        this.attachShadow({mode: 'open'}); // sets and returns 'this.shadowRoot'
        this.img = document.createElement("img");
        this.shadowRoot?.appendChild(this.img);

        this.setSrc();
    }

    private setSrc() {
        const srcPath: string[] = [];
        if(this.label) {
            srcPath.push("label=" + encodeURIComponent(this.label));
        } else {
            srcPath.push("label=");
        }
        if (this.message) {
            srcPath.push("message=" + encodeURIComponent(this.message));
        }
        if (this.logo) {
            srcPath.push("logo=" + encodeURIComponent(this.logo));
        }
        if (this.color) {
            srcPath.push("color=" + encodeURIComponent(this.color));
        }
        if (this.logoColor) {
            srcPath.push("logoColor=" + encodeURIComponent(this.logoColor));
        }
        if (this.labelColor) {
            srcPath.push("labelColor=" + encodeURIComponent(this.labelColor));
        }
        if (this.logoWidth) {
            srcPath.push("logoWidth=" + encodeURIComponent(this.logoWidth));
        }
        if (this.badgeStyle) {
            srcPath.push("style=" + encodeURIComponent(this.badgeStyle));
        }
        this.img.src = "https://img.shields.io/static/v1?" + srcPath.join("&");
        this.img.alt = this.label || "";
    }

    static get observedAttributes(): string[] {
        return ["label", "message", "logo", "color", "logoColor", "labelColor", "logoWidth", "badgeStyle"];
    }

    public attributeChangedCallback(_: string, __: string, ___: string) {
        this.setSrc();
    }

    public get label() : string | null {
        return this.getAttribute("label");
    }
    public set label(v : string | null) {
        if (v) {
            this.setAttribute("label", v);
        } else {
            this.removeAttribute("label");
        }
    }

    public get message() : string | null {
        return this.getAttribute("message");
    }
    public set message(v : string | null) {
        if (v) {
            this.setAttribute("message", v);
        } else {
            this.removeAttribute("message");
        }
    }

    public get logo() : string | null {
        return this.getAttribute("logo");
    }
    public set logo(v : string | null) {
        if (v) {
            this.setAttribute("logo", v);
        } else {
            this.removeAttribute("logo");
        }
    }

    public get color() : string | null {
        return this.getAttribute("color");
    }
    public set color(v : string | null) {
        if (v) {
            this.setAttribute("color", v);
        } else {
            this.removeAttribute("color");
        }
    }

    public get logoColor() : string | null {
        return this.getAttribute("logocolor");
    }
    public set logoColor(v : string | null) {
        if (v) {
            this.setAttribute("logocolor", v);
        } else {
            this.removeAttribute("logocolor");
        }
    }

    public get labelColor() : string | null {
        return this.getAttribute("labelcolor");
    }
    public set labelColor(v : string | null) {
        if (v) {
            this.setAttribute("labelcolor", v);
        } else {
            this.removeAttribute("labelcolor");
        }
    }
;
    public get logoWidth() : number | null {
        var lw = this.getAttribute("logowidth");
        if (lw) {
            return parseInt(lw, 10);
        }
        return null;
    }
    public set logoWidth(v : number | null) {
        if (v) {
            this.setAttribute("logowidth", v.toString());
        } else {
            this.removeAttribute("logowidth");
        }
    }

    public get badgeStyle() : ShieldIOStyle | null {
        return this.getAttribute("badgestyle") as ShieldIOStyle;
    }
    public set badgeStyle(v : ShieldIOStyle | null) {
        if (v) {
            this.setAttribute("badgestyle", v);
        } else {
            this.removeAttribute("badgestyle");
        }
    }

}

customElements.define("shieldio-static-widget", ShieldIOStaticWidget);

declare global {
    interface HTMLElementTagNameMap {
        "shieldio-static-widget": ShieldIOStaticWidget;
    }
}