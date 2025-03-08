import {
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { isEmpty } from "lodash";
import Link from "next/link";
import { withRouter } from "next/router";
import React, { Component } from "react";
import { connect } from "react-redux";
import actions from "../../../redux/actions";
import { STORE_CHECKOUT_ITEMS } from "../../../redux/types";
import { getDiscountedPrice } from "../../../utils/common";
import EditAddressModal from "../../Components/EditAddressModal";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const shortid = require("shortid");

class OrderSummary extends Component {
  state = {
    userData: [],
    activeLocation: {},
    showEditAddressModal: false,
    loading: false,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.userData !== prevState.userData && nextProps.userData) {
      let activeLocation = {};
      nextProps.userData.location.map((loc) => {
        if (loc.isActive) {
          activeLocation = loc;
        }
      });
      return {
        userData: nextProps.userData,
        activeLocation,
      };
    }
    return null;
  }

  handleCancel = (e) => {
    this.setState({
      showEditAddressModal: false,
    });
  };

  componentDidUpdate(prevProps) {
    if (this.props.orderResp !== prevProps.orderResp && this.props.orderResp) {
      this.setState({
        loading: false,
      });
    }
  }

  placeOrderItems = () => {
    let { checkoutItems, userData } = this.props;

    let products = checkoutItems.carts.map((item) => {
      return {
        p_slug: item.product.slug,
        quantity: checkoutItems.totalQty || item.quantity,
      };
    });

    let activeAddress = {};
    userData.location.map((loc) => {
      if (loc.isActive) {
        activeAddress = loc;
      }
    });

    let totalCheckoutItems = 0;
  if (!this.props.checkoutItems?.totalAmount) {
    this.props.checkoutItems?.map((items) => {
      totalCheckoutItems +=
        items.quantity *
        getDiscountedPrice(
          items.product.price.$numberDecimal,
          items.product.discountRate
        );
    });
  } else {
    totalCheckoutItems = this.props.checkoutItems.totalAmount;
  }

  let deliveryCharges =
    this.props.showShippingAddress === "showDisplay"
      ? this.props.shippingCharge
      : this.props.shippingCharge && this.props.checkoutItems.length
      ? this.props.shippingCharge
      : 0;

  let totalAmount = (totalCheckoutItems + deliveryCharges).toFixed(2);
  console.log("Total Amount in OrderSummary.js:", totalAmount); // Thêm câu lệnh console.log

    let body = {
      products,
      shipto: {
        region: activeAddress.region,
        city: activeAddress.city,
        area: activeAddress.area,
        address: activeAddress.address,
        lat: activeAddress.geolocation.coordinates[0],
        long: activeAddress.geolocation.coordinates[1],
        phoneno: activeAddress.phoneno,
      },
      shippingCharge: this.props.shippingCharge ? this.props.shippingCharge : 0,
      orderID: shortid.generate(),
      method: "Cash on Delivery",
      totalAmount: (totalCheckoutItems + deliveryCharges).toFixed(2) // Add total amount here
    };
    this.setState(
      {
        loading: true,
      },
      () => {
        this.props.placeOrder(body);
      }
    );
  };

  render() {
    let { activeLocation, userData } = this.state;

    let totalCheckoutItems = 0;
    if (!this.props.checkoutItems?.totalAmount) {
      this.props.checkoutItems?.map((items) => {
        totalCheckoutItems +=
          items.quantity *
          getDiscountedPrice(
            items.product.price.$numberDecimal,
            items.product.discountRate
          );
      });
    } else {
      totalCheckoutItems = this.props.checkoutItems.totalAmount;
    }

    let deliveryCharges =
      this.props.showShippingAddress === "showDisplay"
        ? this.props.shippingCharge
        : this.props.shippingCharge && this.props.checkoutItems.length
        ? this.props.shippingCharge
        : 0;
    return (
      <div className="order-shipping">
        <EditAddressModal
          title="Quick View Product"
          visible={this.state.showEditAddressModal}
          onCancel={this.handleCancel}
          data={userData}
        />
        <div className={"shipping-details " + this.props.showShippingAddress}>
          <div className="os-title">Shipping & Billing</div>
          <div className="ti-pr">
            <div className="ti">
              <div className="name-add">
                <EnvironmentOutlined />
                <div className="name">
                  <div>{userData?.name}</div>
                  <div className="address">
                    {activeLocation?.area}
                    {activeLocation?.area ? "," : ""} {activeLocation?.address}
                    {activeLocation?.address ? "," : ""} <br />
                    {activeLocation?.city}
                    {activeLocation?.city ? "," : ""} {activeLocation?.region}
                  </div>
                </div>
              </div>
            </div>
            <div
              className="pr edit"
              onClick={() => this.setState({ showEditAddressModal: true })}
            >
              EDIT
            </div>
          </div>
          <div className="ti-pr">
            <div className="ti">
              {activeLocation?.phoneno && (
                <div className="name-add">
                  <PhoneOutlined />
                  <div className="name">{activeLocation?.phoneno}</div>
                </div>
              )}
            </div>
            {/* <div className="pr edit">EDIT</div> */}
          </div>
          <div className="ti-pr">
            <div className="ti">
              <div className="name-add">
                <MailOutlined />
                <div className="name">{userData?.email}</div>
              </div>
            </div>
            {/* <div className="pr edit">EDIT</div> */}
          </div>
        </div>
        <div className="order-summary">
          <div className="os-title">Order Summary</div>
          <div className="price-details">
            <div className="price-title">PRICE DETAILS</div>
            <div className="price-cover">
              <div className="ti-pr">
                <div className="ti">Cart Total</div>
                <div className="pr">vnđ {totalCheckoutItems.toFixed(2)}</div>
              </div>
              {/* <div className="ti-pr">
                <div className="ti">Cart Discount</div>
                <div className="pr">- 0</div>
              </div> */}
              {/* <div className="ti-pr">
                <div className="ti">Tax</div>
                <div className="pr">$4</div>
              </div> */}
              <div className="ti-pr">
                <div className="ti">Delivery Charges</div>
                <div className="pr">vnđ {deliveryCharges}</div>
              </div>
            </div>
            {/* <div className="cupon-voucher">
              <Input placeholder="Enter Voucher Code" />
              <Button className="btn">APPLY</Button>
            </div> */}
            <div className="total-price">
              <div className="ti-pr">
                <div className="ti">Total</div>
                <div className="pr">
                  vnđ {(totalCheckoutItems + deliveryCharges).toFixed(2)}
                </div>
              </div>
            </div>

            {this.props.orderTxt === "PLACE ORDER" ? (
              <div className="order-procced">
                <PayPalScriptProvider
                  options={{
                    "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
                    currency: "USD",
                    intent: "capture",
                  }}
                >
                  <div className="space-y-2">
                    <PayPalButtons
                      style={{
                        color: "gold",
                        shape: "rect",
                        label: "pay",
                        height: 50,
                      }}
                      onClick={this.placeOrderItems}
                    />
                    <div className="text-center">
                      <button className="w-full bg-black text-white py-3 rounded-md flex items-center justify-center">
                        <span>Debit or Credit Card</span>
                      </button>
                    </div>
                  </div>
                </PayPalScriptProvider>
              </div>
            ) : (
              <div
                className="order-procced"
                onClick={() =>
                  this.props.saveCheckoutItems({
                    carts: this.props.checkoutItems,
                    totalCount: this.props.checkoutItems.length,
                    totalAmount: totalCheckoutItems,
                  })
                }
              >
                <Link href="/checkout">
                  <a>
                    <Button
                      className={"btn " + this.props.diableOrderBtn}
                      disabled={
                        this.props.diableOrderBtn === "disableBtn" ||
                        isEmpty(this.props.userResp?.location)
                          ? true
                          : false
                      }
                    >
                      {this.props.orderTxt}
                    </Button>
                  </a>
                </Link>

                {isEmpty(this.props.userResp?.location) && ( // Hiển thị thông báo khi chưa có địa chỉ
                  <div className="checkout-note">
                    Note: Please add address in your profile before proceeding
                    further.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStatesToProps = (state) => ({
  shippingCharge: state.order.getShippingChargeResp,
  orderResp: state.order.placeOrderResp,
  userResp: state.user.userProfile,
});

const mapDispatchToProps = (dispatch) => ({
  saveCheckoutItems: (checkoutItems) => {
    dispatch({ type: STORE_CHECKOUT_ITEMS, payload: checkoutItems });
  },
  placeOrder: (body) => {
    dispatch(actions.placeOrder(body));
  },
});

export default connect(
  mapStatesToProps,
  mapDispatchToProps
)(withRouter(OrderSummary));
