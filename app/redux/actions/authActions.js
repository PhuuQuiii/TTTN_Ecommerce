import AsyncStorage from '@react-native-async-storage/async-storage';
import { decodeToken, isTokenExpired } from "../../utils/common";
import { AuthService } from "../services/authService";
import {
  AUTHENTICATE,
  AUTHENTICATE_ERROR,
  AUTHENTICATE_INIT,
  DEAUTHENTICATE,
  GLOBAL_ERROR,
  REGISTER_FAIL,
  REGISTER_SUCCESS,
  USER_INITIAL_STATE,
  USER_PROFILE_INIT,
} from "../types";
import { getUserProfile } from "./userActions";

// Register new user
export const register = (userData) => async (dispatch) => {
  try {
    dispatch({ type: AUTHENTICATE_INIT });
    const authService = new AuthService();
    const response = await authService.signupUser(userData);
    // console.log("Register response:", response);

    if (response.isSuccess) {
      dispatch({
        type: REGISTER_SUCCESS,
        payload: response.data
      });
      return response;
    } else {
      dispatch({
        type: REGISTER_FAIL,
        payload: response.errorMessage
      });
      throw new Error(response.errorMessage || 'Registration failed');
    }
  } catch (error) {
    // console.error("Register error:", error);
    dispatch({
      type: REGISTER_FAIL,
      payload: error.message || "Registration failed"
    });
    throw error;
  }
};

// gets token from the api and stores it in the redux store and in asyncstorage
export const authenticate = (body, type, redirectUrl, navigation) => {
  return async (dispatch) => {
    try {
      dispatch({ type: AUTHENTICATE_INIT });
      dispatch({ type: USER_PROFILE_INIT });
      
      const authService = new AuthService();
      const response = await authService.loginUser(body);
      // console.log("Auth response:", response);

      if (response.isSuccess) {
        await AsyncStorage.setItem("token", response.data.accessToken);
        dispatch({ type: AUTHENTICATE, payload: response.data.accessToken });
        
        // Get user ID from token and fetch profile
        const _id = decodeToken(response.data.accessToken);
        // console.log("Fetching profile for user ID:", _id);
        await dispatch(getUserProfile(_id));
      } else {
        dispatch({ type: GLOBAL_ERROR, payload: response.errorMessage });
        dispatch({ type: AUTHENTICATE_ERROR, payload: response.errorMessage });
      }
    } catch (error) {
      // console.error("Auth error:", error);
      dispatch({ type: GLOBAL_ERROR, payload: error.message || "Authentication failed" });
      dispatch({ type: AUTHENTICATE_ERROR, payload: error.message || "Authentication failed" });
    }
  };
};

// gets the token from the cookie and saves it in the store
export const reauthenticate = (token) => {
  if (isTokenExpired(token)) {
    return (dispatch) => {
      dispatch(deauthenticate());
    };
  }
  return (dispatch) => {
    dispatch({ type: AUTHENTICATE, payload: token });
    const _id = decodeToken(token);
    dispatch(getUserProfile(_id));
  };
};

// removing the token
export const deauthenticate = () => {
  return async (dispatch) => {
    await AsyncStorage.removeItem("token");
    dispatch({ type: USER_INITIAL_STATE });
    dispatch({ type: DEAUTHENTICATE });
  };
};

export default {
  authenticate,
  reauthenticate,
  deauthenticate,
  register,
};

