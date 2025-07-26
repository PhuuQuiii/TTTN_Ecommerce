// Simple Vercel-compatible server
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// CORS Configuration
const allowlist = [
  "http://localhost:3000",
  "http://localhost:3003",
  "http://localhost:3002",
  "https://ecommerce-alpha-two-72.vercel.app",
  "https://backend-ecommerce-theta-plum.vercel.app",
];

const corsOptionsDelegate = function (req, callback) {
  const corsOptions = {
    origin:
      allowlist.includes(req.header("Origin")) ||
      req.header("Origin") === undefined,
    credentials: true,
  };
  callback(null, corsOptions);
};

app.use(cors(corsOptionsDelegate));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Backend is running on Vercel!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.get("/api/test", (req, res) => {
  res.json({ message: "API test endpoint works!" });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", uptime: process.uptime() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

module.exports = app;
