// Simple Vercel-compatible server
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Database Connection (simplified for Vercel)
const mongoose = require("mongoose");

// Connect to MongoDB
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }).then(() => {
    console.log('Connected to MongoDB');
  }).catch(err => {
    console.error('MongoDB connection error:', err);
  });
} else {
  console.warn('MONGO_URI not found in environment variables');
}

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
  res.json({ 
    status: "OK", 
    uptime: process.uptime(),
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// Add basic API routes
try {
  app.use("/api/superadmin", require("./routes/superadmin-test"));
  app.use("/api/sale", require("./routes/sale-test"));
  
  console.log('Test routes loaded successfully');
} catch (error) {
  console.error('Error loading routes:', error.message);
}

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

module.exports = app;
