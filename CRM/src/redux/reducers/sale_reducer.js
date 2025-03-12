import { SALE_TYPES } from "../types";

const initialState = {
  sales: [],
  activeSales: [],
  salesByAdmin: [],
  loading: false,
  error: null,
};

export default function saleReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SALE_TYPES.GET_ALL_SALES_INIT:
      return { ...state, loading: true };
    case SALE_TYPES.GET_ALL_SALES:
      return { ...state, loading: false, sales: payload };
    case SALE_TYPES.GET_ALL_SALES_FINISH:
      return { ...state, loading: false };

    case SALE_TYPES.GET_ACTIVE_SALES_INIT:
      return { ...state, loading: true };
    case SALE_TYPES.GET_ACTIVE_SALES:
      return { ...state, loading: false, activeSales: payload };
    case SALE_TYPES.GET_ACTIVE_SALES_FINISH:
      return { ...state, loading: false };

    case SALE_TYPES.GET_SALES_BY_ADMIN_INIT:
      return { ...state, loading: true };
      case SALE_TYPES.GET_SALES_BY_ADMIN:
        return { 
          ...state, 
          loading: false, 
          salesByAdmin: payload,
          sales: payload // Also update the sales array
        };
    case SALE_TYPES.GET_SALES_BY_ADMIN_FINISH:
      return { ...state, loading: false };

    case SALE_TYPES.CREATE_SALE_INIT:
      return { ...state, loading: true };
    case SALE_TYPES.CREATE_SALE:
      return { ...state, loading: false, sales: [payload, ...state.sales] };
    case SALE_TYPES.CREATE_SALE_FINISH:
      return { ...state, loading: false };

    case SALE_TYPES.DELETE_SALE_INIT:
      return { ...state, loading: true };
      case SALE_TYPES.DELETE_SALE:
        return {
          ...state,
          loading: false,
          sales: state.sales.filter(sale => sale._id !== payload),
          salesByAdmin: state.salesByAdmin.filter(sale => sale._id !== payload), // Add this line
        };
    case SALE_TYPES.DELETE_SALE_FINISH:
      return { ...state, loading: false };
      
    default:
      return state;
  }
}