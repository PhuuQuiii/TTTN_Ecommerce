import axios from 'axios';
import { BUSINESS_ERROR, GET_BUSINESS_INFO, UPDATE_BUSINESS_INFO } from '../types';

const API_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:3001';
// const API_URL = process.env.REACT_APP_SERVER_URL || 'https://backend-ecommerce-theta-plum.vercel.app';

// Helper function to get auth headers
const getAuthHeaders = (contentType = 'application/json') => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    return {
        'Content-Type': contentType,
        'x-auth-token': ` ${token}`,
        'userid': userId
    };
};

// Get business info
export const getBusinessInfo = (userId) => async dispatch => {
    try {
        const config = {
            headers: getAuthHeaders()
        };

        const res = await axios.get(`${API_URL}api/admin/businessinfo/${userId}`, config);
        dispatch({
            type: GET_BUSINESS_INFO,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: BUSINESS_ERROR,
            payload: err.response?.data?.message || 'Error fetching business info'
        });
    }
};

// Update business info
export const updateBusinessInfo = (formData) => async dispatch => {
    try {
        const config = {
            headers: getAuthHeaders('multipart/form-data')
        };

        const res = await axios.put(
            `${API_URL}api/admin/businessinfo/${formData.get('userId')}`, 
            formData, 
            config
        );
        
        dispatch({
            type: UPDATE_BUSINESS_INFO,
            payload: res.data
        });

        return Promise.resolve(res.data);
    } catch (err) {
        dispatch({
            type: BUSINESS_ERROR,
            payload: err.response?.data?.message || 'Error updating business info'
        });
        return Promise.reject(err);
    }
};