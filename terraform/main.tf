terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

# Create resource group
resource "azurerm_resource_group" "main" {
  name     = var.resource_group_name
  location = var.location

  tags = var.tags
}

# Create Static Web App for frontend
resource "azurerm_static_web_app" "main" {
  name                = var.app_name
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku_tier            = "Free"
  sku_size            = "Free"

  tags = var.tags
}

# Storage account for Function App (consumption plan requirement)
resource "azurerm_storage_account" "function_storage" {
  name                     = var.function_storage_name
  resource_group_name      = azurerm_resource_group.main.name
  location                 = azurerm_resource_group.main.location
  account_tier             = "Standard"
  account_replication_type = "LRS"

  tags = var.tags
}

# Service Plan for Function App (Consumption = Free tier)
resource "azurerm_service_plan" "function_plan" {
  name                = var.function_plan_name
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  os_type             = "Linux"
  sku_name            = "Y1"  # Consumption plan (free tier)

  tags = var.tags
}

# Function App
resource "azurerm_linux_function_app" "main" {
  name                = var.function_app_name
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location

  service_plan_id            = azurerm_service_plan.function_plan.id
  storage_account_name       = azurerm_storage_account.function_storage.name
  storage_account_access_key = azurerm_storage_account.function_storage.primary_access_key

  functions_extension_version = "~4"

  app_settings = {
    FUNCTIONS_WORKER_RUNTIME       = "node"
    FUNCTIONS_WORKER_RUNTIME_VERSION = "18"
  }

  site_config {
    application_stack {
      node_version = "18"
    }
    cors {
      allowed_origins = [
        "https://${azurerm_static_web_app.main.default_host_name}",
        "*"  # Allow all origins during testing
      ]
    }
  }

  tags = var.tags
}

