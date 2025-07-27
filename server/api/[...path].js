// Dynamic API route for Vercel serverless
const app = require("../server");

// Safe handler that catches all errors
module.exports = function handler(req, res) {
  try {
    // Add some debugging info to request
    req.vercelServerless = true;
    req.timestamp = new Date().toISOString();

    // Handle with the main Express app
    return app(req, res);
  } catch (error) {
    // Never let the function crash
    console.error("Serverless function error:", error);

    // Return a safe response
    return res.status(500).json({
      error: "Internal Server Error",
      message: error.message || "Unknown error occurred",
      path: req.url,
      timestamp: new Date().toISOString(),
    });
  }
};
