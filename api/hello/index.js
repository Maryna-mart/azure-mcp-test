module.exports = async function (context, req) {
  context.log('HTTP trigger function processed a request.');

  try {
    const name = req.query.name || (req.body && req.body.name) || 'World';
    const timestamp = new Date().toISOString();

    const responseMessage = {
      message: `Hello, ${name}!`,
      timestamp: timestamp,
      environment: 'Azure Function',
      version: '1.0'
    };

    return {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: responseMessage
    };
  } catch (error) {
    context.log('Error:', error);
    return {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
      body: { error: error.message }
    };
  }
};
