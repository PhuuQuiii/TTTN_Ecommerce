import { BANK_TYPES } from '../types';
import { BankService } from '../api/bank_api';

const bankService = new BankService();

// Get bank info
export const fetchBankInfo = (id) => async dispatch => {
  try {
    const response = await bankService.getBankInfo(id);
    dispatch({
      type: BANK_TYPES.GET_BANK_INFO,
      payload: response
    });
  } catch (error) {
    dispatch({
      type: BANK_TYPES.BANK_ERROR,
      payload: { msg: error.message, status: error.response.status }
    });
  }
};

// Update or create bank info
export const saveBankInfo = (id, bankInfo) => async dispatch => {
  try {
    const response = await bankService.updateBank(bankInfo, id);
    dispatch({
      type: BANK_TYPES.UPDATE_BANK_INFO,
      payload: response
    });
  } catch (error) {
    dispatch({
      type: BANK_TYPES.BANK_ERROR,
      payload: { msg: error.message, status: error.response.status }
    });
  }
};