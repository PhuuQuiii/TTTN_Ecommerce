const express = require('express');
const router = express.Router();
const paypalController = require('../controllers/paypal'); 

const {auth:userAuth} = require("../controllers/user_auth")

router.post('/create-order',userAuth, paypalController.createOrder);
router.post('/capture-order',userAuth, paypalController.captureOrder);

module.exports = router;