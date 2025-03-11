//package
import React from "react";
import { Switch} from "react-router-dom";
// import { connect } from "react-redux";
//router
import SuperAdminRoute from "./SuperAdminRoute";
import AdminRoute from './AdminRoute'

//UI components
import Home from "../components/pages/Home";
import Profile from "../components/pages/Profile";
import Product from '../components/pages/Product'
import AddProduct from '../components/pages/Product/AddProduct'
import EditProduct from '../components/pages/Product/EditProduct'
import Order from '../components/pages/Order'
import Admin from "../components/pages/SuperAdmin/Admin";
import SProduct from "../components/pages/SuperAdmin/Product";
import ManageUsers from "../components/pages/SuperAdmin/ManageUsers";
import ManageCategory from "../components/pages/SuperAdmin/ManageCategory";
import CreateCategory from "../components/pages/SuperAdmin/CreateCategory";
import ManageBrand from "../components/pages/SuperAdmin/ManageBrand";
import LiveStream from "../components/pages/Live_Stream/";
import Sale from "../components/pages/Sale";
import ManageSale from "../components/pages/Sale/ManageSale";


const MainRouter = (props) => {
  return (
    <Switch>
      <AdminRoute exact path="/" component={Home} />;
      <AdminRoute exact path="/profile" component={Profile} />
      <AdminRoute exact path="/manage-products" component={Product} />
      <AdminRoute exact path="/add-product" component={AddProduct} />
      <AdminRoute exact path="/order" component= {Order} />
      <AdminRoute exact path="/live-stream" component= {LiveStream} />
      <SuperAdminRoute exact path="/superadmin" component={Home}/>
      <SuperAdminRoute exact path="/superadmin/manage-products" component={SProduct} />
      <SuperAdminRoute exact path="/manage-admins" component={Admin} />
      <SuperAdminRoute exact path="/users" component={ManageUsers} />
      <SuperAdminRoute exact path="/manage-category" component={ManageCategory} />
      <SuperAdminRoute exact path="/create-category" component={CreateCategory} />
      <SuperAdminRoute exact path="/manage-brand" component={ManageBrand} />
      <AdminRoute exact path="/edit-product/:slug?" component={EditProduct} />
      <AdminRoute exact path="/sale" component={Sale} />
      <AdminRoute exact path="/sale-manage" component={ManageSale} />
    </Switch>
  );
};

// const mapStateToProps = (state) => ({
//   isAuthenticated: state.auth,
// });

// export default connect(mapStateToProps)(MainRouter);
export default MainRouter
