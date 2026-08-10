import * as nodeModule from 'node:module';
import { createRequire } from 'node:module';
import { realpathSync, statSync } from 'node:fs';
import path from 'node:path';
import * as unpkg from './../unpkg.mjs';

// Mirror the build/runtime resolution so tests can import the same unpkg.com
// URLs used by the source and have them resolved to local node_modules.
// registerHooks requires Node 23+; on older runtimes this is a no-op (tests
// that import unpkg URLs simply require Node 23, matching the project).
const registerHooks = (nodeModule as { registerHooks?: (hooks: unknown) => void }).registerHooks;

interface HookResult {
    url: string;
    shortCircuit?: boolean;
}

type NextResolver = (specifier: string, context: object) => HookResult;

// Turn a file path produced by `unpkg.resolve` into a URL Node can actually
// load. This resolves pnpm's symlinked `node_modules` paths to their real
// location (so transitive bare specifiers such as lit's `@lit/reactive-element`
// resolve from the package's real directory) and expands a bare package root
// (e.g. `hashed-es6` with no subpath) to the package's entry point.
function toLoadableUrl(filePath: string): string {
    let resolved = realpathSync(filePath);
    if (statSync(resolved).isDirectory()) {
        const require = createRequire(path.join(resolved, 'package.json'));
        resolved = realpathSync(require.resolve('.'));
    }
    return 'file://' + resolved;
}

if (typeof registerHooks === 'function') {
    registerHooks({
        resolve(specifier: string, context: object, nextResolve: NextResolver): HookResult {
            const result = unpkg.resolve(specifier, context as never, nextResolve as never);
            if (result?.shortCircuit && typeof result.url === 'string' && result.url.startsWith('file://')) {
                try {
                    return { ...result, url: toLoadableUrl(result.url.slice('file://'.length)) };
                } catch { /* fall back to the original url */ }
            }
            return result;
        }
    });
}
