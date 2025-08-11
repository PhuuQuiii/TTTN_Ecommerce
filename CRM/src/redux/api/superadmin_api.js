import axios from 'axios';
import { getService, postService } from "../commonServices";
import store from '../store'; // Đảm bảo rằng bạn đã import store đúng cách

export class SuperadminService {
  getAdmins(page, perPage, status = '', keyword = '') {
    let url = `/superadmin/admins?page=${page}&perPage=${perPage}&status=${status}&keyword=${keyword}`;
    let data = getService(url);
    return data;
  }

  getAdmin(id) {
    let url = `/admin/${id}`;
    let data = getService(url);
    return data;
  }

  getProducts({ page, perPage, keyword = '', createdAt = '', updatedAt = '', status = '', price = '', outofstock = '' }) {
    let url = `/superadmin/products?page=${page}&perPage=${perPage}&createdAt=${createdAt}&price=${price}&updatedAt=${updatedAt}&status=${status}&keyword=${keyword}&outofstock=${outofstock}`;
    let data = getService(url);
    return data;
  }

  approveProduct(product_slug) {
    let url = `/superadmin/approve-product/${product_slug}`;
    let data = postService(url, undefined, 'PATCH');
    return data;
  }

  disApproveProduct(product_slug, comment = '') {
    const body = JSON.stringify({ comment });
    let url = `/superadmin/disapprove-product/${product_slug}`;
    let data = postService(url, body, 'PUT');
    return data;
  }

  flipAdminBusinessApproval(b_id) {
    let url = `/superadmin/flip-admin-business-approval/${b_id}`;
    return postService(url, undefined, 'PATCH');
  }

  flipAdminBankApproval(bank_id) {
    let url = `/superadmin/flip-admin-bank-approval/${bank_id}`;
    return postService(url, undefined, 'PATCH');
  }

  flipAdminWarehouseApproval(w_id) {
    let url = `/superadmin/flip-admin-warehouse-approval/${w_id}`;
    return postService(url, undefined, 'PATCH');
  }

  flipAdminAccountApproval(a_id) {
    let url = `/superadmin/flip-admin-account-approval/${a_id}`;
    return postService(url, undefined, 'PATCH');
  }

  blockUnblockAdmin(id) {
    let url = `/superadmin/block-unblock-admin/${id}`;
    return postService(url, undefined, 'PATCH');
  }

  async getUsers(params) {
    const state = store.getState();
    const token = state.auth.token; // Giả sử token được lưu trong state.auth.token
    try {
      const response = await axios.get('http://localhost:3001/api/superadmin/users', {
      // const response = await axios.get('https://backend-ecommerce-theta-plum.vercel.app/api/superadmin/users', {
        headers: {
          'x-auth-token': token
        },
        params: {
          page: params.page,
          perPage: params.perPage,
          keyword: params.keyword,
          status: params.status
        }
      });
      return response.data; // Đảm bảo trả về dữ liệu đúng định dạng
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async blockUnblockUser(userId, isBlocked) {
    const state = store.getState();
    const token = state.auth.token; // Giả sử token được lưu trong state.auth.token
    try {
      // const response = await axios.patch(`http://localhost:3001/api/superadmin/block-unblock-user/${userId}`, {
      const response = await axios.patch(`https://backend-ecommerce-theta-plum.vercel.app/api/superadmin/block-unblock-user/${userId}`, {
        isBlocked
      }, {
        headers: {
          'x-auth-token': token
        }
      });
      return response.data; // Đảm bảo trả về dữ liệu đúng định dạng
    } catch (error) {
      console.error('Error blocking/unblocking user:', error);
      throw error;
    }
  }
}
 