import { combineReducers } from 'redux';
import authReducer from './authReducer';
import cartReducer from './cartReducer';
import notificationReducer from './notificationReducer';
import orderReducer from './orderReducer';
import productReducer from './productReducer';

const initialState = {
    auth: {},
    cart: [],
    product: {},
    order: {},
    notification: {
        notifications: [],
        loading: false
    }
};

export default combineReducers({
    auth: authReducer,
    cart: cartReducer,
    product: productReducer,
    order: orderReducer,
    notification: notificationReducer
}); 