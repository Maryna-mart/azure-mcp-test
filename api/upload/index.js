const { BlobServiceClient } = require("@azure/storage-blob");

module.exports = async function (context, req) {
  context.log("Upload function called");

  try {
    // Get connection string from environment
    const connectionString = process.env.BLOB_STORAGE_CONNECTION_STRING;
    if (!connectionString) {
      return {
        status: 500,
        headers: { "Content-Type": "application/json" },
        body: { error: "Storage connection string not configured" }
      };
    }

    // Get file data from request
    const { filename, content } = req.body;

    if (!filename || !content) {
      return {
        status: 400,
        headers: { "Content-Type": "application/json" },
        body: { error: "filename and content are required" }
      };
    }

    // Create blob client
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient("uploads");
    const blockBlobClient = containerClient.getBlockBlobClient(filename);

    // Upload blob
    await blockBlobClient.upload(content, content.length);

    return {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: {
        message: "File uploaded successfully",
        filename: filename,
        url: blockBlobClient.url,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    context.log(`Error: ${error.message}`);
    return {
      status: 500,
      headers: { "Content-Type": "application/json" },
      body: { error: error.message }
    };
  }
};
