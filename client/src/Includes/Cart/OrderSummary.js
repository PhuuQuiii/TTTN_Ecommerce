import {
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { Button } from "antd";
import { isEmpty } from "lodash";
import Link from "next/link";
import { withRouter } from "next/router";
import React, { Component } from "react";
import { connect } from "react-redux";
import actions from "../../../redux/actions";
import { STORE_CHECKOUT_ITEMS } from "../../../redux/types";
import { getDiscountedPrice } from "../../../utils/common";
import { postTokenService } from "../../../utils/commonService";
import EditAddressModal from "../../Components/EditAddressModal";

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

  handleCancel = () => {
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

  // Gửi đơn hàng lên server
  placeOrderItems = async () => {
    let { checkoutItems, userData } = this.props;

    let products = checkoutItems.carts.map((item) => {
      return {
        p_slug: item.product.slug,
        quantity: checkoutItems.totalQty || item.quantity,
      };
    });

    // Lấy địa chỉ active
    let activeAddress = {};
    userData.location.map((loc) => {
      if (loc.isActive) {
        activeAddress = loc;
      }
    });

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
      method: "PayPal",
    };

    this.setState({ loading: true }, async () => {
      await this.props.placeOrder(body);
    });
  };

  // Tạo order trên PayPal
  createOrder = async () => {
    let { checkoutItems } = this.props;
    const flashSales = this.props.sale?.activeSales || [];

    // Tính tổng tiền (giá flash sale nếu có)
    let totalCheckoutItems = 0;
    if (!checkoutItems?.totalAmount) {
      checkoutItems?.map((item) => {
        const sale = flashSales.find((fs) =>
          fs.products.some((p) => String(p._id) === String(item.product._id))
        );

        let discountedPrice;
        if (sale) {
          // Nếu sản phẩm có flash sale
          const discountRate = sale.discountRate || 20;
          const originalPrice =
            parseFloat(item.product?.price?.$numberDecimal) || 999000;
          discountedPrice = originalPrice * (1 - discountRate / 100);
        } else {
          // Giá gốc hoặc giảm discountRate bình thường
          discountedPrice = getDiscountedPrice(
            item.product.price.$numberDecimal,
            item.product.discountRate
          );
        }
        totalCheckoutItems += item.quantity * discountedPrice;
      });
    } else {
      // Nếu đã có totalAmount => dùng luôn
      totalCheckoutItems = checkoutItems.totalAmount;
    }

    let deliveryCharges =
      this.props.showShippingAddress === "showDisplay"
        ? this.props.shippingCharge
        : this.props.shippingCharge && checkoutItems.length
        ? this.props.shippingCharge
        : 0;

    let totalAmount = (totalCheckoutItems + deliveryCharges).toFixed(2);
    console.log("Total Amount in OrderSummary.js:", totalAmount);

    // Gọi API server /create-order PayPal
    try {
      const response = await postTokenService(
        "http://localhost:3001/api/paypal/create-order",
        "POST",
        { amount: totalAmount }
      );
      if (response.isSuccess) {
        return response.data.orderID;
      } else {
        throw new Error(response.errorMessage);
      }
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      return null;
    }
  };

  // Khi người dùng xác nhận trên PayPal
  captureOrder = async (orderID) => {
    try {
      const response = await postTokenService(
        "http://localhost:3001/api/paypal/capture-order",
        "POST",
        { orderID }
      );
      if (response.isSuccess) {
        console.log("Order captured:", response.data);
        await this.placeOrderItems();
        return true;
      } else {
        throw new Error(response.errorMessage);
      }
    } catch (error) {
      console.error("Error capturing PayPal order:", error);
      return false;
    }
  };

  render() {
    let { activeLocation, userData } = this.state;
    const flashSales = this.props.sale?.activeSales || [];

    // ===========================
    //  TÍNH GIÁ HIỂN THỊ TẠI UI
    // ===========================
    let totalCheckoutItems = 0;
    if (!this.props.checkoutItems?.totalAmount) {
      // Tự tính nếu chưa có totalAmount
      this.props.checkoutItems?.map((item) => {
        // Check flash sale
        const sale = flashSales.find((fs) =>
          fs.products.some((p) => String(p._id) === String(item.product._id))
        );

        let discountedPrice;
        if (sale) {
          const discountRate = sale.discountRate || 20;
          const originalPrice =
            parseFloat(item.product?.price?.$numberDecimal) || 999000;
          discountedPrice = originalPrice * (1 - discountRate / 100);
        } else {
          discountedPrice = getDiscountedPrice(
            item.product.price.$numberDecimal,
            item.product.discountRate
          );
        }

        totalCheckoutItems += item.quantity * discountedPrice;
      });
    } else {
      // Có sẵn totalAmount => dùng luôn
      totalCheckoutItems = this.props.checkoutItems.totalAmount;
    }

    let deliveryCharges =
      this.props.showShippingAddress === "showDisplay"
        ? this.props.shippingCharge
        : this.props.shippingCharge && this.props.checkoutItems.length
        ? this.props.shippingCharge
        : 0;

    let totalAmount = (totalCheckoutItems + deliveryCharges).toFixed(2);

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
          </div>
          <div className="ti-pr">
            <div className="ti">
              <div className="name-add">
                <MailOutlined />
                <div className="name">{userData?.email}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="order-summary">
          <div className="os-title">Order Summary</div>
          <div className="price-details">
            <div className="price-title">PRICE DETAILS</div>
            <div className="price-cover">
              <div className="ti-pr">
                <div className="ti">Cart Total</div>
                <div className="pr">$ {totalCheckoutItems.toFixed(2)}</div>
              </div>
              <div className="ti-pr">
                <div className="ti">Delivery Charges</div>
                <div className="pr">$ {deliveryCharges}</div>
              </div>
            </div>
            <div className="total-price">
              <div className="ti-pr">
                <div className="ti">Total</div>
                <div className="pr">
                  $ {totalAmount}
                </div>
              </div>
            </div>

            {/* Nếu là PLACE ORDER thì hiển thị PayPal */}
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
                      createOrder={this.createOrder}
                      onApprove={async (data) => {
                        const result = await this.captureOrder(data.orderID);
                        return result;
                      }}
                    />
                    {/* <div className="text-center">
                      <button className="w-full bg-black text-white py-3 rounded-md flex items-center justify-center">
                        <span>Debit or Credit Card</span>
                      </button>
                    </div> */}
                    <div className="text-center mt-4">
                      <button className="w-full bg-black text-white py-3 rounded-md flex items-center justify-center">
                        <span>Place Order</span>
                      </button>
                    </div>
                  </div>
                </PayPalScriptProvider>
              </div>
            ) : (
              // Nếu chưa PLACE ORDER => chỉ hiển thị nút normal
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

                {isEmpty(this.props.userResp?.location) && (
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
  sale: state.sale, // Lấy flash sale từ Redux
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
