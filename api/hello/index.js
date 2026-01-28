module.exports = async function (context, req) {
  context.log('HTTP trigger function processed a request.');

  const name = req.query.name || (req.body && req.body.name) || 'World';
  const timestamp = new Date().toISOString();

  const responseMessage = {
    message: `Hello, ${name}!`,
    timestamp: timestamp,
    environment: 'Azure Function',
    version: '1.0'
  };

  context.res = {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    },
    body: JSON.stringify(responseMessage)
  };
};
