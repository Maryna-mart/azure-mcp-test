# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context

This is a **test project** evaluating whether Claude + Azure MCP + Terraform can help a frontend developer with zero Azure/Terraform knowledge successfully deploy a full-stack application to Azure.

**Goal:** Assess Claude's ability to generate working Terraform configs, Azure Function code, and provide clear explanations throughout the deployment process.

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
# Test frontend locally before deploying
npm run dev          # Start local dev server
npm run build        # Build for production

# Test Azure Function locally (when Phase 2 starts)
func start           # Local function runtime

# Validate Terraform without deploying
terraform validate

# Check Terraform formatting
terraform fmt --check=true -recursive
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

## Cost Management

- All resources use Azure free tier (0 cost)
- Monitor actual costs in Azure Portal: Cost Management + Billing
- Run `terraform destroy` at end of testing to clean up

## Testing & Validation Checklist

- [ ] Frontend loads in browser
- [ ] API endpoint returns JSON
- [ ] Frontend calls backend successfully
- [ ] Storage operations (upload/retrieve) work
- [ ] `terraform state show` reflects actual resources
- [ ] Azure Portal shows expected resources
- [ ] No unexpected costs in Cost Management

## When Adding New Features/Phases

1. **Plan changes:** What new Azure resources are needed?
2. **Update Terraform:** Add to `main.tf`, `variables.tf`, `outputs.tf`
3. **Test plan:** `terraform plan` to preview changes
4. **Apply:** `terraform apply` to deploy
5. **Deploy code:** Upload any function/frontend updates
6. **Test:** Verify new feature works end-to-end
7. **Document:** Update this file if workflow changes

## References

- [Terraform Azure Provider](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)
- [Azure Functions Documentation](https://learn.microsoft.com/en-us/azure/azure-functions/)
- [Azure Static Web Apps](https://learn.microsoft.com/en-us/azure/static-web-apps/)
- [Terraform State Management](https://www.terraform.io/language/state)
