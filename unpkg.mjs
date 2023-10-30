import path from 'path'

/**
 * Format of JavaScript import
 * @typedef {'builtin'|'commonjs'|'json'|'module'|'wasm'|null} PackageFormat
 */
/**
 * Result of calls to `resolve`
 * @typedef {{format?:PackageFormat,importAttributes?:object,shortCircuit?:boolean,url:string}} ResolveResult
 */
/**
 * Context of `resolve` call
 * @typedef {{conditions:string[];importAttributes:object;parentURL?:string}} ResolveContext
 */
/**
 * Next resolver in the chain.
 * @typedef {(specifier:string,context:object) => ResolveResult} NextResolver
 */

/**
 * Map unpkg.com imports to local paths.
 *
 * @param {string} specifier Current imports specifier.
 * @param {ResolveContext} context Current import context.
 * @param {NextResolver} nextResolve Next resolver in the chain.
 * @returns {ResolveResult} Result of the attempt to resolve.
 */
export function resolve(specifier, context, nextResolve) {
    const regex = /^https?:\/\/unpkg\.com\/([A-Za-z0-9-.]+)@\d+\.\d+\.\d+\/(.+)$/;
    const match = regex.exec(specifier);

    // If specifier isn't to unpkg.com, just forward to next resolver.
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