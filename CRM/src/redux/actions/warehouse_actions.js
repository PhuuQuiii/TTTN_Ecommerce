import { WAREHOUSE_TYPES } from '../types';
import { WarehouseService } from '../api/warehouse_api';

const warehouseService = new WarehouseService();

// Get warehouse info
export const fetchWareHouseInfo = (id) => async dispatch => {
  try {
    const response = await warehouseService.getWareHouse(id);
    dispatch({
      type: WAREHOUSE_TYPES.GET_WAREHOUSE_INFO,
      payload: response
    });
  } catch (error) {
    dispatch({
      type: WAREHOUSE_TYPES.WAREHOUSE_ERROR,
      payload: { msg: error.message, status: error.response?.status }
    });
  }
};

// Update or create warehouse info
export const saveWareHouseInfo = (id, warehouseInfo) => async dispatch => {
  try {
    const response = await warehouseService.updateWareHouse(id, warehouseInfo);
    dispatch({
      type: WAREHOUSE_TYPES.UPDATE_WAREHOUSE_INFO,
      payload: response
    });
  } catch (error) {
    dispatch({
      type: WAREHOUSE_TYPES.WAREHOUSE_ERROR,
      payload: { msg: error.message, status: error.response?.status }
    });
  }
};