import { CATEGORY_LOADING, GET_CATEGORIES, GET_PRODUCT_BRANDS, CATEGORY_TYPES } from '../actions/types';

const initialState = {
    categories: [],
    brands: [],
    loading: false,
    error: null,
    totalCount: 0
};

export default function (state = initialState, action) {
    switch (action.type) {
        case CATEGORY_LOADING:
        case CATEGORY_TYPES.GET_BRANDS_REQUEST:
        case CATEGORY_TYPES.CREATE_CATEGORY_REQUEST:
            return { ...state, loading: true };

        case GET_CATEGORIES:
        case 'GET_CATEGORIES_SUCCESS':
            return {
                ...state,
                categories: action.payload.categories,
                totalCount: action.payload.totalCount || state.totalCount, // Giữ nguyên totalCount nếu không có
                loading: false
            };

        case GET_PRODUCT_BRANDS:
        case CATEGORY_TYPES.GET_BRANDS_SUCCESS:
            return { ...state, loading: false, brands: action.payload };

        case 'GET_CATEGORIES_FAIL':
        case CATEGORY_TYPES.GET_BRANDS_FAILURE:
        case CATEGORY_TYPES.CREATE_CATEGORY_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case CATEGORY_TYPES.CREATE_CATEGORY_SUCCESS:
            return { ...state, loading: false };

            case CATEGORY_TYPES.FLIP_CATEGORY_REQUEST:
                case CATEGORY_TYPES.DELETE_CATEGORY_REQUEST:
                    return { ...state, loading: true };
                
                case CATEGORY_TYPES.FLIP_CATEGORY_SUCCESS:
                    return { 
                        ...state, 
                        loading: false,
                        categories: state.categories.map(cat => 
                            cat.slug === action.payload.slug 
                                ? {...cat, isDisabled: action.payload.isDisabled}
                                : cat
                        )
                    };
                
                case CATEGORY_TYPES.DELETE_CATEGORY_SUCCESS:
                    return { ...state, loading: false };
                
                case CATEGORY_TYPES.FLIP_CATEGORY_FAILURE:
                case CATEGORY_TYPES.DELETE_CATEGORY_FAILURE:
                    return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
}
