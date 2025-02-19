import { ADMINS_TYPES, ADMIN_TYPES, ADMIN_APPROVAL_TYPES } from "../types";

const initialState = {
  admin: null,
  admins: [],
  multiAdminLoading: true,
  singleAdminLoading: true,
  totalCount: 0,
  loading: false,
  error: null,
  data: null
};

export default function (state = initialState, action) {
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

    default:
      return state;
  }
}
