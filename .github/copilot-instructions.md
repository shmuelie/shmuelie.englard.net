# Copilot Instructions

## Build & Dev Commands

- **Package manager:** pnpm (enforced via `preinstall` script — npm/yarn will fail)
- **Node.js:** v23+ required (uses `node:module` `registerHooks` API)
- **Install:** `pnpm install` (also runs `postinstall` which generates `tsconfig.paths.json`)
- **Build:** `pnpm build` (runs gulp: clean → TypeScript → Sass → HTML → copy static)
- **Preview:** `pnpm run test-server` (serves `dist/` on localhost:8000)
- **Clean:** `pnpm run clean`
- There are no automated tests or linters.

### Individual Gulp Tasks

Run with `gulp <taskName>`:

- `buildTypeScriptProject` — Compile and minify TypeScript
- `buildSass` — Compile and minify SCSS
- `buildHtml` — Render HTML with data binding via jsdom
- `copyStatic` — Copy static assets from `www/` to `dist/`
- `generateNodeModulePathMappings` — Regenerate `tsconfig.paths.json` (run after changing dependencies)

## Architecture

### unpkg CDN Import System

Source code uses **full unpkg.com URLs** as ES module import specifiers. In production (browser), these resolve directly to the CDN. During development and build, two mechanisms redirect them to local `node_modules`:

1. **TypeScript compilation:** `tsconfig.paths.json` (auto-generated at `postinstall`, gitignored) maps each unpkg URL to the local package path. Do not hand-edit.
2. **Node.js runtime:** `unpkg.mts` exports a `resolve` hook registered via `registerHooks()` in `gulp/index.mts`, intercepting unpkg URLs and resolving them to `file://` paths.

When adding a new dependency: add it to `devDependencies` (even if it's a runtime dep), then `pnpm install` will regenerate the path mappings automatically.

### Build-Time HTML Rendering

`buildHtml` uses jsdom + `microdata-tooling` to render dynamic content into static HTML at build time:

- Data files in `data/` export arrays of Schema.org-typed objects (ContactPoint, PodcastSeries, etc.)
- `src/index.htm` contains `<template data-type="...">` elements with `itemprop` attributes
- The `microdata-tooling` `apply()` function clones templates and populates them with data
- Contact points use custom `shieldsio-elements` badge web components
- The result is fully static HTML — no server-side rendering at runtime

### Web Components (Lit + Web Awesome)

The UI uses [Web Awesome](https://webawesome.com/) (`wa-*` custom elements) for tabs, cards, spinners, and other standard components.

The `blog-element` custom element in `src/blog/` is built on [Lit](https://lit.dev/):

- **Registration:** `@customElement('blog-element')` decorator
- **Reactive state:** `@state()` for internal state, `@property()` for HTML attributes
- **Change handlers:** `updated(changedProperties)` lifecycle method
- **Templates:** `render()` method returning `html` tagged template literals
- **Styles:** Static `styles` property with `css` tagged template literal

The blog component fetches content from the Drop-in Blog API (`src/drop-in-blog/Blog.ts`) and persists navigation state in the URL hash via `hashed-es6`.

## Conventions

- **All runtime libraries are listed as `devDependencies`** because they load from CDN in production. There are no `dependencies`.
- **Import paths in TypeScript** must use full unpkg.com URLs for external packages (e.g., `import { LitElement } from 'https://unpkg.com/lit@3.3.2/index.js'`). Use relative paths with `.js` extensions for internal modules.
- **SCSS partials** use `_` prefix and `~` resolves to `node_modules/` via a custom `findFileUrl` importer.
- **Schema.org microdata** is used for structured data throughout — data files, HTML templates, and TypeScript interfaces all align with Schema.org types defined in `data/schema.d.ts`.
- **TypeScript** is configured with full strict mode and `experimentalDecorators`.
