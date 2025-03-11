import { CATEGORY_LOADING, GET_CATEGORIES, GET_PRODUCT_BRANDS } from '../actions/types';

const initialState = {
    categories: [],
    brands: [],
    loading: false,
    totalCount: 0
};

export default function(state = initialState, action) {
    switch (action.type) {
        case CATEGORY_LOADING:
            return {
                ...state,
                loading: true
            };
        case GET_CATEGORIES:
            return {
                ...state,
                categories: action.payload.categories,
                totalCount: action.payload.totalCount,
                loading: false
            };
        case GET_PRODUCT_BRANDS:
            return {
                ...state,
                brands: action.payload
            };
        default:
            return state;
    }
} 