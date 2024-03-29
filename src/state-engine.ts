import { register, unregister, ProviderCallback, SchemaConfig } from 'https://unpkg.com/hashed-es6@1.0.2'

/**
 * Configuration from HTML attributes.
 */
interface DataStateConfig {
    /**
     * The attribute to read or set.
     */
    attribute?: string;
    /**
     * Name of the event to listen to for changes.
     */
    event?: string;
    /**
     * ID to use in hash. If not set, ID of the element is used.
     */
    id?: string;
}

/**
 * Configuration for a tag.
 */
export interface TagConfig {
    /**
     * The attribute to read or set.
     */
    attribute: string;
    /**
     * Name of the event to listen to for changes.
     */
    event: string;
}

/**
 * Configuration for state engine.
 */
export interface StateEngineConfigEntry {
    /**
     * The element being configured.
     */
    element: Element;
    /**
     * The attribute to read or set.
     */
    attribute: string;
    /**
     * Name of the event to listen to for changes.
     */
    event: string;
    /**
     * ID to use in hash. May be the same as element's ID.
     */
    id: string;
}

const dataStateAttributeName = "data-state";

/**
 * Manage a section of a webage's state.
 */
export class StateEngine {
    /**
     * Method to call when state has changed.
     */
    private updateHash: ProviderCallback | null = null;
    /**
     * Configuration of state.
     */
    private readonly config: Record<string, StateEngineConfigEntry | undefined> = {};
    /**
     * hashUpdated bound to the current instance.
     */
    private readonly boundHashUpdated = this.hashUpdated.bind(this);
    /**
     * elementUpdated bound to the current instance.
     */
    private readonly boundElementUpdated = this.elementUpdated.bind(this);

    /**
     * Called when the hash is changed or on load.
     * @param state The state from the hash.
     */
    private hashUpdated(state: Record<string, any>): void {
        setTimeout(() => {
            for (const elementId of Object.keys(state)) {
                const elementConfig = this.config[elementId];
                if (elementConfig) {
                    elementConfig.element.setAttribute(elementConfig.attribute, state[elementId]);
                }
            }
        }, 0);
    }

    /**
     * When elements state is changed.
     * @param e Event information
     */
    private elementUpdated(e: Event): void {
        const element = e.target as (Element | null);
        if (element) {
            setTimeout(() => {
                const config = this.getConfig(element);
                if (config) {
                    if (this.updateHash) {
                        const elementAttribute = config.attribute;
                        this.updateHash({
                            [config.id]: element.getAttribute(elementAttribute)
                        });
                    } else if (config.event) {
                        element.removeEventListener(config.event, this.boundElementUpdated);
                    }
                }
            }, 0);
        }
    }

    /**
     * Initializes state engine.
     * @param root manage state for all sub elements.
     */
    initialize(root: Element): void {
        this.reset();
        const startingState: SchemaConfig = {};
        for (const element of root.querySelectorAll("*[data-state]")) {
            const config = this.getConfig(element);
            if (config) {
                this.config[config.id] = config;
                startingState[config.id] = element.getAttribute(config.attribute) ?? "";
                element.addEventListener(config.event, this.boundElementUpdated);
            }
        }
        this.updateHash = register(startingState, this.boundHashUpdated);
    }

    /**
     * Reset state, clearing all handlers.
     */
    reset(): void {
        if (this.updateHash) {
            unregister(this.updateHash);
        }
        for (const elementId of Object.keys(this.config)) {
            const elementConfig = this.config[elementId];
            if (elementConfig) {
                elementConfig.element.removeEventListener(elementConfig.event, this.boundElementUpdated);
            }
        }
    }

    /**
     * Configurations for event and attribute based on tag name.
     */
    readonly tagConfigs: Record<string, TagConfig | undefined | null> = {};

    /**
     * Gets the {@link StateEngineConfigEntry} for an element.
     * @param element The element to process.
     * @returns Configuration based on data attrbute and tag config or null.
     */
    private getConfig(element: Element): StateEngineConfigEntry | null {
        if (element.hasAttribute(dataStateAttributeName)) {
            const elementConfig = JSON.parse(element.getAttribute(dataStateAttributeName) || "{}") as DataStateConfig
            const elementId = element.id || elementConfig.id;
            const tagConfig = this.tagConfigs[element.tagName];
            const elementEvent = elementConfig.event ?? tagConfig?.event ?? null;
            const elementAttribute = elementConfig.attribute ?? tagConfig?.attribute ?? null;
            if (elementId && elementEvent && elementAttribute) {
                return {
                    attribute: elementAttribute,
                    element: element,
                    event: elementEvent,
                    id: elementId
                };
            }
        }
        return null;
    }
}