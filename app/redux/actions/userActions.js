import { decodeToken } from "../../utils/common";
import { UserService } from "../services/userService";
import {
  GLOBAL_ERROR,
  MY_PROFILE_REVIEWS,
  UPDATE_PROFILE_PICTURE,
  USER_PROFILE,
} from "../types";

export const getUserProfile = (id) => {
  return async (dispatch) => {
    try {
      // console.log("Fetching user profile for ID:", id);
      const userService = new UserService();
      const response = await userService.getUserProfile(id);
      // console.log("User profile response:", response);
      
      if (response.isSuccess) {
        dispatch({ type: USER_PROFILE, payload: response.data });
      } else {
        // console.error("Failed to fetch user profile:", response.errorMessage);
        dispatch({
          type: GLOBAL_ERROR,
          payload: response.errorMessage || "Failed to fetch user profile",
        });
      }
    } catch (error) {
      // console.error("Error in getUserProfile:", error);
      dispatch({
        type: GLOBAL_ERROR,
        payload: error.message || "An error occurred while fetching user profile",
      });
    }
  };
};

export const updateProfile = (profile, id) => {
  return async (dispatch) => {
    try {
      // console.log("Updating profile for ID:", id);
      const userService = new UserService();
      const response = await userService.updateProfile(profile, id);
      // console.log("Update profile response:", response);
      
      if (response.isSuccess) {
        dispatch({ type: USER_PROFILE, payload: response.data });
      } else {
        // console.error("Failed to update profile:", response.errorMessage);
        dispatch({
          type: GLOBAL_ERROR,
          payload: response.errorMessage || "Failed to update profile",
        });
      }
    } catch (error) {
      // console.error("Error in updateProfile:", error);
      dispatch({
        type: GLOBAL_ERROR,
        payload: error.message || "An error occurred while updating profile",
      });
    }
  };
};

export const updateProfilePicture = (body, token) => {
  return async (dispatch) => {
    const userService = new UserService();
    const response = await userService.updateProfilePicture(body, token);
    if (response.isSuccess) {
      dispatch({ type: UPDATE_PROFILE_PICTURE, payload: response.data });
      const _id = decodeToken(token);
      dispatch(getUserProfile(_id));
    } else if (!response.isSuccess) {
      dispatch({
        type: GLOBAL_ERROR,
        payload: response.errorMessage,
      });
    }
  };
};

export const getMyReviews = (query, token) => {
  return async (dispatch) => {
    const userService = new UserService();
    const response = await userService.getMyReviews(query, token);
    if (response.isSuccess) {
      dispatch({ type: MY_PROFILE_REVIEWS, payload: response.data });
    } else if (!response.isSuccess) {
      dispatch({
        type: GLOBAL_ERROR,
        payload: response.errorMessage,
      });
    }
  };
};

export default {
  getUserProfile,
  updateProfilePicture,
  getMyReviews,
  updateProfile,
};
