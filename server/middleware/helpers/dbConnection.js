const mongoose = require("mongoose");
const Fawn = require("fawn");

// For serverless environments, cached connection helps performance
let cachedDb = null;
let isFawnInitialized = false;

const dbConnection = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI not defined");
  }

  // If we already have a connection, use it
  if (cachedDb && mongoose.connection.readyState === 1) {
    console.log("Using cached MongoDB connection");
    return;
  }

  try {
    console.log("Connecting to MongoDB...");
    
    // Serverless optimized connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false, // Disable mongoose buffering
      serverSelectionTimeoutMS: 5000, // Shorter timeout for serverless
      socketTimeoutMS: 30000, // Close sockets after 30s of inactivity
      maxPoolSize: 10, // Maintain up to 10 socket connections
    };

    // If we're in a serverless environment (Vercel)
    if (process.env.VERCEL) {
      console.log("Running in Vercel environment");
    }

    // Connect to database
    await mongoose.connect(process.env.MONGO_URI, options);
    
    cachedDb = mongoose.connection.db;
    console.log("✅ MongoDB connected:", mongoose.connection.db.databaseName);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    console.error("Connection error details:", error);
    
    // Create a more informative error for serverless environments
    const enhancedError = new Error(`MongoDB connection failed: ${error.message}`);
    enhancedError.originalError = error;
    enhancedError.mongoURI = process.env.MONGO_URI ? "MongoDB URI is configured" : "MongoDB URI is missing";
    
    throw enhancedError;
  }

  if (!isFawnInitialized) {
    if (mongoose.models["_transname_"]) {
      delete mongoose.models["_transname_"];
    }

    try {
      Fawn.init(mongoose, process.env.TRANS_COLL || "_transname_");
      isFawnInitialized = true;
      console.log("✅ Fawn initialized");
    } catch (error) {
      console.error("❌ Fawn initialization error:", error.message);
      // Don't throw here, just log the error
      // Fawn is for transactions, and we can still operate without it
      // in emergency mode
    }
  }
};

// Enhanced error handler with more details
const errorHandler = (err) => {
  console.error("Database error:", err);
  return err.message || "Unknown database error occurred";
};

// Check database connection status
const getConnectionStatus = () => {
  const state = mongoose.connection.readyState;
  const stateMap = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
    99: "uninitialized"
  };
  
  return {
    status: stateMap[state] || "unknown",
    databaseName: mongoose.connection.db?.databaseName || "Not connected",
    message: state === 1 ? "MongoDB connected" : "MongoDB not connected",
    mongoURI: process.env.MONGO_URI ? "MongoDB URI is configured" : "MongoDB URI is missing",
    timestamp: new Date().toISOString()
  };
};

module.exports = {
  dbConnection,
  errorHandler,
  getConnectionStatus
}
};
