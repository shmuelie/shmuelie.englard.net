#!/usr/bin/env pwsh
# Azure Static Web Apps Migration Script
# Fill in the variables below, then run this script.
# Prerequisite: az login, az extension add --name azure-devops

# ── Configuration ──────────────────────────────────────────────
$ResourceGroup   = "<your-resource-group>"       # e.g. "shmuelie-rg"
$Location        = "eastus"                       # Azure region
$SwaName         = "shmuelie-englard-net"         # Static Web App resource name
$DevOpsOrg       = "<your-devops-org-url>"        # e.g. "https://dev.azure.com/myorg"
$DevOpsProject   = "<your-devops-project>"        # e.g. "shmuelie-site"
$GitHubRepoUrl   = "https://github.com/shmuelie/shmuelie.englard.net"
$CustomDomain    = "shmuelie.englard.net"

# ── 1. Create Resource Group (if needed) ───────────────────────
Write-Host "Creating resource group..." -ForegroundColor Cyan
az group create --name $ResourceGroup --location $Location

# ── 2. Create Static Web App ──────────────────────────────────
Write-Host "Creating Static Web App..." -ForegroundColor Cyan
az staticwebapp create `
    --name $SwaName `
    --resource-group $ResourceGroup `
    --location $Location `
    --sku Free

# ── 3. Get Deployment Token ───────────────────────────────────
Write-Host "Retrieving deployment token..." -ForegroundColor Cyan
$token = (az staticwebapp secrets list `
    --name $SwaName `
    --resource-group $ResourceGroup `
    --query "properties.apiKey" -o tsv)

Write-Host "Deployment token retrieved (will be stored as pipeline secret)" -ForegroundColor Green

# ── 4. Configure Custom Domain ────────────────────────────────
# NOTE: Before running this, update the CNAME record in Hover DNS:
#   Host: shmuelie
#   Type: CNAME
#   Target: (get this from the portal or from `az staticwebapp show`)
Write-Host ""
Write-Host "Default hostname:" -ForegroundColor Yellow
az staticwebapp show --name $SwaName --resource-group $ResourceGroup --query "defaultHostname" -o tsv
Write-Host ""
Write-Host ">>> Update Hover DNS CNAME to point to the hostname above, then press Enter <<<" -ForegroundColor Yellow
Read-Host

Write-Host "Adding custom domain..." -ForegroundColor Cyan
az staticwebapp hostname set `
    --name $SwaName `
    --resource-group $ResourceGroup `
    --hostname $CustomDomain

# ── 5. Set up Azure DevOps Project ────────────────────────────
Write-Host "Configuring Azure DevOps..." -ForegroundColor Cyan
az devops configure --defaults organization=$DevOpsOrg project=$DevOpsProject

# Create project (ignore error if it already exists)
az devops project create --name $DevOpsProject 2>$null

# ── 6. Create Pipeline from azure-pipelines.yml ───────────────
Write-Host "Creating pipeline..." -ForegroundColor Cyan
az pipelines create `
    --name "Deploy to Azure SWA" `
    --repository $GitHubRepoUrl `
    --repository-type github `
    --branch main `
    --yml-path azure-pipelines.yml

# ── 7. Store Deployment Token as Pipeline Secret Variable ─────
Write-Host "Storing deployment token as pipeline secret..." -ForegroundColor Cyan
az pipelines variable create `
    --name AZURE_STATIC_WEB_APPS_API_TOKEN `
    --value $token `
    --secret $true `
    --pipeline-name "Deploy to Azure SWA"

Write-Host ""
Write-Host "Done! Next steps:" -ForegroundColor Green
Write-Host "  1. Verify site at the default SWA hostname"
Write-Host "  2. Verify $CustomDomain resolves correctly"
Write-Host "  3. Merge the azure-migration branch to main"
Write-Host "  4. Disable GitHub Pages in repo settings"
