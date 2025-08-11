const express = require("express");
const cors = require("cors");
require("dotenv").config();
const Fawn = require("fawn");
const expressValidator = require("express-validator");
require("express-async-errors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const { dbConnection, errorHandler } = require("./middleware/helpers");

// Create Express app
const app = express();

// CORS whitelist
const allowlist = [
  "http://localhost:3000",
  "http://localhost:3003",
  "http://localhost:3002",
  "http://157.245.106.101:3000",
  "http://157.245.106.101:3003",
  "http://157.245.106.101:3002",
  "https://ecommerce-alpha-two-72.vercel.app",
  "https://backend-ecommerce-theta-plum.vercel.app",
];

const corsOptionsDelegate = function (req, callback) {
  const corsOptions = {
    origin: allowlist.includes(req.header("Origin")),
  };
  callback(null, corsOptions);
};

// Middleware setup
app.use(cors(corsOptionsDelegate));
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(expressValidator());

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Ecom API",
      description: "ecommerce API information",
      contact: { name: "Amazing Developer" },
      servers: ["https://backend-ecommerce-theta-plum.vercel.app"],
    },
  },
  apis: ["./controllers/*.js"],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// // API Root Test
// app.get("/", (req, res) => {
//   res.json({ message: "Backend is running on Vercel!" });
// });

// Async DB + Route boot
(async () => {
  try {
    // Add timeout for serverless environment
    const dbConnectionPromise = dbConnection.dbConnection();
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Database connection timeout after 5 seconds"));
      }, 5000);
    });

    // Race between connection and timeout
    if (process.env.NODE_ENV === "production") {
      await Promise.race([dbConnectionPromise, timeoutPromise]).catch((err) => {
        console.warn(" Database connection warning:", err.message);
        console.log(
          "Continuing without confirmed DB connection in serverless environment..."
        );
        // In serverless, we'll let routes try to connect when needed
      });
    } else {
      // In non-serverless, wait for connection
      await dbConnectionPromise;
    }

    console.log(" All systems go!");

    //  Only import routes AFTER dbConnection & Fawn.init
    app.use("/api/paypal", require("./routes/paypalRoutes"));
    app.use("/api/admin-auth", require("./routes/admin_auth"));
    app.use("/api/user-auth", require("./routes/user_auth"));
    app.use("/api/admin", require("./routes/admin"));
    app.use("/api/superadmin", require("./routes/superadmin"));
    app.use("/api/user", require("./routes/user"));
    app.use("/api/product", require("./routes/product"));
    app.use("/api/order", require("./routes/order"));
    app.use("/api/review-qna", require("./routes/review_qna"));
    app.use("/api/cart-wishlist", require("./routes/cart_wishlist"));
    app.use("/api/dispatcher-auth", require("./routes/dispatcher_auth"));
    app.use("/api/sale", require("./routes/sale"));
    app.use("/api/notification", require("./routes/notification"));

    // Also support routes without /api prefix for Vercel deployment
    app.use("/paypal", require("./routes/paypalRoutes"));
    app.use("/admin-auth", require("./routes/admin_auth"));
    app.use("/user-auth", require("./routes/user_auth"));
    app.use("/admin", require("./routes/admin"));
    app.use("/superadmin", require("./routes/superadmin"));
    app.use("/user", require("./routes/user"));
    app.use("/product", require("./routes/product"));
    app.use("/order", require("./routes/order"));
    app.use("/review-qna", require("./routes/review_qna"));
    app.use("/cart-wishlist", require("./routes/cart_wishlist"));
    app.use("/dispatcher-auth", require("./routes/dispatcher_auth"));
    app.use("/sale", require("./routes/sale"));
    app.use("/notification", require("./routes/notification")); // Logout handler
    app.delete("/api/logout", async (req, res) => {
      const RefreshToken = require("./models/RefereshToken");
      const { refreshToken } = req.body;
      await RefreshToken.deleteOne({ refreshToken });
      res.status(200).json({ msg: "Logged Out" });
    });

    // Livestream auth
    app.post("/auth", function (req, res) {
      const streamkey = req.body.key;
      if (streamkey === "supersecret") return res.sendStatus(200);
      return res.sendStatus(403);
    });

    // Optional: Start a server locally (if NOT using Vercel)
    // app.listen(3001, () => console.log("Server listening on port 3001"));
  } catch (err) {
    console.error("❌ Init error:", err);
    process.exit(1);
  }
})();

// Error handler
app.use((err, req, res, next) => {
  console.log("****SERVER_ERROR****");
  console.error(err);
  if (err.message === "Not Image") {
    return res.status(415).json({ error: "Images are only allowed" });
  }
  return res
    .status(500)
    .json({ error: errorHandler(err) || "Something went wrong!" });
});

// Endpoint to check MongoDB connection status
app.get("/db-status", async (req, res) => {
  try {
    const {
      getConnectionStatus,
    } = require("./middleware/helpers/dbConnection");
    return res.json(getConnectionStatus());
  } catch (error) {
    console.error("Error in /db-status endpoint:", error);
    return res.status(500).json({
      message: "Error checking database connection",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Root route for health check
app.get("/", (req, res) => {
  res.json({
    message: "Backend is running on Vercel!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    mongoUriConfigured: !!process.env.MONGO_URI,
  });
});

// Simple test route that doesn't require database
app.get("/api-test", (req, res) => {
  res.json({
    message: "API is working!",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
    nodeVersion: process.version,
    memoryUsage: JSON.stringify(process.memoryUsage()),
    uptime: process.uptime(),
  });
});

// Start server if running locally (not on Vercel)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the Express app
module.exports = app;
