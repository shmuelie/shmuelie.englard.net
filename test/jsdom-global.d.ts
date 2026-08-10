// Minimal ambient declaration for `jsdom-global`, which ships without types.
// See https://github.com/rstacruz/jsdom-global
declare module 'jsdom-global' {
    /**
     * Enable jsdom globally.
     * @returns A cleanup function that removes the injected globals.
     */
    function jsdomGlobal(html?: string, options?: Record<string, unknown>): () => void;
    export default jsdomGlobal;
}
