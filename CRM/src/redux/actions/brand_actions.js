import { message } from 'antd';
import { BRAND_TYPES } from './types';
import { getBrandsAPI, flipBrandStatusAPI, deleteBrandAPI, createBrandAPI} from '../api/brand_api';

export const createBrand = (brandData) => async (dispatch) => {
    dispatch({ type: BRAND_TYPES.CREATE_BRAND_REQUEST });
    
    try {
        const response = await createBrandAPI(brandData);
        dispatch({ type: BRAND_TYPES.CREATE_BRAND_SUCCESS, payload: response });
        message.success('Brand created successfully');
        dispatch(getBrands()); // Refresh list
        return Promise.resolve();
    } catch (error) {
        dispatch({ type: BRAND_TYPES.CREATE_BRAND_FAILURE, payload: error.message });
        message.error(error.message);
        return Promise.reject(error);
    }
};

export const getBrands = (page, perPage) => async (dispatch) => {
    dispatch({ type: BRAND_TYPES.GET_BRANDS_REQUEST });
    
    try {
        const response = await getBrandsAPI(page, perPage);
        dispatch({ 
            type: BRAND_TYPES.GET_BRANDS_SUCCESS, 
            payload: {
                brands: response.brands,
                totalCount: response.totalCount
            }
        });
    } catch (error) {
        dispatch({ type: BRAND_TYPES.GET_BRANDS_FAILURE, payload: error.message });
        message.error(error.message);
    }
};

export const flipBrandStatus = (brandId) => async (dispatch) => {
    dispatch({ type: BRAND_TYPES.FLIP_BRAND_REQUEST });
    
    try {
        const response = await flipBrandStatusAPI(brandId);
        dispatch({ type: BRAND_TYPES.FLIP_BRAND_SUCCESS, payload: response });
        message.success('Brand status updated successfully');
        dispatch(getBrands());
    } catch (error) {
        dispatch({ type: BRAND_TYPES.FLIP_BRAND_FAILURE, payload: error.message });
        message.error(error.message);
    }
};

export const deleteBrand = (brandId) => async (dispatch) => {
    dispatch({ type: BRAND_TYPES.DELETE_BRAND_REQUEST });
    
    try {
        await deleteBrandAPI(brandId);
        dispatch({ type: BRAND_TYPES.DELETE_BRAND_SUCCESS });
        message.success('Brand deleted successfully');
        dispatch(getBrands());
    } catch (error) {
        dispatch({ type: BRAND_TYPES.DELETE_BRAND_FAILURE, payload: error.message });
        message.error(error.message);
    }
};