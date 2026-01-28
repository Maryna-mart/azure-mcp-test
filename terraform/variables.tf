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
