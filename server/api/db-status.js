// Database status check endpoint for Vercel serverless

// Import dependencies
require("dotenv").config();
const mongoose = require("mongoose");

// Database connection with cached connection
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return { cached: true, db: cachedDb };
  }

  try {
    // Serverless optimized connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000,
      maxPoolSize: 10,
    };

    await mongoose.connect(process.env.MONGO_URI, options);
    cachedDb = mongoose.connection.db;
    return {
      cached: false,
      db: cachedDb,
      dbName: mongoose.connection.db.databaseName,
    };
  } catch (error) {
    return {
      error: true,
      message: error.message,
      name: error.name,
    };
  }
}

// Handler for serverless function
module.exports = async (req, res) => {
  try {
    const result = await connectToDatabase();

    if (result.error) {
      return res.status(500).json({
        status: "error",
        message: `Database connection failed: ${result.message}`,
        errorName: result.name,
        timestamp: new Date().toISOString(),
      });
    }

    const state = mongoose.connection.readyState;
    const stateMap = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
      99: "uninitialized",
    };

    return res.status(200).json({
      status: stateMap[state] || "unknown",
      databaseName:
        result.dbName ||
        mongoose.connection.db?.databaseName ||
        "Not connected",
      message: state === 1 ? "MongoDB connected" : "MongoDB not connected",
      cached: result.cached,
      timestamp: new Date().toISOString(),
      readyState: state,
      mongoURI: process.env.MONGO_URI
        ? "MongoDB URI is configured"
        : "MongoDB URI is missing",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: `Unexpected error: ${error.message}`,
      timestamp: new Date().toISOString(),
    });
  }
};
