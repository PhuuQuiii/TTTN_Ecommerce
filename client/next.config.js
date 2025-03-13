// const withSass = require("@zeit/next-sass");
// const sassConfig = withSass({
//   /* config options here */
// });
require('dotenv').config();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { dev, isServer }) => {
    // Disable Fast Refresh
    if (dev && !isServer) {
      config.plugins = config.plugins.filter(
        (plugin) => plugin.constructor.name !== 'ReactFreshWebpackPlugin'
      );
    }

    // Disable DLL
    config.optimization = {
      ...config.optimization,
      runtimeChunk: false,
      splitChunks: {
        cacheGroups: {
          default: false,
        },
      },
    };

    return config;
  },
  // withSass: sassConfig,
  env: {
    BASE_URL: process.env.BASE_URL,
    SERVER_BASE_URL: process.env.SERVER_BASE_URL,
    IMAGE_BASE_URL: process.env.IMAGE_BASE_URL,
    JWT_SIGNIN_KEY: process.env.JWT_SIGNIN_KEY,
    JWT_EMAIL_VERIFICATION_KEY: process.env.JWT_EMAIL_VERIFICATION_KEY,
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
};

module.exports = nextConfig;
