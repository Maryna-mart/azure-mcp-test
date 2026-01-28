variable "resource_group_name" {
  description = "Name of the Azure resource group"
  type        = string
  default     = "azure-mcp-test-rg"
}

variable "location" {
  description = "Azure region for resources"
  type        = string
  default     = "West Europe"
}

variable "app_name" {
  description = "Name of the static web app"
  type        = string
  default     = "azure-mcp-test-app"
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default = {
    Environment = "Test"
    Project     = "AzureMCPTest"
  }
}

variable "function_storage_name" {
  description = "Name of the storage account for Function App (must be globally unique, lowercase)"
  type        = string
  default     = "mcptestfnstore001"
}

variable "function_plan_name" {
  description = "Name of the Function App service plan"
  type        = string
  default     = "azure-mcp-test-plan"
}

variable "function_app_name" {
  description = "Name of the Azure Function App"
  type        = string
  default     = "azure-mcp-test-fn"
}
