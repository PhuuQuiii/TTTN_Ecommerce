import { BankService } from '../api/bank_api';
import { BANK_TYPES } from '../types';

const bankService = new BankService();

// Get bank info
export const fetchBankInfo = (bankId) => async dispatch => {
  try {
    dispatch({ type: BANK_TYPES.GET_BANK_INFO_REQUEST }); // Add loading state
    
    const response = await bankService.getBankInfo(bankId);
    console.log('Bank action response:', response); // Debug log
    
    if (!response) {
      throw new Error('No data received from server');
    }

    dispatch({
      type: BANK_TYPES.GET_BANK_INFO_SUCCESS,
      payload: response
    });

    return response;
  } catch (error) {
    console.error("Bank API Error:", error);
    dispatch({
      type: BANK_TYPES.BANK_ERROR,
      payload: { msg: error.message || 'Failed to fetch bank info', status: error.response ? error.response.status : 500 }
    });
    throw error;
  }
};

// Update or create bank info
export const saveBankInfo = (formData, id) => async dispatch => {
  try {
    dispatch({ type: BANK_TYPES.UPDATE_BANK_INFO_REQUEST }); // Add loading state
    
    const response = await bankService.updateBank(formData, id);
    console.log('Save bank info response:', response); // Debug log
    
    dispatch({
      type: BANK_TYPES.UPDATE_BANK_INFO_SUCCESS,
      payload: response
    });

    return response;
  } catch (error) {
    console.error("Save bank error:", error);
    dispatch({
      type: BANK_TYPES.BANK_ERROR,
      payload: { msg: error.message || 'Failed to save bank info', status: error.response ? error.response.status : 500 }
    });
    throw error;
  }
};