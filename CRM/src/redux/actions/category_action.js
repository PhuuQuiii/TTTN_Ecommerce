import axios from 'axios';
import { message } from 'antd';
import { CATEGORY_LOADING, GET_CATEGORIES, GET_PRODUCT_BRANDS, CATEGORY_TYPES } from './types';
import { getProductBrandsAPI, createCategoryAPI, flipCategoryAvailabilityAPI, deleteCategoryAPI } from '../api/category_api';

export const getCategories = (page = 1, perPage = 5, status) => async dispatch => {
    try {
        dispatch({ type: CATEGORY_LOADING });
        const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}api/superadmin/product-categories`, {
            params: {
                page,
                perPage,
                status
            }
        });
        dispatch({
            type: GET_CATEGORIES,
            payload: {
                categories: res.data.categories,
                totalCount: res.data.totalCount
            }
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
};

export const getProductBrands = () => async (dispatch) => {
    dispatch({ type: CATEGORY_TYPES.GET_BRANDS_REQUEST });

    try {
        const brands = await getProductBrandsAPI();
        dispatch({ type: CATEGORY_TYPES.GET_BRANDS_SUCCESS, payload: brands });
    } catch (error) {
        dispatch({ type: CATEGORY_TYPES.GET_BRANDS_FAILURE, payload: error });
        message.error(error);
    }
};

export const createCategory = (categoryData, form) => async (dispatch) => {
    dispatch({ type: CATEGORY_TYPES.CREATE_CATEGORY_REQUEST });

    try {
        const response = await createCategoryAPI(categoryData);

        if (response.success) {
            dispatch({ type: CATEGORY_TYPES.CREATE_CATEGORY_SUCCESS });
            message.success('Category created successfully');
            form.resetFields();
        } else {
            throw response.message;
        }
    } catch (error) {
        dispatch({ type: CATEGORY_TYPES.CREATE_CATEGORY_FAILURE, payload: error });
        message.error(error);
    }
};

// Trong CRM/src/redux/actions/category_action.js
export const flipCategoryAvailability = (categorySlug) => async (dispatch) => {
    dispatch({ type: CATEGORY_TYPES.FLIP_CATEGORY_REQUEST });
    
    try {
        const response = await flipCategoryAvailabilityAPI(categorySlug);
        dispatch({ type: CATEGORY_TYPES.FLIP_CATEGORY_SUCCESS, payload: response });
        message.success('Category status updated successfully');
        dispatch(getCategories()); // Refresh list
    } catch (error) {
        dispatch({ type: CATEGORY_TYPES.FLIP_CATEGORY_FAILURE, payload: error.message });
        message.error(error.message);
    }
};

export const deleteCategory = (categorySlug) => async (dispatch) => {
    dispatch({ type: CATEGORY_TYPES.DELETE_CATEGORY_REQUEST });
    
    try {
        await deleteCategoryAPI(categorySlug);
        dispatch({ type: CATEGORY_TYPES.DELETE_CATEGORY_SUCCESS });
        message.success('Category deleted successfully');
        dispatch(getCategories()); // Refresh list
    } catch (error) {
        dispatch({ type: CATEGORY_TYPES.DELETE_CATEGORY_FAILURE, payload: error.message });
        message.error(error.message);
    }
};