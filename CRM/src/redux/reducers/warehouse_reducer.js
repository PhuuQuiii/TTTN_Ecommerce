import { WAREHOUSE_TYPES } from '../types';

const initialState = {
  warehouse: null,
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch(type) {
    case WAREHOUSE_TYPES.GET_WAREHOUSE_INFO:
      return {
        ...state,
        warehouse: payload,
        loading: false
      };
    case WAREHOUSE_TYPES.UPDATE_WAREHOUSE_INFO:
      return {
        ...state,
        warehouse: payload,
        loading: false
      };
    case WAREHOUSE_TYPES.WAREHOUSE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
}