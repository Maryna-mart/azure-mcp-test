module.exports = async function (context, req) {
  context.log("Upload function called");
  context.log("req.query:", req.query);
  context.log("req.body:", req.body);
  context.log("req.rawBody:", req.rawBody);
  context.log("req.headers:", req.headers);

  try {
    // Try to get body from different sources
    let filename, content;

    // Check req.body (should be auto-parsed JSON by Azure Functions)
    if (req.body) {
      filename = req.body.filename;
      content = req.body.content;
    }
    // Fallback: parse rawBody if available
    else if (req.rawBody) {
      try {
        const parsed = JSON.parse(req.rawBody);
        filename = parsed.filename;
        content = parsed.content;
      } catch (e) {
        context.log("Could not parse rawBody as JSON");
      }
    }

    if (!filename || !content) {
      context.log("Missing filename or content");
      return {
        status: 400,
        headers: { "Content-Type": "application/json" },
        body: { error: "filename and content are required" }
      };
    }

    context.log(`Successful upload request for: ${filename}, size: ${content.length}`);

    return {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: {
        message: "File received successfully",
        filename: filename,
        fileSize: content.length,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    context.log(`Error occurred: ${error.message}`);
    return {
      status: 500,
      headers: { "Content-Type": "application/json" },
      body: { error: `Upload failed: ${error.message}` }
    };
  }
};
