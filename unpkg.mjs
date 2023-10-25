import path from 'path'

/**
 * @typedef {{format?:'builtin'|'commonjs'|'json'|'module'|'wasm'|null,importAttributes?:object,shortCircuit?:boolean,url:string}} ResolveResult
 */

/**
 * Map unpkg.com imports to local paths.
 *
 * @param {string} specifier
 * @param {{conditions:string[];importAttributes:object;parentURL?:string}} context
 * @param {(specifier:string,context:object) => ResolveResult} nextResolve
 * @returns {ResolveResult}
 */
export function resolve(specifier, context, nextResolve) {
    const regex = /^https?:\/\/unpkg\.com\/([A-Za-z0-9-.]+)@\d+\.\d+\.\d+\/(.+)$/;
    const match = regex.exec(specifier);

    if (!match) {
        return nextResolve(specifier, context);
    }

    return {
        url: 'file://' +
            path.join(
                path.resolve('.'),
                'node_modules',
                match[1],
                match[2]
            ),
        shortCircuit: true
    };
}