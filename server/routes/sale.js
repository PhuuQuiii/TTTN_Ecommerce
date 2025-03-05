const express = require("express");
const router = express.Router();
const saleController = require("../controllers/sale");

router.post("/create", saleController.createSale);
router.get("/active", saleController.getActiveSales);
router.get("/admin/:adminId", saleController.getSalesByAdminId);
router.get("/all", saleController.getAllSales);

module.exports = router;