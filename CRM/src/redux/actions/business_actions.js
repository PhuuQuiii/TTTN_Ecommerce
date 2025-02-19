import { BUSINESS_TYPES } from '../types';
import { BusinessInfoService } from '../api/businessinfo_api';

const businessInfoService = new BusinessInfoService();

// Get business info
export const getBusinessInfo = (userId) => async dispatch => {
  try {
    const response = await businessInfoService.getBusinessInfo(userId);
    dispatch({
      type: BUSINESS_TYPES.GET_BUSINESS_INFO,
      payload: response.data // Truyền dữ liệu từ response.data
    });
  } catch (err) {
    console.error("Action Error:", err); // Log lỗi nếu có
    dispatch({
      type: BUSINESS_TYPES.BUSINESS_ERROR,
      payload: { msg: err.message, status: err.status }
    });
  }
};