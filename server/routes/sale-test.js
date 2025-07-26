const express = require("express");
const router = express.Router();

// Test route for sale
router.get("/active", (req, res) => {
  res.json({
    message: "Không có chương trình sale nào đang diễn ra",
    activeSales: [],
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
