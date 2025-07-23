import { DeleteOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, Input, Popconfirm, Row } from "antd";
import { isEmpty } from "lodash";
import Link from "next/link";
import React, { Component } from "react";
import { connect } from "react-redux";
import actions from "../../redux/actions";
import { openNotification } from "../../utils/common";
import { IMAGE_BASE_URL } from "../../utils/constants";
import { myCartsSkeleton } from "../../utils/skeletons";
import { getActiveSales } from "../../redux/actions/saleActions";

class ProductListView extends Component {
  state = {
    pdQty: 1,
    listItems: [],
    checkoutItems: [],
    noStockProducts: [],
    productsData: myCartsSkeleton,  // skeleton mặc định
    showQtySection: "",
  };

  componentDidMount() {
    // Gọi API lấy flashSales
    this.props.getActiveSales();

    console.log("Sale from Redux: ", this.props.sale?.activeSales);

    // Gộp hết logic setState (qty, noStock, v.v.) vào một object newState
    const newState = {
      // Bắt đầu cứ lấy từ props, lát nữa ta sẽ gán flashSaleInfo (nếu sale đã có)
      productsData: this.props.productsData || myCartsSkeleton,
      showQtySection: this.props.showQtySection || "",
    };

    // Setup các key ["pdQtyInStock"+i] cho những sản phẩm đủ stock
    this.props.productsData?.carts?.forEach((item, i) => {
      newState["pdQtyInStock" + i] = item.quantity;
    });

    // Setup các key ["pdQtyNoStock"+i] cho những sản phẩm hết stock
    this.props.noStockProducts?.carts?.forEach((item, i) => {
      newState["pdQtyNoStock" + i] = item.quantity;
    });

    // Set state lần duy nhất
    this.setState(newState);

    // Nếu trang không hiển thị checkbox => gọi getShippingCharge
    if (this.props.showCheckbox === "noCheckbox") {
      const p_slugs =
        this.props.cart.checkoutItems?.carts.map((newItems) => {
          return newItems.product.slug;
        }) || [];
      this.props.getShippingCharge({ p_slugs });
    }
  }

  componentDidUpdate(prevProps) {
    // 1. Nếu sale.activeSales thay đổi => re-run flash sale logic
    if (
      this.props.sale?.activeSales !== prevProps.sale?.activeSales &&
      this.props.sale?.activeSales
    ) {
      this.updateCartsWithFlashSale();
    }

    // 2. Nếu productsData thay đổi => cập nhật state (và gán flashSaleInfo nếu cần)
    if (
      this.props.productsData !== prevProps.productsData &&
      this.props.productsData?.carts
    ) {
      // Tạo object newState (thay vì gọi setState nhiều lần)
      const newState = {
        productsData: this.props.productsData,
        showQtySection: this.props.showQtySection,
      };

      this.props.productsData?.carts?.forEach((item, i) => {
        newState["pdQtyInStock" + i] = item.quantity;
      });

      this.setState(newState, () => {
        // Sau khi setState xong, ta vẫn nên cập nhật flashSaleInfo (nếu sale đã có)
        this.updateCartsWithFlashSale();
      });
    }

    // 3. Nếu removeCartResp thay đổi => refresh cart
    if (
      this.props.cart.removeFromCartResp !==
        prevProps.cart.removeFromCartResp &&
      this.props.cart.removeFromCartResp
    ) {
      this.props.getCartProducts("page=1");
    }
  }

  // Hàm chuyên để gán flashSaleInfo vào productsData
  updateCartsWithFlashSale = () => {
    const flashSales = this.props.sale?.activeSales || [];
    console.log("flashSales:", flashSales);

    const { productsData } = this.state;
    const currentCarts = productsData?.carts || [];

    // Map lại carts để gán flashSaleInfo
    const updatedCarts = currentCarts.map((item) => {
      const sale = flashSales.find((fs) =>
        fs.products.some((p) => String(p._id) === String(item.product._id))
      );
            
      if (sale) {
        const discountRate = sale.discountRate || 20;
        const originalPrice =
          parseFloat(item.product?.price?.$numberDecimal) || 999000;
        const discountedPrice = originalPrice * (1 - discountRate / 100);

        item.flashSaleInfo = {
          discountRate,
          discountedPrice,
        };
      } else {
        // Không có flash sale => xóa flashSaleInfo nếu có
        delete item.flashSaleInfo;
      }
      return item;
    });

    // Cập nhật state
    this.setState({
      productsData: {
        ...productsData,
        carts: updatedCarts,
      },
    });
  };

