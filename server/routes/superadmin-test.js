const express = require("express");
const router = express.Router();

// Test route for superadmin
router.get("/product-categories", (req, res) => {
  res.json({
    categories: [],
    totalCount: 0,
    message: "Categories endpoint is working - DB will be connected later",
  });
});

router.get("/banner", (req, res) => {
  const page = +req.query.page || 1;
  const perPage = +req.query.perPage || 10;

  res.json({
    banners: [],
    totalCount: 0,
    page,
    perPage,
    message: "Banner endpoint is working - DB will be connected later",
  });
});

module.exports = router;
