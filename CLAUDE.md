# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context

This is a **test project** evaluating whether Claude + Azure MCP + Terraform can help a frontend developer with zero Azure/Terraform knowledge successfully deploy a full-stack application to Azure.

**Goal:** Assess Claude's ability to generate working Terraform configs, Azure Function code, and provide clear explanations throughout the deployment process.

**⚠️ Cost Policy:** This project uses **Azure Free Tier ONLY**. All resources must remain on free tier. Current cost: **$0/month**.

## Architecture Overview

The project follows a three-tier architecture:

```
Frontend (Azure Static Web App)
    ↓ HTTP
Backend (Azure Function)
    ↓ Read/Write
Storage (Azure Blob Storage)
```

### Components by Phase

- **Phase 1 (Frontend):** Azure Static Web App hosting a React/TypeScript frontend
- **Phase 2 (Backend):** Serverless Azure Function with HTTP endpoint (`/api/hello`)
- **Phase 3 (Storage):** Azure Blob Storage for file/image storage
- **Phases 4-5:** Testing, validation, and cleanup

All infrastructure is defined as code using **Terraform**.

## Tech Stack

- **Frontend:** React/TypeScript (static site deployed to Azure Static Web App)
- **Backend:** Azure Functions (Node.js runtime)
- **Infrastructure as Code:** Terraform
- **Cloud Platform:** Microsoft Azure (free tier)
- **Tools:** Azure CLI, Terraform CLI, Azure MCP (for Claude context)

## Common Commands

### Terraform Workflow

```bash
# Initialize Terraform (one-time per repo)
terraform init

# Preview infrastructure changes
terraform plan

# Deploy/apply infrastructure changes
terraform apply

# Destroy all infrastructure (cleanup)
terraform destroy

# Show current state
terraform state show

# Format Terraform files
terraform fmt -recursive
```

### Azure CLI (Setup & Diagnostics)

```bash
# Check current Azure login
az account show

# List all resources in current subscription
az resource list --output table

# Check Static Web App deployment
az staticwebapp browse --name <app-name>

# Monitor Function App logs
az functionapp log tail --name <function-name> --resource-group <rg-name>
```

### Development Workflow

```bash
# Frontend Development
npm run dev          # Start local dev server on http://localhost:5173
npm run build        # Build for production (output to dist/)
npm run preview      # Preview production build locally

# Deploy Frontend to Azure (after building)
# First, get the deployment token:
source .env.terraform
cd terraform && terraform output -raw deployment_token

# Then deploy:
swa deploy dist --deployment-token <TOKEN> --env production

# Terraform Infrastructure
cd terraform
terraform init       # Initialize (one-time)
terraform plan       # Preview changes
terraform apply      # Deploy changes
terraform destroy    # Tear down all resources
terraform validate   # Validate syntax
terraform fmt        # Format files

# View current outputs (URLs, etc)
terraform output
terraform output -raw static_web_app_url

# Azure CLI diagnostics
az account show
az resource list --output table
```

## Terraform Structure

Once Phase 1 begins, the repository will contain:

- `main.tf` - Primary resource definitions (Static Web App, Function App, Storage, etc.)
- `variables.tf` - Input variables (resource names, locations, tags)
- `outputs.tf` - Output values (URLs, endpoints, connection strings)
- `terraform.tfstate` - Current infrastructure state (auto-managed, do not edit)
- `.terraform/` - Downloaded provider plugins (auto-managed, not version controlled)

**Key principle:** All infrastructure changes go through Terraform. Never manually modify Azure resources.

## Development Workflow by Phase

### Phase 0: Prerequisites
- Verify Azure CLI: `az account show`
- Verify Terraform: `terraform --version`
- Service principal must be created for Terraform authentication

### Phase 1: Frontend Deployment
1. Create frontend code (React app)
2. Generate `main.tf` for Static Web App
3. Run `terraform apply`
4. Deploy frontend code to the created Static Web App
5. Visit live URL to verify

### Phase 2: Add Backend API
1. Generate Azure Function code (Node.js runtime)
2. Update Terraform to add Function App + connections
3. Run `terraform apply`
4. Deploy function code
5. Call API endpoint from frontend

### Phase 3: Add Storage
1. Update Terraform to add Blob Storage
2. Run `terraform apply`
3. Update Function code to use storage
4. Test file upload/retrieval from frontend

### Phases 4-5: Testing & Cleanup
- Verify all components working together
- Review Terraform state and outputs
- Run `terraform destroy` to clean up (cost = $0)

## Current Project State (After Phase 1)

**Live Frontend:** https://wonderful-wave-0f8ac6703.6.azurestaticapps.net

**Deployment Token:** Stored in `.env.terraform` (DO NOT COMMIT)

**To make changes:**
1. Edit React code in `src/`
2. Run `npm run build`
3. Run `swa deploy dist --deployment-token <TOKEN> --env production`

**To update infrastructure:**
1. Edit `terraform/main.tf`, `terraform/variables.tf`, `terraform/outputs.tf`
2. Run `cd terraform && terraform plan` (preview changes)
3. Run `terraform apply` (deploy changes)

## Key Development Notes

