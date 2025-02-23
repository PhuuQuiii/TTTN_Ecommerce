import { getService, postService } from '../commonServices';

export class WarehouseService {
  async getWareHouse(id) {
    const url = `/admin/warehouse/${id}`;
    const response = await getService(url);
    if (!response.isSuccess) {
      throw new Error(response.errorMessage || 'Failed to fetch warehouse info');
    }
    return response.data;
  }

  async updateWareHouse(id, warehouseInfo) {
    const url = `/admin/warehouse/${id}`;
    const body = JSON.stringify(warehouseInfo);
    const response = await postService(url, body, 'PUT');
    if (!response.isSuccess) {
      throw new Error(response.errorMessage || 'Failed to update warehouse info');
    }
    return response.data;
  }
}