import { register, unregister, ProviderCallback, SchemaConfig } from 'https://unpkg.com/hashed-es6@1.0.2'

interface DataStateConfig {
    attribute?: string;
    event?: string;
    id?: string;
}

export interface StateEngineConfigEntry {
    element: Element;
    attribute: string;
    event: string;
    id: string;
}

/**
 * Manage a section of a webage's state.
 */
export class StateEngine {
    private updateHash: ProviderCallback | null = null;
    private readonly config: Record<string, StateEngineConfigEntry> = {};
    private readonly boundHashUpdated = this.hashUpdated.bind(this);
    private readonly boundElementUpdated = this.elementUpdated.bind(this);

    /**
     * Called when the hash is changed or on load.
     * @param state The state from the hash.
     */
    private hashUpdated(state: Record<string, any>): void {
        setTimeout(() => {
            for (const elementId of Object.keys(state)) {
                const elementConfig = this.config[elementId];
                elementConfig.element.setAttribute(elementConfig.attribute, state[elementId]);
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
                const elementConfig = JSON.parse(element.getAttribute("data-state") ?? "{}") as DataStateConfig
                const elementId = element.id || elementConfig.id;
                if (elementId && elementConfig.attribute) {
                    if (this.updateHash) {
                        const elementAttribute = elementConfig.attribute;
                        this.updateHash({
                            [elementId]: element.getAttribute(elementAttribute)
                        });
                    } else if (elementConfig.event) {
                        element.removeEventListener(elementConfig.event, this.boundElementUpdated);
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
            const elementConfig = JSON.parse(element.getAttribute("data-state") ?? "{}") as DataStateConfig
            const elementId = element.id || elementConfig.id;
            if (elementId && elementConfig.attribute && elementConfig.event) {
                const elementAttribute = elementConfig.attribute;
                this.config[elementId] = {
                    element: element,
                    attribute: elementAttribute,
                    event: elementConfig.event,
                    id: elementId
                };
                startingState[elementId] = element.getAttribute(elementAttribute) || "";
                element.addEventListener(elementConfig.event, this.boundElementUpdated);
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
            elementConfig.element.removeEventListener(elementConfig.event, this.boundElementUpdated);
        }
    }
}