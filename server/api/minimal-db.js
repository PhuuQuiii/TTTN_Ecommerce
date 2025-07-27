// Minimal MongoDB connection test with robust error handling
// This endpoint will safely test MongoDB connection without crashing

// Import bare minimum dependencies
require("dotenv").config();
const mongoose = require("mongoose");

// Simple try-catch wrapper for serverless functions
const safeHandler = (fn) => async (req, res) => {
  try {
    return await fn(req, res);
  } catch (error) {
    console.error("Function error:", error);

    // Always return a valid response, never crash
    return res.status(500).json({
      status: "error",
      message: error.message || "Unknown error occurred",
      errorType: error.name,
      timestamp: new Date().toISOString(),
      path: req.url,
    });
  }
};

// Test MongoDB connection with timeout
const testConnection = async () => {
  let client = null;

  try {
    // Connection with minimal options and short timeout
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      socketTimeoutMS: 5000,
    };

    // Create a fresh connection (don't reuse mongoose.connect to avoid side effects)
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI not configured");
    }

    // Connect with timeout
    const connectionPromise = mongoose.createConnection(uri, options);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Connection timeout after 5s")), 5000)
    );

    client = await Promise.race([connectionPromise, timeoutPromise]);

    // Test a simple command
    const result = await client.db.admin().ping();

    return {
      connected: true,
      ping: result.ok === 1 ? "success" : "failed",
      dbName: client.db.databaseName,
      uri: uri ? uri.substring(0, 20) + "..." : "missing",
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message,
      errorName: error.name,
      uri: process.env.MONGO_URI ? "configured" : "missing",
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    };
  } finally {
    // Always close the connection
    if (client) {
      try {
        await client.close();
      } catch (e) {
        console.error("Error closing connection:", e);
      }
    }
  }
};

// Main handler
module.exports = safeHandler(async (req, res) => {
  const result = await testConnection();

  return res.status(result.connected ? 200 : 500).json({
    status: result.connected ? "connected" : "error",
    ...result,
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || "unknown",
  });
});
