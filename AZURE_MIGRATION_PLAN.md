# Plan: Migrate to Azure Static Web Apps + Azure DevOps Pipelines

## Overview

Migrate hosting from GitHub Pages to **Azure Static Web Apps** (SWA) and CI/CD from GitHub Actions to **Azure DevOps Pipelines**. The custom domain `shmuelie.englard.net` has DNS managed at Hover.

**Why Azure Static Web Apps:** Free tier includes custom domains with auto-managed SSL certificates, global CDN distribution, built-in routing/fallback rules, and direct integration with Azure DevOps. Purpose-built for exactly this type of static site — simpler than Blob Storage + CDN and no cost difference at this scale.

## Prerequisites (manual, one-time)

### 1. Create Azure Static Web App resource
- In the Azure Portal, create a **Static Web App** (Free tier)
- During creation, skip the GitHub integration (we'll use Azure DevOps instead)
- Note the **deployment token** from the resource's overview page — this is used by the pipeline to deploy

### 2. Set up Azure DevOps project
- Create a project in Azure DevOps (or use an existing org)
- Import the GitHub repo or connect it as an external repo
- Store the SWA **deployment token** as a pipeline variable (secret): `AZURE_STATIC_WEB_APPS_API_TOKEN`

### 3. Configure custom domain
- In the Azure Portal, add `shmuelie.englard.net` as a custom domain on the SWA resource
- Azure will provide a CNAME target (e.g., `<app-name>.azurestaticapps.net`) or a TXT validation record
- In **Hover DNS**, update the CNAME record for `shmuelie` to point to the SWA hostname
- Azure automatically provisions and renews the SSL certificate once DNS validates

## Code Changes

### 4. Create Azure DevOps Pipeline (`azure-pipelines.yml`)
New file at repo root:

```yaml
trigger:
  branches:
    include:
      - main

pool:
  vmImage: 'ubuntu-latest'

steps:
  - task: UseNode@1
    inputs:
      version: '23.x'
    displayName: 'Use Node.js 23.x'

  - script: npm install -g pnpm
    displayName: 'Install pnpm'

  - script: pnpm install
    displayName: 'Install dependencies'

  - script: pnpm build
    displayName: 'Build site'

  - task: AzureStaticWebApp@0
    inputs:
      app_location: 'dist'
      skip_app_build: true
      azure_static_web_apps_api_token: $(AZURE_STATIC_WEB_APPS_API_TOKEN)
    displayName: 'Deploy to Azure Static Web Apps'
```

Key design decisions:
- `skip_app_build: true` — we build ourselves with `pnpm build` for full control (the SWA task would otherwise try to build with Oryx)
- `app_location: 'dist'` — points to our pre-built output directory
- Node 23.x for `registerHooks` support

### 5. Add SWA configuration file (`staticwebapp.config.json`)
New file at `dist/` output (or repo root — SWA looks for it):

```json
{
  "navigationFallback": {
    "rewrite": "/index.htm"
  },
  "mimeTypes": {
    ".htm": "text/html"
  }
}
```

This ensures:
- SPA navigation works (hash-based routing already works, but this covers direct blog slug URLs)
- `.htm` files are served with correct MIME type (SWA defaults to `.html`)

Create this as `www/staticwebapp.config.json` so `copyStatic` picks it up and puts it in `dist/`.

### 6. Remove GitHub-specific deployment files
- Delete `.github/workflows/node.js.yml` (GitHub Actions workflow)
- Remove `www/CNAME` (GitHub Pages custom domain file — not needed by SWA)

### 7. Update README
- Replace the Deployment section to reference Azure Static Web Apps + Azure DevOps
- Remove references to GitHub Pages settings

### 8. Update copilot-instructions.md
- Update build/deploy documentation to reflect Azure DevOps pipeline

## Migration Order (minimize downtime)

1. **Create Azure resources** (SWA + DevOps project) — site doesn't exist yet, no impact
2. **Add `azure-pipelines.yml` and `staticwebapp.config.json`** — push to main, DevOps pipeline deploys to SWA
3. **Verify site works** at the `*.azurestaticapps.net` URL
4. **Configure custom domain** in Azure Portal + update Hover DNS CNAME
5. **Wait for DNS propagation** and SSL certificate provisioning
6. **Verify** `shmuelie.englard.net` serves from SWA
7. **Remove GitHub Actions workflow and CNAME file** — clean up old deployment
8. **Disable GitHub Pages** in repo settings

## Files Changed

| File | Action |
|------|--------|
| `azure-pipelines.yml` | Create |
| `www/staticwebapp.config.json` | Create |
| `.github/workflows/node.js.yml` | Delete |
| `www/CNAME` | Delete |
| `README.md` | Update deployment section |
| `.github/copilot-instructions.md` | Update |

## Cost

Azure Static Web Apps Free tier includes:
- 2 custom domains
- 0.5 GB storage
- 100 GB/month bandwidth
- Free SSL certificates

This site is well within those limits.

## Key Research Findings

### render.ts can be deleted
FAST Element v2 ships a built-in `render` directive (`@microsoft/fast-element/render.js`) with nearly identical API to our custom `src/blog/render.ts`. The custom file was a polyfill from [a FAST GitHub issue](https://github.com/microsoft/fast/issues/6114) proposing this feature for inclusion. In v2, import `render`, `RenderInstruction`, `RenderBehavior`, `RenderDirective` etc. from `@microsoft/fast-element/render.js`. **Delete `src/blog/render.ts` entirely and update imports.**

## Key Research Findings

### render.ts can be deleted
FAST Element v2 ships a built-in `render` directive (`@microsoft/fast-element/render.js`) with nearly identical API to our custom `src/blog/render.ts`. The custom file was a polyfill from [a FAST GitHub issue](https://github.com/microsoft/fast/issues/6114) proposing this feature for inclusion. In v2, import `render`, `RenderInstruction`, `RenderBehavior`, `RenderDirective` etc. from `@microsoft/fast-element/render.js`. **Delete `src/blog/render.ts` entirely and update imports.**

### Breaking changes are minimal for template code
Per the [official migration guide](https://fast.design/docs/2.x/migration-guide/):
- `html`, `css`, `when`, `repeat` — same API
- `@observable`, `@attr` — still work
- `@customElement` — still works (just not recommended; prefer `FASTElement.define()`)
- `cssPartial` → `css.partial` (not used in this codebase)
- `CSSDirective` must use `implements` not `extends` (not used)

### ⚠️ Fluent UI v3 is a MAJOR redesign — not just a version bump
Verified by inspecting the actual v3 npm package:

**Missing components (no v3 equivalent):**
- `fluent-card` — **does not exist** in v3. Used extensively in blog templates and hardware tab.
- `fluent-flipper` — **does not exist** in v3. Used for blog pagination navigation.
- `fluent-progress-ring` — **replaced** by `fluent-spinner` (different component).

**Renamed components:**
- `fluent-tabs` → `fluent-tablist` (tabs still works but is deprecated)

**Completely different design token system:**
- v2 used FAST's `DesignToken` class with CSS vars like `--neutral-foreground-rest`, `--neutral-stroke-layer-rest`, `--elevation-shadow-card-rest`, `--layer-corner-radius`, etc.
- v3 uses `setTheme()` with `@fluentui/tokens` token names like `colorNeutralForeground1`, `colorNeutralStroke1`, etc. — completely different naming scheme.
- **All CSS custom properties in SCSS and blog component styles will break.** Every use of `var(--neutral-foreground-rest)` etc. needs to be mapped to the new token name.

**Different registration system:**
- v2: `provideFluentDesignSystem().register(allComponents)` 
- v3: Individual `definition.define(FluentDesignSystem.registry)` per component, or import side-effect modules like `@fluentui/web-components/tabs/define.js`

**`@microsoft/fast-foundation` removed entirely** — `DesignToken` and `Tabs` type must come from elsewhere

### Fluent UI v3 status
Latest: `3.0.0-rc.9` (March 2026). Still RC, not stable.

## Scope of Changes

### 1. Package updates
- [ ] `@microsoft/fast-element` 1.14.0 → 2.10.2
- [ ] `@fluentui/web-components` 2.6.1 → 3.0.0-rc.9
- [ ] `@microsoft/fast-foundation` 2.50.0 → remove (v3 Fluent UI includes what's needed)
- [ ] `@fluentui/common-styles` → check if still needed, remove if not
- [ ] Update all unpkg.com URLs in source code to match new versions
- [ ] Regenerate `tsconfig.paths.json` (automatic via `pnpm install`)

### 2. Delete `src/blog/render.ts` and use built-in
- [ ] Delete `src/blog/render.ts` (670 lines)
- [ ] Update imports in blog templates to use `@microsoft/fast-element/render.js`
- [ ] Check that the built-in `render()` function has the same call signature

### 3. Update `src/index.ts` — Fluent UI registration
v2 API:
```ts
provideFluentDesignSystem().register(allComponents).withDesignTokenRoot(document)
```
v3 may change this. Need to check exact registration pattern. Design tokens (`baseLayerLuminance`, `StandardLuminance`) may move or change API. `DesignToken` and `Tabs` currently imported from `@microsoft/fast-foundation` — need new import paths.

- [ ] Update design system registration to v3 API
- [ ] Update design token setup (dark/light mode)
- [ ] Update `DesignToken` and `Tabs` imports

### 4. Update `src/blog/FluentBlog.ts`
- [ ] Either keep `@customElement` (still works) or migrate to `FASTElement.define()`
- [ ] Verify `nullableNumberConverter` still exists
- [ ] Verify `$emit()` still works
- [ ] No changes needed for `@observable` or `@attr`

### 5. Update all unpkg.com import URLs
Every `.ts` file in `src/` that imports from unpkg URLs needs version numbers updated:
- `@microsoft/fast-element@1.14.0` → `@microsoft/fast-element@2.10.2`
- `@fluentui/web-components@2.6.1` → `@fluentui/web-components@3.0.0-rc.9`
- `@microsoft/fast-foundation@2.50.0` → remove or replace

Files affected: `src/index.ts`, `src/blog/FluentBlog.ts`, `src/blog/template.ts`, `src/blog/styles.ts`, `src/blog/postTemplate.ts`, `src/blog/postsTemplate.ts`, `src/blog/paginationTemplate.ts`, `src/blog/noPostsTemplate.ts`, `src/blog/loadingTemplate.ts`, `src/blog/loadedTemplate.ts`, `src/blog/listTemplate.ts`, `src/blog/listPostsTemplate.ts`

### 6. Verify CSS design tokens
Styles use Fluent design token CSS custom properties. Verify these haven't changed in v3:
- `--neutral-foreground-rest`, `--neutral-stroke-layer-rest`
- `--accent-foreground-*` variants
- `--base-height-multiplier`, `--density`, `--design-unit`
- `--stroke-width`, `--layer-corner-radius`, `--elevation-shadow-card-rest`

## Recommended Order of Execution

1. Install new packages and update unpkg URLs
2. Delete `src/blog/render.ts`, update render imports
3. Fix `src/index.ts` (registration + tokens + imports)
4. Fix `src/blog/FluentBlog.ts` (component definition + imports)
5. Update all template file imports
6. Build and iterate on any remaining type/API issues
7. Test in browser

## Risk Assessment

| Area | Risk | Reason |
|------|------|--------|
| Template APIs (`html`, `css`, `when`, `repeat`) | Low | Same API in v2 |
| Decorators (`@observable`, `@attr`, `@customElement`) | Low | Still supported in v2 |
| `render.ts` deletion | **Low** | v2 ships equivalent built-in |
| Fluent UI v3 registration API | Medium | API may differ from v2 |
| Design tokens | Medium | Token names may have changed |
| Component tag names | Low | Already using `fluent-` prefix |
| Fluent UI v3 stability | Medium | Still RC, not stable release |

