import { ADMINS_TYPES, ADMIN_APPROVAL_TYPES, ADMIN_TYPES } from "../types";

const initialState = {
  admin: null,
  admins: [],
  multiAdminLoading: true,
  singleAdminLoading: true,
  totalCount: 0,
  loading: false,
  error: null,
  data: null,
  users: [],
  user: null, // Thêm user vào initialState
  toggleUserBlockLoading: false, // Thêm toggleUserBlockLoading vào initialState
};

export default function superadminReducer(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case ADMINS_TYPES.GET_ADMINS:
      return {
        ...state,
        admins: payload.admins,
        totalCount: payload.totalCount
      };
    case ADMIN_TYPES.GET_ADMIN:
      return {
        ...state,
        admin: payload,
        singleAdminLoading: false
      };
    case ADMINS_TYPES.GET_ADMINS_INIT:
      return {
        ...state,
        multiAdminLoading: true,
        // admins:[],
        // totalCount:0
      };
    case ADMINS_TYPES.GET_ADMINS_FINISH:
      return {
        ...state,
        multiAdminLoading: false
      };
    case ADMIN_TYPES.GET_ADMIN_FINISH:
      return {
        ...state,
        singleAdminLoading: false
      };
    case ADMIN_TYPES.GET_ADMIN_INIT:
      return {
        ...state,
        singleAdminLoading: true,
        admin: null
      };
    case ADMIN_APPROVAL_TYPES.FLIP_ADMIN_BUSINESS_APPROVAL_REQUEST:
    case ADMIN_APPROVAL_TYPES.FLIP_ADMIN_BANK_APPROVAL_REQUEST:
    case ADMIN_APPROVAL_TYPES.FLIP_ADMIN_WAREHOUSE_APPROVAL_REQUEST:
    case ADMIN_APPROVAL_TYPES.FLIP_ADMIN_ACCOUNT_APPROVAL_REQUEST:
    case ADMIN_APPROVAL_TYPES.BLOCK_UNBLOCK_ADMIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case ADMIN_APPROVAL_TYPES.FLIP_ADMIN_BUSINESS_APPROVAL_SUCCESS:
    case ADMIN_APPROVAL_TYPES.FLIP_ADMIN_BANK_APPROVAL_SUCCESS:
    case ADMIN_APPROVAL_TYPES.FLIP_ADMIN_WAREHOUSE_APPROVAL_SUCCESS:
    case ADMIN_APPROVAL_TYPES.FLIP_ADMIN_ACCOUNT_APPROVAL_SUCCESS:
    case ADMIN_APPROVAL_TYPES.BLOCK_UNBLOCK_ADMIN_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        data: payload
      };

    case ADMIN_APPROVAL_TYPES.FLIP_ADMIN_BUSINESS_APPROVAL_FAILURE:
    case ADMIN_APPROVAL_TYPES.FLIP_ADMIN_BANK_APPROVAL_FAILURE:
    case ADMIN_APPROVAL_TYPES.FLIP_ADMIN_WAREHOUSE_APPROVAL_FAILURE:
    case ADMIN_APPROVAL_TYPES.FLIP_ADMIN_ACCOUNT_APPROVAL_FAILURE:
    case ADMIN_APPROVAL_TYPES.BLOCK_UNBLOCK_ADMIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error
      };

    case ADMIN_APPROVAL_TYPES.GET_USERS_SUCCESS:
      return {
        ...state,
        users: action.payload.users, // Đảm bảo payload.users chứa danh sách người dùng
        totalCount: action.payload.totalCount, // Cập nhật totalCount nếu cần
      };
    case ADMIN_APPROVAL_TYPES.GET_USER_SUCCESS:
      return {
        ...state,
        user: action.payload, // Cập nhật state với dữ liệu người dùng
      };
    case ADMIN_APPROVAL_TYPES.BLOCK_UNBLOCK_USER_REQUEST:
      return {
        ...state,
        toggleUserBlockLoading: true,
      };
    case ADMIN_APPROVAL_TYPES.BLOCK_UNBLOCK_USER_SUCCESS:
      return {
        ...state,
        toggleUserBlockLoading: false,
        users: state.users.map(user => user.id === payload.id ? { ...user, isBlocked: payload.isBlocked } : user),
      };
    case ADMIN_APPROVAL_TYPES.BLOCK_UNBLOCK_USER_FAILURE:
      return {
        ...state,
        toggleUserBlockLoading: false,
        error: action.error,
      };

    default:
      return state;
  }
}
