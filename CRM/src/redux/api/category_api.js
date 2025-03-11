import axios from 'axios';

const API_URL = `${process.env.REACT_APP_SERVER_URL}api/superadmin`;

export const getProductBrandsAPI = async () => {
    try {
        const response = await axios.get(`${API_URL}/product-brands`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch brands');
    }
};

export const createCategoryAPI = async (categoryData) => {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error('Token not found. Please login again.');
        }

        // Kiểm tra và gán `null` nếu không có `parent_id`
        const payload = {
            ...categoryData,
            parent_id: categoryData.parent_id || null
        };

        const response = await axios.put(`${API_URL}/product-category`, payload, {
            headers: {
                "x-auth-token": token,
                "Content-Type": "application/json"
            }
        });

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to create category');
    }
};

export const flipCategoryAvailabilityAPI = async (categorySlug) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.patch(
            `${API_URL}/flip-category-availablity?category_slug=${categorySlug}`,
            {},
            {
                headers: {
                    "x-auth-token": token
                }
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to toggle category status');
    }
};

export const deleteCategoryAPI = async (categorySlug) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.delete(
            `${API_URL}/delete-category/${categorySlug}`,
            {
                headers: {
                    "x-auth-token": token
                }
            }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete category');
    }
};
