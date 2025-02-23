import { SuperadminService } from "../api/superadmin_api";
import { error, finish, init, success } from "../commonActions";
import { ADMINS_TYPES, ADMIN_APPROVAL_TYPES, ADMIN_TYPES, BEING_ADMIN, BEING_SUPERADMIN, PRODUCTS_TYPES, TOGGLE_PRODUCT_STATUS_TYPES } from "../types";

const superadminService = new SuperadminService();

export const getAdmins = (page, perPage, status, keyword) => async (dispatch) => {
  dispatch(init(ADMINS_TYPES.GET_ADMINS));

  const response = await superadminService.getAdmins(page, perPage, status, keyword);

  dispatch(finish(ADMINS_TYPES.GET_ADMINS));

  if (response.isSuccess) {
    dispatch(success(ADMINS_TYPES.GET_ADMINS, response.data));
  } else if (!response.isSuccess) {
    dispatch(error(response.errorMessage));
  }
};

export const getAdmin = (id) => async (dispatch) => {
  dispatch(init(ADMIN_TYPES.GET_ADMIN));

  const response = await superadminService.getAdmin(id);

  dispatch(finish(ADMIN_TYPES.GET_ADMIN));

  if (response.isSuccess) {
    dispatch(success(ADMIN_TYPES.GET_ADMIN, response.data));
  } else if (!response.isSuccess) {
    dispatch(error(response.errorMessage));
  }
};

export const beAdmin = (id, history) => async (dispatch) => {
  const response = await superadminService.getAdmin(id);

  if (response.isSuccess) {
    dispatch(success(BEING_ADMIN, response.data));
    history.push('/');
    return true;
  } else if (!response.isSuccess) {
    dispatch(error(response.errorMessage));
    return false;
  }
};

export const beSuperAdmin = () => async (dispatch) => {
  dispatch({ type: BEING_SUPERADMIN });
};

export const getProducts = ({ id, page, perPage, keyword, createdAt, updatedAt, status, price, outofstock }) => async (dispatch) => {
  dispatch(init(PRODUCTS_TYPES.GET_PRODUCTS));

  const response = await superadminService.getProducts({ page, perPage, keyword, createdAt, updatedAt, status, price, outofstock });

  dispatch(finish(PRODUCTS_TYPES.GET_PRODUCTS));

  if (response.isSuccess) {
    dispatch(success(PRODUCTS_TYPES.GET_PRODUCTS, response.data));
  } else if (!response.isSuccess) {
    dispatch(error(response.errorMessage));
  }
};

export const approveProduct = (product_slug) => async (dispatch) => {
  dispatch(init(TOGGLE_PRODUCT_STATUS_TYPES.TOGGLE_PRODUCT_STATUS));

  const response = await superadminService.approveProduct(product_slug);

  dispatch(finish(TOGGLE_PRODUCT_STATUS_TYPES.TOGGLE_PRODUCT_STATUS));

  if (response.isSuccess) {
    dispatch(success(TOGGLE_PRODUCT_STATUS_TYPES.TOGGLE_PRODUCT_STATUS, response.data));
  } else if (!response.isSuccess) {
    dispatch(error(response.errorMessage));
  }
};

export const disApproveProduct = (product_slug, comment) => async (dispatch) => {
  dispatch(init(TOGGLE_PRODUCT_STATUS_TYPES.TOGGLE_PRODUCT_STATUS));

  const response = await superadminService.disApproveProduct(product_slug, comment);

  dispatch(finish(TOGGLE_PRODUCT_STATUS_TYPES.TOGGLE_PRODUCT_STATUS));

  if (response.isSuccess) {
    dispatch(success(TOGGLE_PRODUCT_STATUS_TYPES.TOGGLE_PRODUCT_STATUS, response.data[1]));
  } else if (!response.isSuccess) {
    dispatch(error(response.errorMessage));
  }
};

export const flipAdminBusinessApproval = (businessId) => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_APPROVAL_TYPES.FLIP_ADMIN_BUSINESS_APPROVAL_REQUEST });
    const response = await superadminService.flipAdminBusinessApproval(businessId);
    dispatch({
      type: ADMIN_APPROVAL_TYPES.FLIP_ADMIN_BUSINESS_APPROVAL_SUCCESS,
      payload: response
    });
  } catch (error) {
    dispatch({
      type: ADMIN_APPROVAL_TYPES.FLIP_ADMIN_BUSINESS_APPROVAL_FAILURE,
      error: error.message
    });
  }
};

