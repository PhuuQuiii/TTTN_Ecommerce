import { GET_NOTIFICATIONS, MARK_AS_READ } from '../actions/notificationActions';

const initialState = {
    notifications: [],
    loading: false
};

export default function notificationReducer(state = initialState, action) {
    switch (action.type) {
        case GET_NOTIFICATIONS:
            return {
                ...state,
                notifications: action.payload,
                loading: false
            };
        case MARK_AS_READ:
            return {
                ...state,
                notifications: state.notifications.map(notification =>
                    notification._id === action.payload
                        ? { ...notification, isRead: true }
                        : notification
                )
            };
        default:
            return state;
    }
} 