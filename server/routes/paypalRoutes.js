const paypal = require('@paypal/checkout-server-sdk');// SDK của PayPal để thao tác với API thanh toán
const client = require('../utils/paypal.js');// Import file cấu hình PayPal Client

const express = require('express');
const router = express.Router();

router.post('/create-order', async (req, res) => {
  try {
    const { amount } = req.body;// Lấy số tiền từ request body
    if (!amount) {
      return res.status(400).json({ message: 'Amount is required' });
    }

    const PaypalClient = client();// Khởi tạo client PayPal
    const request = new paypal.orders.OrdersCreateRequest(); // Tạo một yêu cầu tạo đơn hàng
    request.headers['prefer'] = 'return=representation';// Yêu cầu phản hồi đầy đủ từ PayPal
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{ amount: { currency_code: 'USD', value: amount } }],
    });

    const response = await PaypalClient.execute(request);
    res.status(201).json({ orderID: response.result.id });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/capture-order', async (req, res) => {
    try {
      const { orderID } = req.body;
      if (!orderID) {
        return res.status(400).json({ message: 'Order ID is required' });
      }
  
      const PaypalClient = client();
      const request = new paypal.orders.OrdersCaptureRequest(orderID);
      request.requestBody({});
  
      const response = await PaypalClient.execute(request);
      res.status(200).json({ success: true, details: response.result });
    } catch (error) {
      console.error('Error capturing order:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });


  module.exports = router;