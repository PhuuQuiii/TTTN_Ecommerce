import axios from 'axios';

const API_URL = `${process.env.REACT_APP_SERVER_URL}api/superadmin`;

// Trong file brand_api.js
export const createBrandAPI = async (brandData) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.put(
            `${API_URL}/product-brand`,
            brandData,
            {
                headers: { 
                    "x-auth-token": token,
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to create brand');
    }
};

export const getBrandsAPI = async (page = 1, perPage = 10) => {
    try {
        const response = await axios.get(`${API_URL}/product-brands`, {
            params: { page, perPage }
        });
        
        console.log('API Response:', response.data);
        
        return {
            brands: response.data,
            totalCount: response.data.length
        };
    } catch (error) {
        console.error('API Error:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch brands');
    }
};

export const flipBrandStatusAPI = async (brandId) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.patch(
            `${API_URL}/flip-brand-status/${brandId}`,
            {},
            {
                headers: { "x-auth-token": token }
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to toggle brand status');
    }
};

export const deleteBrandAPI = async (brandId) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(
            `${API_URL}/delete-brand/${brandId}`,
            {
                headers: { "x-auth-token": token }
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete brand');
    }
};