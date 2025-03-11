import { finish, init, success, error } from "../commonActions";
import { SALE_TYPES, SUCCESS } from "../types";
import { SaleService } from "../api/sale_api.js"; 

const saleService = new SaleService();

// Lấy tất cả sale
export const getAllSales = () => async (dispatch) => {
  dispatch(init(SALE_TYPES.GET_ALL_SALES));
  const response = await saleService.getAllSales();
  
  dispatch(finish(SALE_TYPES.GET_ALL_SALES));
  
  if (response.isSuccess) {
    dispatch(success(SALE_TYPES.GET_ALL_SALES, response.data));
  } else {
    dispatch(error(response.errorMessage));
  }
};

// Lấy sale đang active
export const getActiveSales = () => async (dispatch) => {
  dispatch(init(SALE_TYPES.GET_ACTIVE_SALES));
  const response = await saleService.getActiveSales();

  dispatch(finish(SALE_TYPES.GET_ACTIVE_SALES));

  if (response.isSuccess) {
    dispatch(success(SALE_TYPES.GET_ACTIVE_SALES, response.data));
  } else {
    dispatch(error(response.errorMessage));
  }
};

// Lấy sale theo adminId
export const getSalesByAdminId = (adminId) => async (dispatch) => {
  dispatch(init(SALE_TYPES.GET_SALES_BY_ADMIN));
  const response = await saleService.getSalesByAdminId(adminId);

  dispatch(finish(SALE_TYPES.GET_SALES_BY_ADMIN));

  if (response.isSuccess) {
    dispatch(success(SALE_TYPES.GET_SALES_BY_ADMIN, response.data));
  } else {
    dispatch(error(response.errorMessage));
  }
};

// Tạo sale
export const createSale = (saleData) => async (dispatch) => {
  dispatch(init(SALE_TYPES.CREATE_SALE));
  const response = await saleService.createSale(saleData);

  dispatch(finish(SALE_TYPES.CREATE_SALE));

  if (response.isSuccess) {
    dispatch(success(SUCCESS, "Tạo sale thành công!"));
    dispatch(success(SALE_TYPES.CREATE_SALE, response.data));
  } else {
    dispatch(error(response.errorMessage));
  }
};