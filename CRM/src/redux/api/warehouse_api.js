import axios from 'axios';

const API_URL = process.env.REACT_APP_SERVER_URL || 'https://backend-ecommerce-theta-plum.vercel.app';
// const API_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:3001';

export class WarehouseService {
  async getWareHouse(id) {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'x-auth-token': token,
        'userid': userId
      }
    };

    try {
      const response = await axios.get(`${API_URL}api/admin/warehouse/${id}`, config);
      return response.data;
    } catch (error) {
      console.error('Get Warehouse Error:', error.response?.data || error);
      throw error.response?.data || error.message;
    }
  }

  async updateWareHouse(id, warehouseInfo) {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'x-auth-token': token,
        'userid': userId
      }
    };

    try {
      const response = await axios.put(`${API_URL}api/admin/warehouse/${id}`, warehouseInfo, config);
      return response.data;
    } catch (error) {
      console.error('Update Warehouse Error:', error.response?.data || error);
      throw error.response?.data || error.message;
    }
  }
}