// Serverless API route for user authentication
// Import main server to handle requests
const app = require("../server");

// Export serverless function handler
module.exports = (req, res) => {
  // Forward request to Express app
  return app(req, res);
};
