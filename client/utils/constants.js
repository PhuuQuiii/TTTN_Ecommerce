export const QUINDIGO_BASE_URL = "http://157.245.106.101";

// export const BASE_URL = process.env.NODE_ENV === 'production' ? 'http://157.245.106.101:3001' : process.env.SERVER_BASE_URL
export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://backend-ecommerce-theta-plum.vercel.app"
    : process.env.SERVER_BASE_URL;

export const USER_AUTH_BASE_URL = `${BASE_URL}/user-auth`;
export const SUPER_AUTH_BASE_URL = `${BASE_URL}/superadmin`;
export const USER_BASE_URL = `${BASE_URL}/user`;
export const CART_BASE_URL = `${BASE_URL}/cart-wishlist`;
export const ORDER_BASE_URL = `${BASE_URL}/order`;
export const PRODUCT_BASE_URL = `${BASE_URL}/product`;
export const REVIEW_BASE_URL = `${BASE_URL}/review-qna`;
export const WISHLIST_BASE_URL = `${BASE_URL}/cart-wishlist`;
export const IMAGE_BASE_URL = `${BASE_URL}/uploads`;
export const SALE_BASE_URL = `${BASE_URL}/sale`;
