import {
  GLOBAL_ERROR,
  MY_PROFILE_REVIEWS,
  UPDATE_PROFILE_PICTURE,
  USER_PROFILE,
} from "../types";

const initialState = {
  userProfile: null,
  myReviews: [],
  profilePicture: null,
  error: null,
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case USER_PROFILE:
      return {
        ...state,
        userProfile: action.payload,
        error: null,
      };
    case MY_PROFILE_REVIEWS:
      return {
        ...state,
        myReviews: action.payload,
        error: null,
      };
    case UPDATE_PROFILE_PICTURE:
      return {
        ...state,
        profilePicture: action.payload,
        error: null,
      };
    case GLOBAL_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
}
