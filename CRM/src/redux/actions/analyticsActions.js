import { getAnalytics as getAnalyticsApi, getRevenue as getRevenueApi } from '../api/analytics_api';
import { GET_ANALYTICS, GET_REVENUE } from './types';

export const getAnalytics = () => async dispatch => {
    try {
        const token = localStorage.getItem('token');
        const data = await getAnalyticsApi(token);
        dispatch({
            type: GET_ANALYTICS,
            payload: data
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        throw error;
    }
};

export const getRevenue = (params) => async dispatch => {
    try {
        const data = await getRevenueApi(params);
        dispatch({
            type: GET_REVENUE,
            payload: data
        });
    } catch (error) {
        console.error('Error fetching revenue:', error);
        throw error;
    }
}; 