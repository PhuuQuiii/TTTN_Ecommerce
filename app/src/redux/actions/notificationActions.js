import axios from 'axios';
import { API_URL } from '../../utils/common';

export const GET_NOTIFICATIONS = 'GET_NOTIFICATIONS';
export const MARK_AS_READ = 'MARK_AS_READ';

export const getNotifications = () => async (dispatch) => {
    try {
        const response = await axios.get(`${API_URL}/notification/user`);
        dispatch({
            type: GET_NOTIFICATIONS,
            payload: response.data
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
    }
};

export const markAsRead = (notificationId) => async (dispatch) => {
    try {
        await axios.patch(`${API_URL}/notification/${notificationId}/read`);
        dispatch({
            type: MARK_AS_READ,
            payload: notificationId
        });
    } catch (error) {
        console.error('Error marking notification as read:', error);
    }
}; 