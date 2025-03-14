import {
    GET_ACTIVE_SALES_START,
    GET_ACTIVE_SALES_SUCCESS,
    GET_ACTIVE_SALES_FAIL
  } from "../types";
  import SaleService  from "../services/saleService";
  
  export const getActiveSales = () => {
    return async (dispatch) => {
      try {
        dispatch({ type: GET_ACTIVE_SALES_START });
        const response = await SaleService.getActiveSales();
        // response có thể là mảng sale
        dispatch({
          type: GET_ACTIVE_SALES_SUCCESS,
          payload: response
        });
      } catch (err) {
        dispatch({
          type: GET_ACTIVE_SALES_FAIL,
          error: err.message
        });
      }
    };
  };