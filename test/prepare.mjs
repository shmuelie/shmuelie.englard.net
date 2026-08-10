import { mkdirSync, writeFileSync } from 'node:fs';

// Mark the compiled test output as ES modules so Node executes the emitted
// `.js` files (compiled from the source `.ts`) with import/export semantics.
mkdirSync('.test-out', { recursive: true });
writeFileSync('.test-out/package.json', JSON.stringify({ type: 'module' }));
