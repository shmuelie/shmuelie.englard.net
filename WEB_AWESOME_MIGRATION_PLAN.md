# Plan: Migrate from FAST/Fluent UI to Web Awesome

## Overview

Replace the FAST Element + Fluent UI Web Components stack with [Web Awesome](https://github.com/shoelace-style/webawesome/) (the Shoelace successor). This eliminates the blocked FAST v1→v2 upgrade path and moves to an actively maintained, framework-agnostic web components library with a built-in CSS framework and design token system.

**Prerequisite:** This plan assumes the Azure migration (see `azure-migration` branch) is completed first, since it changes the deployment pipeline. The code changes here are independent of hosting, but the branches should be merged in order.

## Why Web Awesome

- FAST Element v1 and Fluent UI Web Components v2 are at end-of-life (no new releases)
- Upgrading to FAST v2 requires Fluent UI v3 (still RC), which removes `fluent-card`, `fluent-flipper`, `fluent-progress-ring` and completely changes the design token system
- Web Awesome is stable, actively maintained, framework-agnostic, and has equivalents for every component we use
- CDN-friendly — aligns with this site's unpkg import pattern
- Includes a full CSS framework with design tokens, eliminating the need for `office-ui-fabric-core` and `@fluentui/common-styles`

## Component Mapping

| Current (Fluent UI) | Web Awesome Equivalent | Notes |
|---------------------|----------------------|-------|
| `<fluent-tabs>` | `<wa-tab-group>` | Similar API, uses `placement` instead of orientation |
| `<fluent-tab>` | `<wa-tab>` | Uses `panel` attr to link to panel, `slot="nav"` required |
| `<fluent-tab-panel>` | `<wa-tab-panel>` | Uses `name` attr to match tab's `panel` attr |
| `<fluent-card>` | `<wa-card>` | Direct equivalent |
| `<fluent-flipper>` | `<wa-icon-button>` | No direct flipper; use icon button with arrow icon |
| `<fluent-progress-ring>` | `<wa-spinner>` | Direct equivalent |
| `<fluent-blog>` | Custom element (rewrite) | Keep as custom element, remove FAST dependency |

## Architecture Change: Blog Component

The blog component (`src/blog/`) is currently built on FAST Element's reactive system (`FASTElement`, `@observable`, `@attr`, `html` tagged templates, `when`, `repeat`, `render` directive). Web Awesome uses [Lit](https://lit.dev/) under the hood, but for a custom component we have two options:

### Option A: Rewrite blog component using Lit (Recommended)
- Web Awesome is built on Lit, so using Lit for the custom blog component ensures consistency
- Lit has equivalents for everything FAST provides: `LitElement` base class, `@property`/`@state` decorators, `html`/`css` tagged templates, `when`/`repeat`/`render` directives
- The reactive patterns map almost 1:1

### Option B: Rewrite blog component as vanilla web component
- Use plain `HTMLElement` with manual DOM updates
- Simpler dependency-wise but more boilerplate
- Loses reactive templating

**Recommendation: Option A (Lit)** — less code to write, closest to the current FAST patterns, and compatible with Web Awesome's internals.

## Detailed Migration Map

### FAST API → Lit Equivalent

| FAST Element | Lit | Used in |
|-------------|-----|---------|
| `FASTElement` base class | `LitElement` | `FluentBlog.ts` |
| `@customElement({name, template, styles})` | `@customElement('name')` + static `styles` + `render()` method | `FluentBlog.ts` |
| `@observable` | `@state()` (internal reactive state) | `FluentBlog.ts` |
| `@attr({attribute, converter})` | `@property({attribute, converter})` | `FluentBlog.ts` |
| `propertyChanged()` callbacks | `willUpdate(changedProperties)` or `updated()` | `FluentBlog.ts` |
| `this.$emit('change')` | `this.dispatchEvent(new Event('change'))` | `FluentBlog.ts` |
| `html` tagged template | `html` from `lit` | All template files |
| `css` tagged template | `css` from `lit` | `styles.ts` |
| `when(cond, trueT, falseT)` | `${cond ? trueT : falseT}` or `when()` from `lit/directives/when.js` | Multiple templates |
| `repeat(items, template)` | `${items.map(item => ...)}` or `repeat()` from `lit/directives/repeat.js` | `listTemplate.ts` |
| `render()` directive | Not needed — Lit's `render()` method handles this | `render.ts` (delete) |
| `:innerHTML` binding | `unsafeHTML()` from `lit/directives/unsafe-html.js` | `postTemplate.ts` |

### Files to Change

| File | Action | Scope |
|------|--------|-------|
| **Package & Config** | | |
| `package.json` | Remove FAST/Fluent deps, add `lit` + `@AW/webawesome` | |
| **Blog component (complete rewrite)** | | |
| `src/blog/FluentBlog.ts` | Rewrite as `LitElement` with `@property`/`@state` | Heavy |
| `src/blog/template.ts` | Inline into `FluentBlog.render()` method | Delete |
| `src/blog/styles.ts` | Convert to Lit `css`, replace token vars | Medium |
| `src/blog/render.ts` | Delete entirely (670 lines) | Delete |
| `src/blog/IFluentBlog.ts` | Delete (interface not needed with Lit) | Delete |
| `src/blog/loadingTemplate.ts` | Inline into main render | Delete |
| `src/blog/loadedTemplate.ts` | Inline into main render | Delete |
| `src/blog/postsTemplate.ts` | Inline into main render | Delete |
| `src/blog/noPostsTemplate.ts` | Inline into main render | Delete |
| `src/blog/listTemplate.ts` | Inline into main render | Delete |
| `src/blog/listPostsTemplate.ts` | Inline into main render | Delete |
| `src/blog/paginationTemplate.ts` | Inline into main render | Delete |
| `src/blog/postTemplate.ts` | Inline into main render | Delete |
| **Entry point** | | |
| `src/index.ts` | Remove Fluent registration/tokens, import WA components, set WA theme | Heavy |
| **HTML** | | |
| `src/index.htm` | Replace all `fluent-*` tags with `wa-*` tags | Medium |
| **Styles** | | |
| `src/index.scss` | Replace Fluent token CSS vars with WA equivalents | Medium |
| `src/_header.scss` | No token usage — minimal changes | Light |
| `src/_headings.scss` | Replace `--type-ramp-*` tokens | Medium |
| `src/_hyperlink.scss` | Replace `--accent-foreground-*` tokens | Light |
| `src/_hardware.scss` | Replace `--neutral-foreground-rest`, `--neutral-stroke-divider-rest` | Light |
| `src/_interests.scss` | Can delete (interests tab already removed) | Delete |
| **Build** | | |
| `gulp/buildHtml.mts` | Remove `microdata-tooling`/`shieldsio-elements` type imports if unused | Light |

### Design Token Mapping

| Fluent Token (CSS var) | Web Awesome Equivalent |
|----------------------|----------------------|
| `--neutral-foreground-rest` | `--wa-color-neutral-700` or `--wa-text-color` |
| `--neutral-layer-1` | `--wa-color-neutral-0` (background) |
| `--neutral-layer-2` | `--wa-color-neutral-50` |
| `--neutral-stroke-layer-rest` | `--wa-color-neutral-200` (border) |
| `--neutral-stroke-divider-rest` | `--wa-color-neutral-200` |
| `--accent-foreground-rest` | `--wa-color-primary-600` |
| `--accent-foreground-hover` | `--wa-color-primary-700` |
| `--accent-foreground-active` | `--wa-color-primary-800` |
| `--accent-foreground-focus` | `--wa-color-primary-700` |
| `--elevation-shadow-card-rest` | `--wa-shadow-small` |
| `--layer-corner-radius` | `--wa-border-radius-medium` |
| `--stroke-width` | `--wa-border-width` |
| `--body-font` | `--wa-font-sans` |
| `--type-ramp-base-font-size` | `--wa-font-size-medium` |
| `--type-ramp-plus-3-font-size` | `--wa-font-size-x-large` |
| `--type-ramp-plus-4-font-size` | `--wa-font-size-xx-large` |
| `--base-height-multiplier` / `--density` / `--design-unit` | Not needed — WA components handle sizing internally |

*Note: Exact WA token names should be verified against current documentation at migration time.*

## Packages to Remove

- `@microsoft/fast-element`
- `@microsoft/fast-foundation`
- `@fluentui/web-components`
- `@fluentui/common-styles`
- `office-ui-fabric-core`

## Packages to Add

- `lit` — base library for custom elements
- `@AW/webawesome` (or current npm package name) — Web Awesome components + CSS framework

## Recommended Order of Execution

1. Add `lit` and Web Awesome as dependencies
2. Rewrite `src/index.ts` — remove Fluent registration, import WA components, set theme
3. Rewrite `src/index.htm` — replace all `fluent-*` tags with `wa-*` equivalents
4. Rewrite `src/blog/FluentBlog.ts` as a Lit component with all templates inlined
5. Delete old template files and `render.ts`
6. Update all SCSS files to use WA design tokens
7. Remove old FAST/Fluent dependencies from `package.json`
8. Delete `src/_interests.scss` (already unused)
9. Build and iterate on issues
10. Test on desktop and mobile

## Risk Assessment

| Area | Risk | Reason |
|------|------|--------|
| Blog component rewrite | High | Complete rewrite of reactive component, but 1:1 API mapping exists |
| Template migration | Medium | FAST templates map well to Lit, but need manual conversion |
| Design tokens | Medium | Token names differ, need visual verification |
| Component behavior | Low | `wa-tab-group`, `wa-card`, `wa-spinner` are well-established |
| Build system | Low | Only `src/index.ts` and SCSS change; gulp pipeline stays the same |
| `render.ts` deletion | Low | Lit's built-in rendering eliminates the need entirely |

## Estimated Scope

- **~15 files changed** (mostly deletes)
- **Net code reduction** — deleting `render.ts` (670 lines), consolidating 8 template files into one `render()` method
- **Blog component** is the bulk of the work — everything else is find-and-replace
