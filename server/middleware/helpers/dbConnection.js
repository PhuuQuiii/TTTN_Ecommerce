const mongoose = require("mongoose");
const Fawn = require("fawn");

let isConnected = false;
let isFawnInitialized = false;

const dbConnection = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI not defined");
  }

  if (!isConnected) {
    try {
      console.log("Connecting to MongoDB...");
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000, // Timeout after 10s
        socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      });
      isConnected = true;
      console.log("✅ MongoDB connected:", mongoose.connection.db.databaseName);
    } catch (error) {
      console.error("❌ MongoDB connection error:", error.message);
      // In serverless environment, rethrow the error for proper handling
      throw error;
    }
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
      throw error;
    }
  }
};

const errorHandler = (err) => err.message || "Unknown Error";

module.exports = {
  dbConnection,
  errorHandler,
};
