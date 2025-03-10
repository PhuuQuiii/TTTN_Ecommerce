// const withSass = require("@zeit/next-sass");
// const sassConfig = withSass({
//   /* config options here */
// });
require('dotenv').config();

module.exports = {
  // withSass: sassConfig,
  env: {
    BASE_URL: process.env.BASE_URL,
    SERVER_BASE_URL: process.env.SERVER_BASE_URL,
    IMAGE_BASE_URL: process.env.IMAGE_BASE_URL,
    JWT_SIGNIN_KEY: process.env.JWT_SIGNIN_KEY,
    JWT_EMAIL_VERIFICATION_KEY: process.env.JWT_EMAIL_VERIFICATION_KEY,
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
  },
};
