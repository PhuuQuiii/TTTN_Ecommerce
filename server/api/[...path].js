// Dynamic API route for Vercel serverless
const app = require("../../server");

// Handle all dynamic routes through main Express app
module.exports = function handler(req, res) {
  return app(req, res);
};
