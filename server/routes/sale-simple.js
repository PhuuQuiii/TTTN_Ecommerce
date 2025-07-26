const express = require("express");
const router = express.Router();

// Import models directly
const Sale = require("../models/SaleProduct");
const Product = require("../models/Product");

// Get active sales
router.get("/active", async (req, res) => {
  try {
    const nowUTC = new Date();
    const nowLocal = new Date(nowUTC.getTime() + 7 * 60 * 60 * 1000); // Giờ Việt Nam

    const allSales = await Sale.find()
      .populate({
        path: "products",
        populate: {
          path: "images",
          model: "productimages",
        },
      })
      .populate("createdBy");

    let activeSales = allSales.filter((sale) => {
      const saleStartLocal = new Date(
        sale.startTime.getTime() + 7 * 60 * 60 * 1000
      );
      const saleEndLocal = new Date(
        sale.endTime.getTime() + 7 * 60 * 60 * 1000
      );
      return saleStartLocal <= nowLocal && nowLocal <= saleEndLocal;
    });

    // Convert to plain objects and filter products that are verified
    activeSales = activeSales
      .map((sale) => {
        const saleObj = sale.toObject();
        saleObj.products = saleObj.products.filter(
          (product) => product.isVerified
        );
        return saleObj;
      })
      .filter((saleObj) => saleObj.products.length > 0);

    if (activeSales.length === 0) {
      return res
        .status(200)
        .json({ message: "Không có chương trình sale nào đang diễn ra" });
    }

    const result = activeSales.map((sale) => {
      sale.startTimeVN = new Date(
        sale.startTime.getTime() + 7 * 60 * 60 * 1000
      );
      sale.endTimeVN = new Date(sale.endTime.getTime() + 7 * 60 * 60 * 1000);
      return sale;
    });

    res.json(result);
  } catch (error) {
    console.error("Active sales fetch error:", error);
    res.status(500).json({ error: "Failed to fetch active sales" });
  }
});

module.exports = router;
