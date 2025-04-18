import {
  CART_PRODUCTS,
  GLOBAL_ERROR,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  EDIT_CART_QTY,
} from "../types";
import { CartService } from "../services/cartService";
import { getDiscountedAmount } from "../../utils/common";

export const getCartProducts = (query, token) => {
  return async (dispatch) => {
    const cartService = new CartService();
    const response = await cartService.getCartProducts(query, token);
    if (response.isSuccess) {
      let noStockCarts = [];
      let inStockCarts = [];
      response.data.carts.forEach((item, i) => {
        if (item.product.quantity === 0) {
          noStockCarts.push(item);
        } else {
          inStockCarts.push(item);
        }
      });

      let inStockCartsTotalAmount = 0;
      inStockCarts.map((item, i) => {
        inStockCartsTotalAmount += getDiscountedAmount(
          item.product.price.$numberDecimal,
          item.product.discountRate
        );
      });

      let noStockCartsTotalAmount = 0;
      noStockCarts.map((item, i) => {
        noStockCartsTotalAmount += getDiscountedAmount(
          item.product.price.$numberDecimal,
          item.product.discountRate
        );
      });

      let noStockProducts = {
        carts: noStockCarts,
        totalCount: noStockCarts.length,
        totalAmount: noStockCartsTotalAmount,
      };

      let inStockProducts = {
        carts: inStockCarts,
        totalCount: inStockCarts.length,
        totalAmount: inStockCartsTotalAmount,
      };
      dispatch({
        type: CART_PRODUCTS,
        payload: { ...response.data, noStockProducts, inStockProducts },
      });
    } else if (!response.isSuccess) {
      dispatch({
        type: GLOBAL_ERROR,
        payload: response.errorMessage,
      });
    }
  };
};

export const addToCart = (query, body, token) => {
  return async (dispatch) => {
    console.log("addToCart query:", query, "body:", body);
    const cartService = new CartService();
    const response = await cartService.addToCart(query, body, token);
    console.log("addToCart response:", response);
    if (response.isSuccess) {
      dispatch({ type: ADD_TO_CART, payload: response.data });
    } else {
      dispatch({ type: GLOBAL_ERROR, payload: response.errorMessage });
    }
  };
};

const removeCart = (query) => {
  return async (dispatch) => {
    const cartService = new CartService();
    const response = await cartService.removeCart(query);
    if (response.isSuccess) {
      dispatch({ type: REMOVE_FROM_CART, payload: response.data });
    } else if (!response.isSuccess) {
      dispatch({
        type: GLOBAL_ERROR,
        payload: response.errorMessage,
      });
    }
  };
};

export const editCartQty = (query, token) => {
  return async (dispatch) => {
    const cartService = new CartService();
    const response = await cartService.editCartQty(query, token);
    if (response.isSuccess) {
      dispatch({ type: EDIT_CART_QTY, payload: response.data, });
    } else if (!response.isSuccess) {
      dispatch({
        type: GLOBAL_ERROR,
        payload: response.errorMessage,
      });
    }
  };
};

export default {
  getCartProducts,
  addToCart,
  removeCart,
  editCartQty,
};
