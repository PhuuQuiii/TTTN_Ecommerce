const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');
const dotenv = require('dotenv');

dotenv.config();

const configureEnvironment = () => {
  return process.env.NODE_ENV === 'production'
    ? new checkoutNodeJssdk.core.LiveEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET
      )
    : new checkoutNodeJssdk.core.SandboxEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET
      );
};

const client = () => {
  return new checkoutNodeJssdk.core.PayPalHttpClient(configureEnvironment());
};

module.exports = client;