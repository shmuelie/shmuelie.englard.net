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
7. **Remove GitHub Actions workflow and CNAME file** — clean up old deployment (separate commit)
8. **Disable GitHub Pages** in repo settings

## Files Changed

| File | Action |
|------|--------|
| `azure-pipelines.yml` | Create |
| `www/staticwebapp.config.json` | Create |
| `.github/workflows/node.js.yml` | Delete (deferred until Azure verified) |
| `www/CNAME` | Delete (deferred until Azure verified) |
| `README.md` | Update deployment section |
| `.github/copilot-instructions.md` | Update |

## Cost

Azure Static Web Apps Free tier includes:
- 2 custom domains
- 0.5 GB storage
- 100 GB/month bandwidth
- Free SSL certificates

This site is well within those limits.

## Recommended Order of Execution

1. Create Azure resources (SWA + DevOps project)
2. Add `azure-pipelines.yml` and `staticwebapp.config.json`, push to main
3. Verify site at `*.azurestaticapps.net`
4. Configure custom domain + update Hover DNS
5. Verify `shmuelie.englard.net` serves from SWA
6. Remove GitHub Actions workflow and CNAME file
7. Disable GitHub Pages in repo settings

