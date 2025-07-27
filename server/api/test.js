// Simple API test for Vercel serverless
// This endpoint doesn't require database connection

// Import dependencies
require("dotenv").config();

// Create simple handler
module.exports = (req, res) => {
  res.status(200).json({
    message: "API test endpoint is working!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    vercel: process.env.VERCEL === "true" ? "Yes" : "No",
    method: req.method,
    path: req.url,
  });
};
