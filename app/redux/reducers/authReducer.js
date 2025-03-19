import {
  AUTHENTICATE,
  AUTHENTICATE_ERROR,
  AUTHENTICATE_INIT,
  DEAUTHENTICATE,
  REGISTER_FAIL,
  REGISTER_SUCCESS
} from "../types";

const initialState = {
  token: null,
  tokenError: null,
  authLoading: false,
  isAuthenticated: false,
  registerSuccess: false,
  registerError: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE_INIT:
      return { 
        ...state, 
        token: null, 
        hasError: false, 
        authLoading: true, 
        isAuthenticated: false,
        registerSuccess: false,
        registerError: null
      };
    case AUTHENTICATE:
      return { 
        ...state, 
        token: action.payload, 
        hasError: false, 
        authLoading: false,
        isAuthenticated: true 
      };
    case DEAUTHENTICATE:
      return { 
        ...state, 
        token: null, 
        hasError: false, 
        isAuthenticated: false,
        registerSuccess: false,
        registerError: null
      };
    case AUTHENTICATE_ERROR:
      return { 
        ...state, 
        tokenError: action.payload, 
        hasError: true, 
        authLoading: false,
        isAuthenticated: false 
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        registerSuccess: true,
        registerError: null,
        authLoading: false
      };
    case REGISTER_FAIL:
      return {
        ...state,
        registerSuccess: false,
        registerError: action.payload,
        authLoading: false
      };
    default:
      return state;
  }
};
