// Import main server configuration
// This is the Vercel serverless entry point that redirects to our main server.js
const app = require("../server");

// Export for Vercel serverless functions
module.exports = app;

// Swagger configuration
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Ecom API",
      description: "ecommerce API information",
      contact: {
        name: "Amazing Developer",
      },
      servers: ["https://backend-ecommerce-theta-plum.vercel.app"],
    },
  },
  apis: ["../controllers/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use("/api/paypal", paypalRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/api/admin-auth", require("../routes/admin_auth"));
app.use("/api/user-auth", require("../routes/user_auth"));
app.use("/api/admin", require("../routes/admin"));
app.use("/api/superadmin", require("../routes/superadmin"));
app.use("/api/user", require("../routes/user"));
app.use("/api/product", require("../routes/product"));
app.use("/api/order", require("../routes/order"));
app.use("/api/review-qna", require("../routes/review_qna"));
app.use("/api/cart-wishlist", require("../routes/cart_wishlist"));
app.use("/api/dispatcher-auth", require("../routes/dispatcher_auth"));
app.use("/api/sale", require("../routes/sale"));
app.use("/api/notification", require("../routes/notification"));

// Logout endpoint
app.delete("/api/logout", async (req, res) => {
  const RefreshToken = require("../models/RefereshToken");
  const { refreshToken } = req.body;
  await RefreshToken.deleteOne({ refreshToken });
  res.status(200).json({ msg: "Logged Out" });
});

// Error handling
app.use(errorHandler);

module.exports = app;