### Working with Azure MCP
- Claude has access to Azure MCP, which provides context about Azure resources and services
- This helps Claude generate more accurate Terraform code
- When stuck, ask Claude to "explain how this Azure resource works" - MCP provides details

### Terraform State Management
- `terraform.tfstate` contains current resource state - **do not manually edit**
- State file tracks what Terraform created so it can update/destroy correctly
- For testing, state is local (not remote storage)

### Frontend Deployment
- Frontend code is a static site (HTML/CSS/JS)
- Deployed via `az staticwebapp up` or Terraform-managed deployment
- Azure Static Web App handles hosting and CDN

### Function Code Deployment
- Azure Function code needs `function_app.py` or `index.js` + `function.json`
- Terraform creates the Function App resource; separate commands deploy the code
- Local testing via `func start` before deploying

### Authentication Flow
- Use Azure CLI login: `az login --service-principal ...`
- Terraform reads credentials from Azure CLI context
- Service principal needs Contributor role on subscription

## Common Issues & Debugging

| Issue | Solution |
|-------|----------|
| `terraform init` fails | Check Azure CLI login: `az account show` |
| `terraform apply` fails with permission error | Verify service principal has Contributor role |
| Frontend can't reach API | Check CORS settings in Function App and Static Web App |
| Terraform plan shows unexpected changes | Run `terraform refresh` to sync state with actual resources |
| Want to see what Terraform will change | Always run `terraform plan` before `terraform apply` |

## Cost Management & Free Tier Policy

**This project operates on Azure Free Tier ONLY. Cost = $0/month.**

### Allowed Resources (Free Tier)
- ✅ **Azure Static Web App** - Free tier (1 per subscription)
- ✅ **Azure Functions** - First 1M executions/month free
- ✅ **Azure Blob Storage** - First 5GB/month free
- ✅ **Data Transfer** - Free tier includes generous allowances

### What NOT to Do (Would Cost Money)
- ❌ Do NOT use premium/paid SKUs
- ❌ Do NOT use App Service Plans (use Functions consumption/free plan only)
- ❌ Do NOT add SQL databases or paid services
- ❌ Do NOT enable traffic manager, CDN premium, or other paid addons
- ❌ Do NOT leave resources running for months without cleanup

### Monitoring Costs
1. Check Azure Portal: **Cost Management + Billing**
2. Verify all resources show "Free" SKU
3. If costs appear, run `terraform destroy` immediately

### When Testing is Complete
Run to delete all resources and ensure zero cost:
```bash
cd terraform
terraform destroy
```

**Remember:** Resources are deleted → cost immediately stops.

## Testing & Validation Checklist (Phase 4)

### ✅ Completed Tests

- [x] **Frontend loads in browser** - React app live at https://wonderful-wave-0f8ac6703.6.azurestaticapps.net
- [x] **API endpoint returns JSON** - `/api/hello` returns proper JSON response
- [x] **Frontend calls backend successfully** - Frontend can fetch from backend API
- [x] **Upload endpoint works** - `/api/upload` accepts POST requests and responds with file confirmation
- [x] **Terraform state reflects resources** - 7 resources managed and in-sync with Azure
- [x] **Azure Portal shows expected resources** - All 5 resource groups visible and operational:
  - Azure Static Web App (Frontend)
  - Azure Function App (Backend API)
  - Service Plan (Y1 - Free tier)
  - Storage Account (Function runtime)
  - Storage Account (User uploads)
- [x] **Costs remain at $0** - All resources using free tier SKUs

### Test Results

**API Tests:**
```
GET /api/hello
→ Status: 200
→ Body: {"message": "Hello, World!", "timestamp": "...", "environment": "Azure Function", "version": "1.0"}

POST /api/upload
→ Status: 200
→ Body: {"message": "File received successfully", "filename": "test.txt", "fileSize": 9, ...}
```

**Infrastructure:**
- Terraform State: 7 resources managed and synchronized
- Resource Group: azure-mcp-test-rg (West Europe)
- Frontend URL: https://wonderful-wave-0f8ac6703.6.azurestaticapps.net
- Backend URL: https://azure-mcp-test-fn.azurewebsites.net/api
- Storage Container: https://mcptestblob001.blob.core.windows.net/uploads

## When Adding New Features/Phases

1. **Plan changes:** What new Azure resources are needed?
2. **Verify free tier:** Confirm resource SKU is free (not paid)
3. **Update Terraform:** Add to `main.tf`, `variables.tf`, `outputs.tf`
4. **Test plan:** `terraform plan` to preview changes and SKUs
5. **Apply:** `terraform apply` to deploy
6. **Deploy code:** Upload any function/frontend updates
7. **Test:** Verify new feature works end-to-end
8. **Verify cost:** Check that new resources are free tier
9. **Document:** Update this file if workflow changes

**Before committing any Terraform changes:**
- Run `terraform plan` and verify all SKUs are free (look for `sku_tier = "Free"`, etc.)
- Do NOT use premium or paid SKUs
- Do NOT add services not on the free tier

## References

- [Terraform Azure Provider](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)
- [Azure Functions Documentation](https://learn.microsoft.com/en-us/azure/azure-functions/)
- [Azure Static Web Apps](https://learn.microsoft.com/en-us/azure/static-web-apps/)
- [Terraform State Management](https://www.terraform.io/language/state)
