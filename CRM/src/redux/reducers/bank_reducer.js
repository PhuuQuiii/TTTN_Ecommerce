import { BANK_TYPES } from '../types';

const initialState = {
  bank: null,
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch(type) {
    case BANK_TYPES.GET_BANK_INFO_REQUEST:
    case BANK_TYPES.UPDATE_BANK_INFO_REQUEST:
      return {
        ...state,
        loading: true,
        error: {}
      };

    case BANK_TYPES.GET_BANK_INFO_SUCCESS:
      return {
        ...state,
        bank: payload,
        loading: false,
        error: {}
      };

    case BANK_TYPES.UPDATE_BANK_INFO_SUCCESS:
      return {
        ...state,
        bank: payload,
        loading: false,
        error: {}
      };

    case BANK_TYPES.BANK_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };

    default:
      return state;
  }
}