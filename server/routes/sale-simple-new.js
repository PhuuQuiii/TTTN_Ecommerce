const express = require("express");
const router = express.Router();

// Get active sales - simplified version
router.get("/active", async (req, res) => {
  try {
    // Format response to match frontend expectations
    res.json({
      data: {
        message: "Không có chương trình sale nào đang diễn ra",
        activeSales: [],
        timestamp: new Date().toISOString(),
        status: "working",
      },
    });
  } catch (error) {
    console.error("Sale fetch error:", error);
    res.status(500).json({ error: "Failed to fetch sales" });
  }
});

module.exports = router;
