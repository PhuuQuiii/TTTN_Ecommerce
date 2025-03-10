import { combineReducers } from "redux";
import auth from "./auth_reducer";
import test from "./test_reducer";
import profile from './profile_reducer'
import business from './business_reducer'
import alert from './alert_reducer'
import notification from './notification_reducer'
import socket from './socket_reducer'
import order from './order_reducer'
import product from './product_reducer'
import superadmin from './superadmin_reducer'
import bank from './bank_reducer';
import warehouse from './warehouse_reducer';

const rootReducer = combineReducers({
  auth,
  test,
  profile,
  alert,
  notification,
  socket,
  order,
  product,
  superadmin,
  business,
  bank,
  warehouse
});

export default rootReducer;