  // Giảm/Tăng qty (nút +/-)
  changePdValue = (num, i, cartId) => {
    let newPdQty = parseInt(this.state["pdQtyInStock" + i]) + num;
    if (newPdQty < 1) return;

    // Cập nhật vào state
    this.setState({
      ["pdQtyInStock" + i]: newPdQty,
    });

    // Gọi API
    this.props.editCartQty(cartId + "?quantity=" + newPdQty);

    // Cập nhật checkoutItems
    let newCheckoutItems = this.state.checkoutItems.map((obj) => {
      if (obj._id === cartId) {
        return { ...obj, quantity: newPdQty };
      }
      return obj;
    });
    this.setState({
      checkoutItems: newCheckoutItems,
    });
    this.props.getCheckoutItems(newCheckoutItems);
  };

  // Thay đổi qty qua ô Input
  changeInputPdQty = (e, i, items) => {
    let newPdQty = e.target.value;
    let cartId = items._id;

    // Check max
    if (items.product.quantity <= newPdQty) {
      openNotification("Alert", "Maximum product quantity exceeded");
      newPdQty = items.product.quantity;
    }
    // Check min
    if (newPdQty <= 0 && newPdQty !== "") {
      openNotification("Alert", "Quantity cannot be zero");
      newPdQty = 1;
    }

    // Set state
    this.setState({
      ["pdQtyInStock" + i]: newPdQty,
    });

    // Gọi API
    this.props.editCartQty(cartId + "?quantity=" + newPdQty);

    // Cập nhật checkoutItems
    let newCheckoutItems = this.state.checkoutItems.map((obj) => {
      if (obj._id === cartId) {
        return { ...obj, quantity: newPdQty };
      }
      return obj;
    });

    this.setState({
      checkoutItems: newCheckoutItems,
    });
    this.props.getCheckoutItems(newCheckoutItems);
  };

  // OnCheck checkbox item
  onCheckItems = (item, i) => {
    let itemValue = { ...item, quantity: this.state["pdQtyInStock" + i] };
    let { checkoutItems } = this.state;

    let newCheckoutItems = [];
    if (checkoutItems.length > 0) {
      let existed = false;
      checkoutItems.forEach((itemCheck) => {
        if (itemValue.product._id !== itemCheck.product._id) {
          newCheckoutItems.push(itemCheck);
        } else {
          existed = true;
        }
      });
      if (!existed) {
        newCheckoutItems.push(itemValue);
      }
    } else {
      newCheckoutItems.push(itemValue);
    }

    this.setState({ checkoutItems: newCheckoutItems });

    // Tính shipping
    let p_slugs = newCheckoutItems.map((ci) => ci.product.slug);
    this.props.getShippingCharge({ p_slugs });

    // Gửi cho cha
    this.props.getCheckoutItems(newCheckoutItems);
  };

