<#
.SYNOPSIS
    Sets up Azure Static Web Apps hosting and Azure DevOps CI/CD pipeline.

.DESCRIPTION
    Creates an Azure Static Web App, configures a custom domain, sets up an
    Azure DevOps project with a pipeline, and stores the deployment token as
    a secret pipeline variable.

    Prerequisites: az login, az extension add --name azure-devops

.PARAMETER ResourceGroup
    Name of the Azure resource group to create or use.

.PARAMETER Location
    Azure region for the Static Web App. Defaults to 'eastus'.

.PARAMETER SwaName
    Name for the Static Web App resource. Defaults to 'shmuelie-englard-net'.

.PARAMETER DevOpsOrg
    Azure DevOps organization URL (e.g., 'https://dev.azure.com/myorg').

.PARAMETER DevOpsProject
    Name of the Azure DevOps project to create or use.

.PARAMETER GitHubRepoUrl
    GitHub repository URL. Defaults to 'https://github.com/shmuelie/shmuelie.englard.net'.

.PARAMETER CustomDomain
    Custom domain to configure. Defaults to 'shmuelie.englard.net'.

.EXAMPLE
    ./setup-azure.ps1 -ResourceGroup "shmuelie-rg" -DevOpsOrg "https://dev.azure.com/myorg" -DevOpsProject "shmuelie-site"
#>

param(
    [Parameter(Mandatory)]
    [string]$ResourceGroup,

    [Parameter(Mandatory)]
    [string]$DevOpsOrg,

    [Parameter(Mandatory)]
    [string]$DevOpsProject,

    [string]$Location = "eastus",
    [string]$SwaName = "shmuelie-englard-net",
    [string]$GitHubRepoUrl = "https://github.com/shmuelie/shmuelie.englard.net",
    [string]$CustomDomain = "shmuelie.englard.net"
)

$ErrorActionPreference = "Stop"

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
