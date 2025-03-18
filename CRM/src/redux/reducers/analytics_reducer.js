import { ANALYTICS_ERROR, GET_ANALYTICS, GET_REVENUE } from '../actions/types';

const initialState = {
    analytics: null,
    revenue: 0,
    loading: true,
    error: null
};

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case GET_ANALYTICS:
            return {
                ...state,
                analytics: payload,
                loading: false
            };
        case GET_REVENUE:
            return {
                ...state,
                revenue: payload,
                loading: false
            };
        case ANALYTICS_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            };
        default:
            return state;
    }
} 