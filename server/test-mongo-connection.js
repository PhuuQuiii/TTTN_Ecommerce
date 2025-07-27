/**
 * This file tests MongoDB connection independently
 * Run with: node test-mongo-connection.js
 */
require("dotenv").config();
const mongoose = require("mongoose");

async function testMongoConnection() {
  console.log("Testing MongoDB connection...");
  console.log(
    `MongoDB URI: ${
      process.env.MONGO_URI ? "URI is configured" : "URI is missing"
    }`
  );

  try {
    // Attempt connection with timeout
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 seconds
      socketTimeoutMS: 30000,
    };

    await mongoose.connect(process.env.MONGO_URI, options);
    console.log(
      "✅ MongoDB Connected! Database name:",
      mongoose.connection.db.databaseName
    );

    // Get database stats
    const stats = await mongoose.connection.db.stats();
    console.log(
      `Database stats: ${stats.collections} collections, ${stats.objects} objects`
    );

    // List collections
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log("Collections:", collections.map((c) => c.name).join(", "));

    // Test a simple query
    const result = await mongoose.connection.db
      .collection("users")
      .countDocuments();
    console.log(`User count: ${result}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    console.error("Error details:", error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log("Connection closed");
  }
}

// Run the test
testMongoConnection().catch(console.error);
