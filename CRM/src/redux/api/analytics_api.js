import axios from 'axios';
import { SERVER_URL } from '../../utils/config';

const getAdminRole = async (token) => {
    try {
        const response = await axios.get(`${SERVER_URL}api/admin-auth/load-me`, {
            headers: {
                'x-auth-token': token,
                'Content-Type': 'application/json'
            }
        });
        console.log('Load-me response:', response.data); // Debug log
        if (!response.data || !response.data.admin) {
            console.error('Invalid response format:', response.data);
            throw new Error('Invalid response format');
        }
        return response.data.admin.role;
    } catch (error) {
        console.error('Error loading admin role:', error);
        throw error;
    }
};

export const getAnalytics = async (token) => {
    try {
        const role = await getAdminRole(token);
        console.log('Admin role:', role); // Debug log

        const endpoint = role === 'superadmin' ? 'superadmin' : 'admin';
        console.log('Using endpoint:', endpoint); // Debug log

        const response = await axios.get(`${SERVER_URL}api/${endpoint}/analytics`, {
            headers: {
                'x-auth-token': token,
                'Content-Type': 'application/json'
            }
        });
        console.log('Analytics response:', response.data); // Debug log
        return response.data;
    } catch (error) {
        console.error('Analytics API Error:', error.response?.data || error.message);
        throw error.response?.data || { error: 'Failed to fetch analytics data' };
    }
};

export const getRevenue = async (params) => {
    try {
        const token = localStorage.getItem('token');
        const role = await getAdminRole(token);
        console.log('Admin role:', role); // Debug log
        const endpoint = role === 'superadmin' ? 'superadmin' : 'admin';
        console.log('Using endpoint:', endpoint); // Debug log
        
        const { isSuperAdmin: _, ...queryParams } = params;
        const response = await axios.get(`${SERVER_URL}api/${endpoint}/revenue`, {
            params: queryParams,
            headers: {
                'x-auth-token': token,
                'Content-Type': 'application/json'
            }
        });
        console.log('Revenue response:', response.data); // Debug log
        return response.data;
    } catch (error) {
        console.error('Revenue API Error:', error.response?.data || error.message);
        throw error.response?.data || { error: 'Failed to fetch revenue data' };
    }
}; 