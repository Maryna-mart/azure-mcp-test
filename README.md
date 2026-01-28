# Azure MCP Test - Full-Stack Deployment Evaluation

A test project evaluating Claude's ability to help a frontend developer with zero Azure/Terraform knowledge successfully deploy a full-stack application to Azure.

## 🎯 Project Goal

Assess whether Claude + Azure MCP + Terraform can generate working infrastructure-as-code and guide deployment of a complete three-tier application without prior Azure experience.

## 🏗️ Architecture

```
Frontend (Azure Static Web App)
    ↓ HTTP
Backend (Azure Function)
    ↓ Read/Write
Storage (Azure Blob Storage)
```

- **Frontend:** React/TypeScript static site
- **Backend:** Serverless Azure Function (Node.js)
- **Storage:** Azure Blob Storage for file uploads
- **IaC:** Terraform for all infrastructure

## ✅ Current Status

**Phase 4 Complete - All Features Working**

- ✅ Frontend deployed and live at: https://wonderful-wave-0f8ac6703.6.azurestaticapps.net
- ✅ Backend API responding: `/api/hello` and `/api/upload` endpoints
- ✅ File upload to Blob Storage working
- ✅ All tests passing
- ✅ Cost: **$0/month** (Azure Free Tier)

## 🚀 Quick Start

### Prerequisites

```bash
# Check Azure CLI
az account show

# Check Terraform
terraform --version
```

### Deploy

```bash
# 1. Initialize Terraform
cd terraform
terraform init

# 2. Preview changes
terraform plan

# 3. Deploy infrastructure
terraform apply

# 4. Build and deploy frontend
npm run build
swa deploy dist --deployment-token <TOKEN> --env production
```

### Access the Application

- **Frontend:** https://wonderful-wave-0f8ac6703.6.azurestaticapps.net
- **API Endpoint:** https://azure-mcp-test-fn.azurewebsites.net/api

## 📁 Project Structure

```
├── src/                    # React frontend code
│   ├── App.tsx
│   ├── main.tsx
│   └── components/
├── terraform/              # Infrastructure as Code
│   ├── main.tf            # Resource definitions
│   ├── variables.tf       # Input variables
│   ├── outputs.tf         # Output values
│   └── terraform.tfstate  # Current state (auto-managed)
├── functions/             # Azure Function code
│   ├── index.js
│   └── function.json
├── package.json           # Frontend dependencies
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
└── CLAUDE.md              # Detailed development guide
```

## 🛠️ Development Workflow

### Frontend Development

```bash
# Local development
npm run dev          # Start at http://localhost:5173

# Build for production
npm run build        # Output to dist/

# Deploy to Azure
swa deploy dist --deployment-token <TOKEN> --env production
```

### Infrastructure Changes

```bash
cd terraform

# Preview changes
terraform plan

# Apply changes
terraform apply

# View outputs (URLs, endpoints)
terraform output

# Destroy all resources (cleanup)
terraform destroy
```

### Function App Updates

```bash
# Deploy updated function code
func azure functionapp publish <function-app-name>
```

## 💰 Cost Management

**This project uses Azure Free Tier exclusively. Cost = $0/month.**

All resources are configured with free tier SKUs:
- ✅ Azure Static Web App (1 per subscription)
- ✅ Azure Functions (1M executions/month free)
- ✅ Azure Blob Storage (5GB/month free)

**Cost Policy:** If any paid services are added, they must be removed immediately.

## 📊 API Endpoints

### GET /api/hello

Returns a JSON response with server info.

**Response:**
```json
{
  "message": "Hello, World!",
  "timestamp": "2024-01-28T10:30:00Z",
  "environment": "Azure Function",
  "version": "1.0"
}
```

### POST /api/upload

Upload a file to Blob Storage.

**Request:** Form data with `file` field
**Response:**
```json
{
  "message": "File received successfully",
  "filename": "example.txt",
  "fileSize": 1024,
  "uploadedAt": "2024-01-28T10:30:00Z"
}
```

## 🧪 Testing

All components have been tested and verified working:

- ✅ Frontend loads in browser
- ✅ API endpoint returns JSON
- ✅ Frontend calls backend successfully
- ✅ File upload endpoint works
- ✅ Terraform state synchronized with Azure resources
- ✅ All resources visible in Azure Portal

## 🔍 Monitoring & Diagnostics

```bash
# Check Azure login
az account show

# List all resources
az resource list --output table

# View Static Web App
az staticwebapp browse --name azure-mcp-test-swa

# Monitor Function App logs
az functionapp log tail --name azure-mcp-test-fn --resource-group azure-mcp-test-rg
```

## 📚 Key Files

- **[CLAUDE.md](./CLAUDE.md)** - Detailed development guide, commands, and troubleshooting
- **[terraform/main.tf](./terraform/main.tf)** - Infrastructure resource definitions
- **[terraform/variables.tf](./terraform/variables.tf)** - Input variables and configuration
- **[terraform/outputs.tf](./terraform/outputs.tf)** - Output values (URLs, endpoints)

## 🔐 Environment Variables

Deployment token is stored in `.env.terraform` (not committed to repo). To regenerate:

```bash
cd terraform
terraform output -raw deployment_token
```

## 📖 References

- [Terraform Azure Provider Documentation](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)
- [Azure Functions Documentation](https://learn.microsoft.com/en-us/azure/azure-functions/)
- [Azure Static Web Apps](https://learn.microsoft.com/en-us/azure/static-web-apps/)
- [Azure Blob Storage](https://learn.microsoft.com/en-us/azure/storage/blobs/)

## 🧹 Cleanup

To tear down all infrastructure and ensure zero cost:

```bash
cd terraform
terraform destroy
```

This removes all Azure resources and stops all billing.

---

**Project Status:** ✅ Complete - All phases tested and validated
