import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import type { BrowserContext, Page } from '@playwright/test';

// In production every runtime library loads from unpkg.com (see the importmap in
// src/index.htm and the full unpkg URLs used throughout the source). The E2E
// suite serves the byte-identical files from the local `node_modules` instead of
// hitting the CDN. This keeps the tests deterministic and runnable offline while
// still exercising the real Web Awesome + Lit assets (same package versions),
// mirroring the Node-side `unpkg.mts` resolve hook used by the build.

const ROOT = process.cwd();

// `https://unpkg.com/<pkg>@<version>[/<subpath>]` -> package, version, subpath.
const UNPKG_RE = /^((?:@[^/]+\/)?[^/@]+)@([^/]+)(?:\/(.*))?$/;

/**
 * Locate the local directory for a package at a given version, preferring a
 * hoisted top-level install and falling back to the flat pnpm store (whose
 * directory names encode the exact version, e.g. `@lit+reactive-element@2.1.2`).
 */
function packageDir(pkg: string, version: string): string | null {
    const topLevel = path.join(ROOT, 'node_modules', pkg);
    if (existsSync(topLevel)) {
        return topLevel;
    }
    const pnpm = path.join(
        ROOT,
        'node_modules',
        '.pnpm',
        `${pkg.replace('/', '+')}@${version}`,
        'node_modules',
        pkg
    );
    return existsSync(pnpm) ? pnpm : null;
}

/** Resolve the entry file of a package from its `module`/`main` field. */
function packageEntry(dir: string): string {
    try {
        const pkgJson = JSON.parse(readFileSync(path.join(dir, 'package.json'), 'utf-8'));
        const entry: string | undefined = pkgJson.module ?? pkgJson.main;
        if (entry) {
            return path.join(dir, entry);
        }
    } catch { /* fall through to index.js */ }
    return path.join(dir, 'index.js');
}

/**
 * Map an `https://unpkg.com/...` URL to an absolute path in the local
 * `node_modules`, applying the same extension/index resolution unpkg performs.
 * Returns `null` when the URL is not an unpkg URL or cannot be resolved.
 */
export function resolveUnpkgToFile(urlString: string): string | null {
    let pathname: string;
    try {
        const url = new URL(urlString);
        if (url.hostname !== 'unpkg.com') {
            return null;
        }
        pathname = decodeURIComponent(url.pathname).replace(/^\//, '');
    } catch {
        return null;
    }

    const match = UNPKG_RE.exec(pathname);
    if (!match) {
        return null;
    }
    const [, pkg, version, subpath] = match;
    const dir = packageDir(pkg, version);
    if (!dir) {
        return null;
    }

    if (!subpath) {
        return packageEntry(dir);
    }

    let filePath = path.join(dir, subpath);
    if (existsSync(filePath) && statSync(filePath).isFile()) {
        return filePath;
    }
    if (existsSync(`${filePath}.js`)) {
        return `${filePath}.js`;
    }
    if (existsSync(filePath) && statSync(filePath).isDirectory()) {
        return packageEntry(filePath);
    }
    return existsSync(filePath) ? filePath : null;
}

const CONTENT_TYPES: Record<string, string> = {
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.cjs': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.map': 'application/json; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.png': 'image/png'
};

function contentType(filePath: string): string {
    return CONTENT_TYPES[path.extname(filePath).toLowerCase()] ?? 'application/octet-stream';
}

/**
 * Route every `https://unpkg.com/*` request to the matching local file. Adds a
 * permissive CORS header because the browser loads these as cross-origin module
 * scripts (unpkg serves them with CORS in production too).
 */
export async function routeUnpkg(target: Page | BrowserContext): Promise<void> {
    await target.route('https://unpkg.com/**', async (route) => {
        const filePath = resolveUnpkgToFile(route.request().url());
        if (!filePath || !existsSync(filePath)) {
            await route.fulfill({ status: 404, body: `Not found in node_modules: ${route.request().url()}` });
            return;
        }
        await route.fulfill({
            status: 200,
            headers: { 'access-control-allow-origin': '*', 'cache-control': 'no-store' },
            contentType: contentType(filePath),
            body: readFileSync(filePath)
        });
    });
}
