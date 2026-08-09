import path from 'path'

type PackageFormat = 'builtin' | 'commonjs' | 'json' | 'module' | 'wasm' | null;

interface ResolveResult {
    format?: PackageFormat;
    importAttributes?: object;
    shortCircuit?: boolean;
    url: string;
}

interface ResolveContext {
    conditions: string[];
    importAttributes: object;
    parentURL?: string;
}

type NextResolver = (specifier: string, context: object) => ResolveResult;

/**
 * Map unpkg.com imports to local paths.
 */
export function resolve(specifier: string, context: ResolveContext, nextResolve: NextResolver): ResolveResult {
    const regex = /^https?:\/\/unpkg\.com\/((?:@[A-Za-z0-9._-]+\/)?[A-Za-z0-9._-]+)@\d+\.\d+\.\d+(?:[A-Za-z0-9._-]*)(?:\/(.+))?$/;
    const match = regex.exec(specifier);

    // If specifier isn't to unpkg.com, just forward to next resolver.
    if (!match) {
        return nextResolve(specifier, context);
    }

    const parts = [path.resolve('.'), 'node_modules', match[1]];
    if (match[2]) {
        parts.push(match[2]);
    }

    return {
        url: 'file://' + path.join(...parts),
        shortCircuit: true
    };
}