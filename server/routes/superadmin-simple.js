const express = require("express");
const router = express.Router();

// Test endpoint without database first
router.get("/banner", async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const perPage = +req.query.perPage || 10;

    // Simple response first to test if route works
    res.json({
      banners: [],
      totalCount: 0,
      page,
      perPage,
      message: "Banner endpoint working - simplified version",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Banner fetch error:", error);
    res.status(500).json({ error: "Failed to fetch banners" });
  }
});

// Test endpoint without database first
router.get("/product-categories", async (req, res) => {
  try {
    res.json({
      categories: [],
      totalCount: 0,
      message: "Categories endpoint working - simplified version",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Categories fetch error:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

module.exports = router;
