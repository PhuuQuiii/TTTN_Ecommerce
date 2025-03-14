export const QUINDIGO_BASE_URL = 'https://servertttn-production.up.railway.app'

export const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://servertttn-production.up.railway.app' : process.env.SERVER_BASE_URL

export const USER_AUTH_BASE_URL = `${BASE_URL}/api/user-auth`
export const SUPER_AUTH_BASE_URL = `${BASE_URL}/api/superadmin`
export const USER_BASE_URL = `${BASE_URL}/api/user`
export const CART_BASE_URL = `${BASE_URL}/api/cart-wishlist`
export const ORDER_BASE_URL = `${BASE_URL}/api/order`
export const PRODUCT_BASE_URL = `${BASE_URL}/api/product`
export const REVIEW_BASE_URL = `${BASE_URL}/api/review-qna`
export const WISHLIST_BASE_URL = `${BASE_URL}/api/cart-wishlist`
export const IMAGE_BASE_URL = `${BASE_URL}/uploads`