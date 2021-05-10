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

/**
 * Style of {@link ShieldIOBadge}.
 */
export enum BadgeStyle {
    Plastic = "plastic",
    Flat = "flat",
    FlatSquare = "flat-square",
    ForTheBadge = "for-the-badge",
    Social = "social"
}

/**
 * Shield IO Badge
 *
 * @see {@link https://shields.io/}
 */
export class ShieldIOBadge extends HTMLElement implements LifecycleCallbacks {
    private readonly img: HTMLImageElement;

    /**
     * Create a new instance of the {@linkcode ShieldIOBadge} class.
     */
    constructor() {
        super();

        this.attachShadow({mode: 'open'});
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

    /**
     * Gets the left-hand-side text if overwriten; otherwise null.
     */
    public get label() : string | null {
        return this.getAttribute("label");
    }
    /**
     * Sets the left-hand-side text. To use default set to null.
     */
    public set label(v : string | null) {
        if (v) {
            this.setAttribute("label", v);
        } else {
            this.removeAttribute("label");
        }
    }

    /**
     * Gets the right-hand-side text.
     */
    public get message() : string | null {
        return this.getAttribute("message");
    }
    /**
     * Sets the right-hand-side text.
     */
    public set message(v : string | null) {
        if (v) {
            this.setAttribute("message", v);
        } else {
            this.removeAttribute("message");
        }
    }

    /**
     * Gets the logo to use.
     *
     */

    public get logo() : string | null {
        return this.getAttribute("logo");
    }
    /**
     * Sets the logo to use.
     *
     */
    public set logo(v : string | null) {
        if (v) {
            this.setAttribute("logo", v);
        } else {
            this.removeAttribute("logo");
        }
    }

    /**
     * Gets the color of the right-hand-side background.
     */
    public get color() : string | null {
        return this.getAttribute("color");
    }
    /**
     * Sets the color of the right-hand-side background.
     */
    public set color(v : string | null) {
        if (v) {
            this.setAttribute("color", v);
        } else {
            this.removeAttribute("color");
        }
    }

    /**
     * Gets the color of the logo.
     */
    public get logoColor() : string | null {
        return this.getAttribute("logocolor");
    }
    /**
     * Sets the color of the logo.
     */
    public set logoColor(v : string | null) {
        if (v) {
            this.setAttribute("logocolor", v);
        } else {
            this.removeAttribute("logocolor");
        }
    }

    /**
     * Gets the color of the left-hand-side background.
     */
    public get labelColor() : string | null {
        return this.getAttribute("labelcolor");
    }
    /**
     * Sets the color of the left-hand-side background.
     */
    public set labelColor(v : string | null) {
        if (v) {
            this.setAttribute("labelcolor", v);
        } else {
            this.removeAttribute("labelcolor");
        }
    }

    /**
     * Gets the horizontal space for the logo.
     */
    public get logoWidth() : number | null {
        var lw = this.getAttribute("logowidth");
        if (lw) {
            return parseInt(lw, 10);
        }
        return null;
    }
    /**
     * Sets the horizontal space for the logo.
     */
    public set logoWidth(v : number | null) {
        if (v) {
            this.setAttribute("logowidth", v.toString());
        } else {
            this.removeAttribute("logowidth");
        }
    }

    /**
     * Gets the style of the badge.
     *
     * @default {@linkcode BadgeStyle.Flat}
     */
    public get badgeStyle() : BadgeStyle {
        return this.getAttribute("badgestyle") as BadgeStyle || BadgeStyle.Flat;
    }
    /**
     * Sets the style of the badge.
     *
     * @default {@linkcode BadgeStyle.Flat}
     */
    public set badgeStyle(v : BadgeStyle) {
        if (v !== BadgeStyle.Flat) {
            this.setAttribute("badgestyle", v);
        } else {
            this.removeAttribute("badgestyle");
        }
    }

    public get tagName() : string {
        return ShieldIOBadge.tagName;
    }

    public static get tagName(): string {
        return "SHIELDIO-BADGE";
    }
}

customElements.define(ShieldIOBadge.tagName, ShieldIOBadge);

declare global {
    interface HTMLElementTagNameMap {
        "shieldio-badge": ShieldIOBadge;
    }
}