export const flipAdminBankApproval = (bank_id) => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_APPROVAL_TYPES.FLIP_ADMIN_BANK_APPROVAL_REQUEST });
    const response = await superadminService.flipAdminBankApproval(bank_id);
    dispatch({
      type: ADMIN_APPROVAL_TYPES.FLIP_ADMIN_BANK_APPROVAL_SUCCESS,
      payload: response
    });
  } catch (error) {
    dispatch({
      type: ADMIN_APPROVAL_TYPES.FLIP_ADMIN_BANK_APPROVAL_FAILURE,
      error: error.message
    });
  }
};

export const flipAdminWarehouseApproval = (w_id) => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_APPROVAL_TYPES.FLIP_ADMIN_WAREHOUSE_APPROVAL_REQUEST });
    const response = await superadminService.flipAdminWarehouseApproval(w_id);
    dispatch({
      type: ADMIN_APPROVAL_TYPES.FLIP_ADMIN_WAREHOUSE_APPROVAL_SUCCESS,
      payload: response
    });
  } catch (error) {
    dispatch({
      type: ADMIN_APPROVAL_TYPES.FLIP_ADMIN_WAREHOUSE_APPROVAL_FAILURE,
      error: error.message
    });
  }
};

export const flipAdminAccountApproval = (a_id) => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_APPROVAL_TYPES.FLIP_ADMIN_ACCOUNT_APPROVAL_REQUEST });
    const response = await superadminService.flipAdminAccountApproval(a_id);
    dispatch({
      type: ADMIN_APPROVAL_TYPES.FLIP_ADMIN_ACCOUNT_APPROVAL_SUCCESS,
      payload: response
    });
  } catch (error) {
    dispatch({
      type: ADMIN_APPROVAL_TYPES.FLIP_ADMIN_ACCOUNT_APPROVAL_FAILURE,
      error: error.message
    });
  }
};

export const blockUnblockAdmin = (id) => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_APPROVAL_TYPES.BLOCK_UNBLOCK_ADMIN_REQUEST });
    const response = await superadminService.blockUnblockAdmin(id);
    dispatch({
      type: ADMIN_APPROVAL_TYPES.BLOCK_UNBLOCK_ADMIN_SUCCESS,
      payload: response
    });
  } catch (error) {
    dispatch({
      type: ADMIN_APPROVAL_TYPES.BLOCK_UNBLOCK_ADMIN_FAILURE,
      error: error.message
    });
  }
};

export const deleteUser = (userId) => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_APPROVAL_TYPES.DELETE_USER_REQUEST });
    await superadminService.deleteUser(userId); // Xóa biến response không sử dụng
    dispatch({
      type: ADMIN_APPROVAL_TYPES.DELETE_USER_SUCCESS,
      payload: { id: userId }
    });
  } catch (error) {
    dispatch({
      type: ADMIN_APPROVAL_TYPES.DELETE_USER_FAILURE,
      error: error.message
    });
  }
};

export const getUser = (userId) => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_APPROVAL_TYPES.GET_USER_REQUEST });
    const response = await superadminService.getUser(userId);
    dispatch({
      type: ADMIN_APPROVAL_TYPES.GET_USER_SUCCESS,
      payload: response.data // Đảm bảo response.data chứa dữ liệu người dùng
    });
  } catch (error) {
    dispatch({
      type: ADMIN_APPROVAL_TYPES.GET_USER_FAILURE,
      error: error.message
    });
  }
};

export const getUsers = (params) => async dispatch => {
  try {
    const data = await superadminService.getUsers(params);
    dispatch({
      type: ADMIN_APPROVAL_TYPES.GET_USERS_SUCCESS,
      payload: data
    });
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

export const blockUnblockUser = (userId, isBlocked) => async dispatch => {
  dispatch({ type: ADMIN_APPROVAL_TYPES.BLOCK_UNBLOCK_USER_REQUEST });
  try {
    const data = await superadminService.blockUnblockUser(userId, isBlocked);
    dispatch({
      type: ADMIN_APPROVAL_TYPES.BLOCK_UNBLOCK_USER_SUCCESS,
      payload: { id: userId, isBlocked }
    });
  } catch (error) {
    dispatch({
      type: ADMIN_APPROVAL_TYPES.BLOCK_UNBLOCK_USER_FAILURE,
      error: error.message
    });
  }
};