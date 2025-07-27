// Simple standalone API handler for Vercel serverless
// This file doesn't depend on any other parts of the project

// Basic setup
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

// Basic middleware
app.use(cors());
app.use(express.json());

// Simple route that always works
app.get("/", (req, res) => {
  res.json({
    message: "Standalone Express API is working!",
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
  });
});

// Health check route
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    env: process.env.NODE_ENV,
    time: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("API Error:", err);
  res.status(500).json({
    error: err.message || "Internal Server Error",
    path: req.url,
  });
});

// Export the Express app for serverless
module.exports = app;
