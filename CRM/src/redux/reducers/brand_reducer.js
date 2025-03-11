import { BRAND_TYPES } from '../actions/types';

const initialState = {
    brands: [],
    loading: false,
    error: null,
    totalCount: 0
};

export default function brandReducer(state = initialState, action) {
    console.log('Brand Reducer:', { action, currentState: state });
    
    switch (action.type) {
        case BRAND_TYPES.GET_BRANDS_REQUEST:
        case BRAND_TYPES.FLIP_BRAND_REQUEST:
        case BRAND_TYPES.DELETE_BRAND_REQUEST:
        case BRAND_TYPES.CREATE_BRAND_REQUEST:
        case BRAND_TYPES.UPDATE_BRAND_REQUEST:
            return { ...state, loading: true };

        case BRAND_TYPES.GET_BRANDS_SUCCESS:
            console.log('GET_BRANDS_SUCCESS payload:', action.payload);
            return {
                ...state,
                loading: false,
                brands: action.payload.brands || [],
                totalCount: action.payload.totalCount || 0
            };

        case BRAND_TYPES.FLIP_BRAND_SUCCESS:
            return {
                ...state,
                loading: false,
                brands: state.brands.map(brand => 
                    brand._id === action.payload._id ? action.payload : brand
                )
            };

        case BRAND_TYPES.DELETE_BRAND_SUCCESS:
        case BRAND_TYPES.CREATE_BRAND_SUCCESS:
        case BRAND_TYPES.UPDATE_BRAND_SUCCESS:
            return { ...state, loading: false };

        case BRAND_TYPES.GET_BRANDS_FAILURE:
        case BRAND_TYPES.FLIP_BRAND_FAILURE:
        case BRAND_TYPES.DELETE_BRAND_FAILURE:
        case BRAND_TYPES.CREATE_BRAND_FAILURE:
        case BRAND_TYPES.UPDATE_BRAND_FAILURE:
            return { 
                ...state, 
                loading: false, 
                error: action.payload 
            };

        default:
            return state;
    }
}