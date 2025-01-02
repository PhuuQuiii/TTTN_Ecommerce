import { BUSINESS_TYPES } from '../types';

const initialState = {
  business: null,
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch(type) {
    case BUSINESS_TYPES.GET_BUSINESS_INFO:
      return {
        ...state,
        business: payload,
        loading: false
      };
    case BUSINESS_TYPES.BUSINESS_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
}