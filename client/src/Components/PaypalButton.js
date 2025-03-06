import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import axios from 'axios';

const RechargeWallet = () => {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('paypal');

  const createOrder = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/paypal/create-order', { amount: parseFloat(amount) });
      return response.data.orderID;
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      return null;
    }
  };

  const captureOrder = async (orderID) => {
    try {
      const response = await axios.post('http://localhost:3001/api/paypal/capture-order', { orderID });
      console.log('Order captured:', response.data);
      return true;
    } catch (error) {
      console.error('Error capturing PayPal order:', error);
      return false;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Recharge</h2>
        <p className="text-sm text-gray-600 mb-4">Recharge your wallet using the following securely supported payment methods</p>
        
        <div className="mb-4">
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              className="form-radio"
              name="paymentMethod"
              value="manual"
              checked={selectedMethod === 'manual'}
              onChange={() => setSelectedMethod('manual')}
            />
            <span className="ml-2">Manual</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio"
              name="paymentMethod"
              value="paypal"
              checked={selectedMethod === 'paypal'}
              onChange={() => setSelectedMethod('paypal')}
            />
            <span className="ml-2">PayPal</span>
          </label>
        </div>

        <div className="mb-4">
          <input
            type="number"
            placeholder="Enter the amount in US Dollars you want to add in the wallet"
            className="w-full p-2 border rounded-md"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {selectedMethod === 'paypal' && (
          <PayPalScriptProvider
            options={{
              'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
              currency: 'USD',
              intent: 'capture'
            }}
          >
            <div className="space-y-2">
              <PayPalButtons
                style={{
                  color: 'gold',
                  shape: 'rect',
                  label: 'pay',
                  height: 50
                }}
                createOrder={createOrder}
                onApprove={async (data) => {
                  const result = await captureOrder(data.orderID);
                  return result;
                }}
              />
              <div className="text-center">
                <button className="w-full bg-black text-white py-3 rounded-md flex items-center justify-center">
                  <span>Debit or Credit Card</span>
                </button>
              </div>
            </div>
          </PayPalScriptProvider>
        )}
      </div>
    </div>
  );
};

export default RechargeWallet;