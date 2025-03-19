import { mutliProductCardSekelton } from "../../utils/skeletons";
import { SEARCH_ERROR, SEARCH_FILTER, SEARCH_KEYWORD, SEARCH_PRODUCTS, SEARCH_PRODUCTS_FINISH, SEARCH_PRODUCTS_START } from "../types";

const initialState = {
  getSearchFilter: null,
  getSearchData: null,
  getSearchKeywords: null,
  searchLoading: false,
  hasError: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_PRODUCTS_START:
      return { ...state, getSearchData: mutliProductCardSekelton, searchLoading: true };
    case SEARCH_PRODUCTS_FINISH:
      return { ...state, searchLoading: false };
    case SEARCH_KEYWORD:
      return { ...state, getSearchKeywords: action.payload };
    case SEARCH_FILTER:
      return { ...state, getSearchFilter: action.payload };
    case SEARCH_PRODUCTS:
      return { ...state, getSearchData: action.payload };
    case SEARCH_ERROR:
      return { ...state };
    default:
      return state;
  }
};
