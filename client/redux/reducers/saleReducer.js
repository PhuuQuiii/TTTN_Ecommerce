import {
    GET_ACTIVE_SALES_START,
    GET_ACTIVE_SALES_SUCCESS,
    GET_ACTIVE_SALES_FAIL
  } from "../types";
  
  const initialState = {
    activeSales: [],
    loading: false,
    error: null
  };
  
  export default (state = initialState, action) => {
    switch (action.type) {
      case GET_ACTIVE_SALES_START:
        return { ...state, loading: true, error: null };
      case GET_ACTIVE_SALES_SUCCESS:
        return { ...state, loading: false, activeSales: action.payload };
      case GET_ACTIVE_SALES_FAIL:
        return { ...state, loading: false, error: action.error };
      default:
        return state;
    }
  }