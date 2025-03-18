import { SearchService } from "../services/searchService";
import { SEARCH_FILTER, SEARCH_KEYWORD, SEARCH_PRODUCTS, SEARCH_PRODUCTS_FINISH, SEARCH_PRODUCTS_START } from "../types";

const getSearchKeywords = (query) => {
  return async (dispatch) => {
    const searchService = new SearchService();
    const response = await searchService.getSearchKeywords(query);
    if (response.isSuccess) {
      dispatch({ type: SEARCH_KEYWORD, payload: response.data });
    }
  };
};

const searchProducts = (query, body) => {
  return async (dispatch) => {
    dispatch({type: SEARCH_PRODUCTS_START})
    const searchService = new SearchService();
    const response = await searchService.searchProducts(query, body);
    if (response.isSuccess) {
      dispatch({type: SEARCH_PRODUCTS_FINISH})
      dispatch({ type: SEARCH_PRODUCTS, payload: response.data });
    } else {
      dispatch({type: SEARCH_PRODUCTS_FINISH})
    }
  };
};

const getProductsByCategory = (query, ctx) => {
  return async (dispatch) => {
    dispatch({type: SEARCH_PRODUCTS_START})
    const searchService = new SearchService();
    const response = await searchService.getProductsByCategory(query, ctx);
    if (response.isSuccess) {
      dispatch({type: SEARCH_PRODUCTS_FINISH})
      dispatch({ type: SEARCH_PRODUCTS, payload: response.data });
    } else {
      dispatch({type: SEARCH_PRODUCTS_FINISH})
    }
  };
};

const searchFilter = (query) => {
  return async (dispatch) => {
    const searchService = new SearchService();
    const response = await searchService.searchFilter(query);
    if (response.isSuccess) {
      dispatch({ type: SEARCH_FILTER, payload: response.data });
    }
  };
};

export default {
  searchProducts,
  searchFilter,
  getProductsByCategory,
  getSearchKeywords
};
