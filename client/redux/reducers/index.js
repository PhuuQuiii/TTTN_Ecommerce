import { combineReducers } from 'redux';
import authReducer from './authReducer';
import cartReducer from './cartReducer';
import globalErrorReducer from './globalErrorReducer';
import listingReducer from './listingReducer';
import menuReducer from './menuReducer';
import orderReducer from './orderReducer';
import otherReducer from './otherReducer';
import productReducer from './productReducer';
import userReducer from './userReducer';
import wishlistReducer from './wishlistReducer';

const rootReducer = combineReducers({
  authentication: authReducer,
  products: productReducer,
  menu: menuReducer,
  listing: listingReducer,
  user: userReducer,
  globalError: globalErrorReducer,
  other: otherReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  order: orderReducer
});

export default rootReducer;
