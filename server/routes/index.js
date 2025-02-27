const express = require('express');
const socRoutes = require('./soc');
const orderRoutes = require('./order');
const router = express.Router();

router.use('/soc', socRoutes);
router.use('/order', orderRoutes);

module.exports = router;
