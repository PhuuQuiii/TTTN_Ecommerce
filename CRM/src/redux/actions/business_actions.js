import { BUSINESS_TYPES } from '../types';
import { BusinessInfoService } from '../api/businessinfo_api';

const businessInfoService = new BusinessInfoService();

// Get business info
export const getBusinessInfo = (userId) => async dispatch => {
  try {
    const response = await businessInfoService.getBusinessInfo(userId);
    if (response.isSuccess) {
      dispatch({
        type: BUSINESS_TYPES.GET_BUSINESS_INFO,
        payload: response.data
      });
    } else {
      dispatch({
        type: BUSINESS_TYPES.BUSINESS_ERROR,
        payload: { msg: response.errorMessage, status: response.status }
      });
    }
  } catch (err) {
    dispatch({
      type: BUSINESS_TYPES.BUSINESS_ERROR,
      payload: { msg: err.message, status: err.status }
    });
  }
};