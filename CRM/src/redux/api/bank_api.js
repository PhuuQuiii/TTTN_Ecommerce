import axios from 'axios';

const API_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:3001';
// const API_URL = process.env.REACT_APP_SERVER_URL || 'https://backend-ecommerce-theta-plum.vercel.app';

export class BankService {
  async updateBank(formData, id) {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
        'x-auth-token': token,
        'userid': userId
      }
    };

    try {
      console.log('Updating bank info with data:', formData);
      const response = await axios.put(`${API_URL}api/admin/bank/${id}`, formData, config);
      console.log('Update bank response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Bank API Error:', error.response?.data || error);
      throw error.response?.data || error.message;
    }
  }

  async getBankInfo(id) {
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
      console.log('Fetching bank info for ID:', id);
      const response = await axios.get(`${API_URL}api/admin/bank/${id}`, config);
      console.log('Bank Info Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get Bank Info Error:', error.response?.data || error);
      throw error.response?.data || error.message;
    }
  }
}