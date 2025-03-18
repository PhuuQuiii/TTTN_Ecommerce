import { getAnalytics as getAnalyticsApi, getRevenue as getRevenueApi } from '../api/analytics_api';
import { ANALYTICS_ERROR, GET_ANALYTICS, GET_REVENUE } from './types';

export const getAnalytics = () => async dispatch => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }
        console.log('Fetching analytics with token:', token); // Debug log
        const data = await getAnalyticsApi(token);
        dispatch({
            type: GET_ANALYTICS,
            payload: data
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        dispatch({
            type: ANALYTICS_ERROR,
            payload: error.message
        });
    }
};

export const getRevenue = (params) => async dispatch => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }
        console.log('Fetching revenue with params:', params); // Debug log
        const data = await getRevenueApi(params);
        dispatch({
            type: GET_REVENUE,
            payload: data
        });
    } catch (error) {
        console.error('Error fetching revenue:', error);
        dispatch({
            type: ANALYTICS_ERROR,
            payload: error.message
        });
    }
}; 