  render() {
    const checkSkeleton =
      this.state.productsData?.carts?.[0]?.product?.name === ""
        ? "list-view-skeleton"
        : "";

    return (
      <>
        {this.state.productsData?.carts?.map((items, i) => {
          const flashSaleInfo = items.flashSaleInfo;

          return (
            <div className={"product-list-view " + checkSkeleton} key={i}>
              <Row>
                {/* Checkbox */}
                <Col lg={2}>
                  <Checkbox
                    onChange={() => this.onCheckItems(items, i)}
                    className={
                      this.props.showCheckboxForOutOfStock ||
                      this.props.showCheckbox
                    }
                    disabled={isEmpty(this.props.user.userProfile?.location)}
                  ></Checkbox>
                </Col>

                {/* Ảnh sản phẩm */}
                <Col lg={6} xs={24} key={i}>
                  {!checkSkeleton ? (
                    <Link
                      href="/products/[slug]"
                      as={`/products/${items.product.slug}`}
                    >
                      <a>
                        <div className="pd-img">
                          <img
                            src={
                              IMAGE_BASE_URL +
                              "/" +
                              items.product?.images?.[0]?.medium
                            }
                            alt="helmet"
                          />
                          {this.props.showQtySection && (
                            <div className="not-available">
                              <span>NOT AVAILABLE</span>
                            </div>
                          )}
                        </div>
                      </a>
                    </Link>
                  ) : (
                    <div className="pd-img">
                      <img
                        src={items.product?.images?.[0]?.medium}
                        alt="helmet"
                      />
                      {this.props.showQtySection && (
                        <div className="not-available">
                          <span>NOT AVAILABLE</span>
                        </div>
                      )}
                    </div>
                  )}
                </Col>

                {/* Thông tin chi tiết */}
                <Col lg={16} xs={24}>
                  <div className="pd-details">
                    <div className="name-price">
                      <div className="name">
                        <Link
                          href="/products/[slug]"
                          as={`/products/${items.product.slug}`}
                        >
                          <a>
                            <div className="pd-name">
                              {items.product.name}
                            </div>
                          </a>
                        </Link>
                        <div className="sold-by">
                          {!checkSkeleton && "Sold By:"}{" "}
                          {items.product?.soldBy?.shopName}
                        </div>
                      </div>

                      {/* Giá sản phẩm */}
                      <div className="price">
                        {flashSaleInfo ? (
                          <div
                            className="flash-sale-price"
                            style={{ color: "red" }}
                          >
                            $ {flashSaleInfo.discountedPrice}
                          </div>
                        ) : items.product?.discountRate === 0 ? (
                          // Không có discount => hiển thị giá gốc
                          <div className="new-price">
                            {!checkSkeleton && "$"}{" "}
                            {items.product?.price?.$numberDecimal}
                          </div>
                        ) : (
                          // Có discount => hiển thị old price, new price
                          !checkSkeleton && (
                            <>
                              <div className="new-price">
                                <span className="old-price">
                                  {!checkSkeleton && "$"}{" "}
                                  {items.product?.price?.$numberDecimal}
                                </span>
                                {!checkSkeleton && "$"}{" "}
                                {(
                                  items.product?.price?.$numberDecimal -
                                  (items.product?.price?.$numberDecimal *
                                    items.product?.discountRate) /
                                    100
                                ).toFixed(2)}
                              </div>
                              <div className="price-disc">
                                <span className="disc">
                                  {items.product?.discountRate}% OFF
                                </span>
                              </div>
                            </>
                          )
                        )}
                      </div>
                    </div>

                    {/* Qty */}
                    <div className={"qty " + this.state.showQtySection}>
                      <span className="qty-title">
                        {!checkSkeleton && "Qty:"}
                      </span>

                      {this.props.showCheckbox === "noCheckbox" ? (
                        // Nếu ko show checkbox => hiển thị totalQty
                        this.state.productsData?.totalQty || items.quantity
                      ) : (
                        // Nếu có show checkbox => hiển thị nút +/- và input
                        !checkSkeleton && (
                          <span className="qty-inc-dcs">
                            <i
                              aria-hidden="true"
                              onClick={() => {
                                this.state["pdQtyInStock" + i] > 1 &&
                                  this.changePdValue(-1, i, items._id);
                              }}
                              className={
                                "fa fa-minus " +
                                (this.state["pdQtyInStock" + i] <= 1
                                  ? "disabled"
                                  : "")
                              }
                            />
                            <Input
                              type="number"
                              defaultValue={this.state.pdQty}
                              value={this.state["pdQtyInStock" + i]}
                              onChange={(e) =>
                                this.changeInputPdQty(e, i, items)
                              }
                            />
                            <i
                              className={
                                "fa fa-plus " +
                                (items.product.quantity <=
                                this.state["pdQtyInStock" + i]
                                  ? "disabled"
                                  : "")
                              }
                              aria-hidden="true"
                              onClick={() => {
                                items.product.quantity >
                                  this.state["pdQtyInStock" + i] &&
                                  this.changePdValue(1, i, items._id);
                              }}
                            />
                          </span>
                        )
                      )}
                    </div>

                    {/* Chỉ còn dưới 5 sp => hiển thị warning */}
                    {items.product.quantity <= 5 && !checkSkeleton ? (
                      !this.state.showQtySection && (
                        <div className="available-stock">
                          Only {items.product.quantity} items available on stock
                        </div>
                      )
                    ) : (
                      <div className="available-stock" />
                    )}

                    {/* Nút xóa */}
                    <div className="delete-product">
                      {!checkSkeleton && (
                        <Popconfirm
                          title="Are you sure you want to remove this from cart?"
                          onConfirm={() => this.props.removeCart(items._id)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <a>
                            <Button className="btn">
                              <DeleteOutlined />
                              <span className="txt">REMOVE FROM CART</span>
                            </Button>
                          </a>
                        </Popconfirm>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          );
        })}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  sale: state.sale,
  cart: state.cart,
  user: state.user,
});

const mapDispatchToProps = {
  ...actions,
  getActiveSales,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductListView);
