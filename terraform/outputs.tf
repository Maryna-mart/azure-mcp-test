output "static_web_app_name" {
  description = "Name of the Static Web App"
  value       = azurerm_static_web_app.main.name
}

output "static_web_app_url" {
  description = "URL of the Static Web App"
  value       = "https://${azurerm_static_web_app.main.default_host_name}"
}

output "deployment_token" {
  description = "Deployment token for the Static Web App"
  value       = azurerm_static_web_app.main.api_key
  sensitive   = true
}

output "resource_group_name" {
  description = "Name of the resource group"
  value       = azurerm_resource_group.main.name
}

output "function_app_name" {
  description = "Name of the Function App"
  value       = azurerm_linux_function_app.main.name
}

output "function_app_url" {
  description = "URL of the Function App"
  value       = "https://${azurerm_linux_function_app.main.default_hostname}"
}

output "function_app_id" {
  description = "ID of the Function App"
  value       = azurerm_linux_function_app.main.id
}

output "blob_storage_name" {
  description = "Name of the Blob Storage account"
  value       = azurerm_storage_account.blob_storage.name
}

output "blob_storage_connection_string" {
  description = "Connection string for Blob Storage"
  value       = azurerm_storage_account.blob_storage.primary_connection_string
  sensitive   = true
}

output "blob_container_url" {
  description = "URL of the uploads blob container"
  value       = "${azurerm_storage_account.blob_storage.primary_blob_endpoint}${azurerm_storage_container.uploads.name}"
}
