const express = require("express");
const router = express.Router();

// Import models directly
const Banner = require("../models/Banner");
const Category = require("../models/Category");

// Get banners with pagination
router.get("/banner", async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const perPage = +req.query.perPage || 10;

    const banners = await Banner.find({ isDeleted: null })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .lean();

    const totalCount = await Banner.countDocuments({ isDeleted: null });

    res.json({ banners, totalCount });
  } catch (error) {
    console.error("Banner fetch error:", error);
    res.status(500).json({ error: "Failed to fetch banners" });
  }
});

// Get product categories
router.get("/product-categories", async (req, res) => {
  try {
    const categories = await Category.find();
    const totalCount = await Category.countDocuments();

    res.json({ categories, totalCount });
  } catch (error) {
    console.error("Categories fetch error:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

module.exports = router;
