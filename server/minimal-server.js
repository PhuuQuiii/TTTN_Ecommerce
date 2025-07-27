/**
 * Minimal Express server for Vercel serverless deployment
 *
 * This file provides a simplified version of the main server
 * to help diagnose issues in the Vercel serverless environment.
 */
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Create Express app
const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// MongoDB connection with cached connection
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    console.log("Using cached database connection");
    return;
  }

  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false,
    });

    cachedDb = mongoose.connection.db;
    console.log(
      "✅ Connected to MongoDB:",
      mongoose.connection.db.databaseName
    );
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    // Continue even if connection fails
  }
}

// Basic health check route
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Minimal Express API is running",
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    env: process.env.NODE_ENV,
  });
});

// MongoDB status check
app.get("/db-status", async (req, res) => {
  try {
    await connectToDatabase();

    const status = mongoose.connection.readyState;
    const statusMap = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    res.json({
      status: statusMap[status] || "unknown",
      dbName: mongoose.connection.db?.databaseName || "Not connected",
      message:
        status === 1 ? "Connected to MongoDB" : "Not connected to MongoDB",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Simple API that doesn't need database
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from minimal API!" });
});

// User auth check
app.get("/user-auth/test", async (req, res) => {
  try {
    await connectToDatabase();
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({
        error: "Database not connected",
        readyState: mongoose.connection.readyState,
      });
    }

    const users = await mongoose.connection.db
      .collection("users")
      .countDocuments();
    res.json({
      message: "User auth test route",
      usersCount: users,
      dbConnected: true,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server if not on Vercel
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Minimal server running on port ${PORT}`);
  });
}

// Connect to database when loaded in Vercel
connectToDatabase().catch(console.error);

// Export for Vercel
module.exports = app;
