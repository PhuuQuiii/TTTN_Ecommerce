/**
 * Vercel Serverless Test - Minimal test file for Vercel deployment
 * Run with: node vercel-test.js
 */
require("dotenv").config();
const mongoose = require("mongoose");

// Log environment info
console.log("Node version:", process.version);
console.log("Environment:", process.env.NODE_ENV);
console.log("MONGO_URI configured:", !!process.env.MONGO_URI);
console.log(
  "MONGO_URI:",
  process.env.MONGO_URI
    ? process.env.MONGO_URI.substring(0, 20) + "..."
    : "Missing"
);

// Test MongoDB connection with minimal options
async function testConnection() {
  try {
    // Connection options - same as the working script
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 seconds
      socketTimeoutMS: 30000,
    };

    console.log("Connecting to MongoDB...");

    // Connect with timeout
    await mongoose.connect(process.env.MONGO_URI, options);

    console.log("✅ Connected to MongoDB!");
    console.log("Database:", mongoose.connection.db.databaseName);

    // Test a simple query
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log("Collections found:", collections.length);

    // Close connection
    await mongoose.connection.close();
    console.log("Connection closed");

    return true;
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
    console.error("Error name:", error.name);
    console.error("Error details:", error);
    if (error.name === "MongoServerSelectionError") {
      console.error("This is likely a network or firewall issue");
      console.error(
        "Make sure MongoDB Atlas IP access list includes Vercel's IPs (0.0.0.0/0)"
      );
    }
    return false;
  }
}

// Run test
testConnection()
  .then((success) => {
    console.log("Test completed", success ? "successfully" : "with errors");
    process.exit(success ? 0 : 1);
  })
  .catch((err) => {
    console.error("Unhandled error:", err);
    process.exit(1);
  });
