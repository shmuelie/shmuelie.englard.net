import * as nodeModule from 'node:module';
import * as unpkg from './../unpkg.mjs';

// Mirror the build/runtime resolution so tests can import the same unpkg.com
// URLs used by the source and have them resolved to local node_modules.
// registerHooks requires Node 23+; on older runtimes this is a no-op (tests
// that import unpkg URLs simply require Node 23, matching the project).
const registerHooks = (nodeModule as { registerHooks?: (hooks: unknown) => void }).registerHooks;
if (typeof registerHooks === 'function') {
    registerHooks({ resolve: unpkg.resolve });
}
