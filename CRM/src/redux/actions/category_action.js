import axios from 'axios';
import { CATEGORY_LOADING, GET_CATEGORIES, GET_PRODUCT_BRANDS } from './types';

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

export const getProductBrands = () => async dispatch => {
    try {
        const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}api/superadmin/product-brands`);
        dispatch({
            type: GET_PRODUCT_BRANDS,
            payload: res.data
        });
    } catch (error) {
        console.error('Error fetching product brands:', error);
    }
}; 