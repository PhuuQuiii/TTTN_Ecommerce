import { DeleteOutlined, LoadingOutlined } from "@ant-design/icons";
import { Button, Input, Popconfirm, Spin } from "antd";
import _ from 'lodash';
import Link from "next/link";
import { withRouter } from "next/router";
import React, { Component } from "react";
import { connect } from "react-redux";
import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton } from 'react-share';
import StarRatings from "react-star-ratings";
import actions from "../../../redux/actions";
import { STORE_CHECKOUT_ITEMS } from "../../../redux/types";
import AllHelmet from "../../Components/AllHelmet";

class ProductSpecs extends Component {
  state = {
    pdQty: 1,
    showStatus: "More",
    disableBuyNow: false
  };

  componentDidUpdate(prevProps) {
    if (
      this.props.cart.addToCartResp !== prevProps.cart.addToCartResp &&
      this.props.cart.addToCartResp
    ) {
      this.props.getProductDetails(this.props.router.query.slug);
    }

    if (
      this.props.wishlist.wishlistItemsResp !==
      prevProps.wishlist.wishlistItemsResp &&
      this.props.wishlist.wishlistItemsResp
    ) {
      this.props.getProductDetails(this.props.router.query.slug);
    }

    if (
      this.props.wishlist.removeFromWishlistResp !==
      prevProps.wishlist.removeFromWishlistResp &&
      this.props.wishlist.removeFromWishlistResp
    ) {
      this.props.getProductDetails(this.props.router.query.slug);
    }

    if (
      this.props.cart.removeFromCartResp !==
      prevProps.cart.removeFromCartResp &&
      this.props.cart.removeFromCartResp
    ) {
      this.props.getProductDetails(this.props.router.query.slug);
    }
  }

  changePdValue = (num) => {
    let newPdQty = parseInt(this.state.pdQty) + num;
    if (newPdQty >= 1) {
      this.setState({
        pdQty: newPdQty,
      });
    }
  };

  changeViewStatus = () => {
    if (this.state.showStatus === "More") {
      this.setState({
        showStatus: "Less",
      });
    } else {
      this.setState({
        showStatus: "More",
      });
    }
  };

  addToCart = (slug) => {
    this.props.addToCart(slug, {
      quantity: this.state.pdQty,
    });
  };

  render() {
    let {
      data: { product },
    } = this.props;

    let description = "";
    let allDescription = "";
    if (product?.description) {
      allDescription = product.description.split(" ");
      if (this.state.showStatus === "More" && allDescription.length > 100) {
        let newRemarks = [...allDescription];
        description = newRemarks.splice(0, 95).join(" ") + "...";
      } else {
        description = product.description;
      }
    }
    let loginToken = this.props.authentication.token;
    const antIcon = <LoadingOutlined style={{ fontSize: 18, marginRight: 10 }} spin />
    const originalPrice = parseFloat(product.price?.$numberDecimal) || 0;

    let checkSkeleton = product.name === '' ? 'product-detail-skeleton' : ''
    return (
      <>
        {
          !_.isEmpty(product) &&
          <AllHelmet
            title={`${product.name} | QUINDIGO`}
            desc={`${description}`}
            url={`http://sthautsav.com.np/products/${product.slug}`}
            img={`http://sthautsav.com.np:3001/uploads/${product.images[0].large}`} />
        }
        
        <div id="magnifyPortal" className="magnifyPortal" />
        <div className={"product-specs " + checkSkeleton}>
          <div className="price-specs">
            <div className="product-title">{product.name}</div>
            <div className="ratings-reviews">
              <div className="ratings">
                {product.averageRating?.$numberDecimal && (
                  <StarRatings
                    rating={parseFloat(product.averageRating.$numberDecimal)}
                    starDimension="18px"
                    starSpacing="1px"
                    starRatedColor="#f2c900"
                    starEmptyColor="#eee"
                  />
                )}
                {
                  !checkSkeleton &&
                  <span>
                    {" "}{product.averageRating?.$numberDecimal
                      ? parseFloat(product.averageRating.$numberDecimal).toFixed(1)
                      : "No"}{" "}
                    stars ratings
                </span>
                }
              </div>
              <div className="reviews">
                {
                  !checkSkeleton && (
                    <span>
                      {product.totalRatingUsers} customer reviews | {this.props.products.productQA?.totalCount} FAQ answered
                    </span>
                  )
                }
              </div>
            </div>
            {
              !checkSkeleton ? (
                    <div className="price-wish">
                    <div className="old-new-price">
                      {this.props.flashSaleInfo ? (
                        <>
                          <div className="old-price">
                            <span style={{ textDecoration: 'line-through' }}>
                              {originalPrice.toLocaleString()} vnđ
                            </span>
                          </div>
                          <div className="new-price">
                            <span className="price" style={{ color: 'red', fontSize: '24px' }}>
                              {parseFloat(this.props.flashSaleInfo.discountedPrice).toLocaleString()} vnđ
                            </span>
                          </div>
                        </>
                      ) : product?.discountRate > 0 ? (
                        <>
                          <div className="old-price">
                            <span>
                              {originalPrice.toLocaleString()} vnđ
                            </span>
                          </div>
                          <div className="new-price">
                            <span className="price">
                              {(originalPrice - (originalPrice * product.discountRate / 100)).toLocaleString()} vnđ
                            </span>
                            <span className="discount">
                              (SAVE { (originalPrice * product.discountRate / 100).toLocaleString() } | {product.discountRate} %)
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="new-price">
                          <span className="price">
                            {originalPrice.toLocaleString()} vnđ
                          </span>
                        </div>
                        )
                    }
                  </div>
                  <div className="wish-btn">
                    {loginToken ? (
                      !_.isEmpty(product.hasOnWishlist) ? (
                        <Popconfirm
                          title="Are you sure you want to remove this from wishlist?"
                          onConfirm={() =>
                            this.props.removeFromWishList(
                              product.hasOnWishlist._id
                            )
                          }
                          // onCancel={cancel}
                          okText="Yes"
                          cancelText="No"
                        >
                          <a>
                            <img
                              data-tip="Add to Wishlist"
                              src="/images/heart-blue.png"
                            />
                          </a>
                        </Popconfirm>
                      ) : (
                          <img
                            data-tip="Add to Wishlist"
                            src="/images/heart.png"
                            onClick={() => this.props.addWishListItems(product.slug)}
                          />
                        )
                    ) : (
                        <Link href={`/login?origin=${this.props.router.asPath}`}>
                          <a>
                            <img data-tip="Add to Wishlist" src="/images/heart.png" />
                          </a>
                        </Link>
                      )}
                  </div>
                </div>
              ) : <div className="price-wish"></div>
            }
          </div>
          <div className="specs">
            {
              !checkSkeleton ?
                <div className="spec-details" dangerouslySetInnerHTML={{ __html: product.highlights }}>
                </div> : (
                  <>
                    <div className="details1"></div>
                    <div className="details2"></div>
                    <div className="details3"></div>
                    <div className="details4"></div>
                  </>
                )
            }
          </div>
          <div className="qty-cart-btn">
            <div className="qty-cart">
              {product.quantity ? (
                loginToken ? (
                  !product.hasOnCart ? (
                    <>
                      <div className="qty">
                        <span className="qty-title">Qty:</span>
                        <span className="qty-inc-dcs">
                          <i
                            aria-hidden="true"
                            onClick={() => this.changePdValue(-1)}
                            className={
                              "fa fa-minus " +
                              (this.state.pdQty === 1 ? "disabled" : "")
                            }
                          />
                          <Input
                            defaultValue={this.state.pdQty}
                            value={this.state.pdQty}
                            onChange={(e) => {
                              this.setState({ pdQty: e.target.value });
                            }}
                          />
                          <i
                            className="fa fa-plus"
                            aria-hidden="true"
                            onClick={() => this.changePdValue(1)}
                          />
                        </span>
                      </div>

                      <Button disabled={this.props.cart.loading || this.state.disableBuyNow || this.props.products.productDetailsLoading} className="primary" onClick={() => this.addToCart(product.slug)}>
                        {this.props.cart.loading && <Spin indicator={antIcon} />} Add to Cart
                    </Button>
                      <Link href="/checkout">
                        <Button
                          className="buy-now secondary"
                          disabled={this.props.cart.loading || this.state.disableBuyNow || this.props.products.productDetailsLoading}
                          onClick={() => {
                            this.props.saveCheckoutItems({
                              carts: [{ product }],
                              totalCount: 1,
                              totalAmount: ((product?.price.$numberDecimal -
                                ((product?.price.$numberDecimal *
                                  product?.discountRate) /
                                  100)) * this.state.pdQty),
                              removeAddQty: true,
                              totalQty: this.state.pdQty
                            });
                            this.setState({
                              disableBuyNow: true
                            })
                          }
                          }>Buy Now</Button>
                      </Link>
                    </>
                  ) : (
                      <div className="delete-product">
                        <Popconfirm
                          title="Are you sure you want to remove this from cart?"
                          onConfirm={() =>
                            this.props.removeCart(product.hasOnCart._id)
                          }
                          // onCancel={cancel}
                          okText="Yes"
                          cancelText="No"
                        >
                          <a>
                            <Button className="btn" disabled={this.props.cart.loading} >
                              <DeleteOutlined />
                              <span className="txt">{this.props.cart.loading && <Spin indicator={antIcon} />} REMOVE FROM CART</span>
                            </Button>
                          </a>
                        </Popconfirm>
                      </div>
                    )
                ) : (
                    <Link href={`/login?origin=${this.props.router.asPath}`}>
                      <a className="qty-btn">
                        <div className="qty">
                          <span className="qty-title">Qty:</span>
                          <span className="qty-inc-dcs">
                            <i
                              aria-hidden="true"
                              // onClick={() => this.changePdValue(-1)}
                              className={
                                "fa fa-minus " +
                                (this.state.pdQty === 1 ? "disabled" : "")
                              }
                            />
                            <Input
                              defaultValue={this.state.pdQty}
                              value={this.state.pdQty}
                              onChange={(e) => {
                                this.setState({ pdQty: e.target.value });
                              }}
                            />
                            <i
                              className="fa fa-plus"
                              aria-hidden="true"
                            // onClick={() => this.changePdValue(1)}
                            />
                          </span>
                        </div>

                        <Button className="primary">Add to Cart</Button>
                        <Button className="buy-now secondary">Buy Now</Button>
                      </a>
                    </Link>
                  )
              ) : !checkSkeleton ? <b>No Stocks Available</b> : ''}
            </div>
            {/* <div className="wish-comp-btn">
            <div className="comp-btn">
              <img data-tip="Add to Compare" src="/images/sliders.png" />
              <span>Add to Compare</span>
            </div>
          </div> */}
          </div>
          <div className="prod-cate-specs">
            {
              product.tags.length > 0 &&
              <div className="tags">
                {!checkSkeleton && <b>Tags:</b>}{" "}
                {product.tags.map((tag, i) => {
                  return (
                    <span key={i}>
                      {tag}
                      {product.tags.length !== i + 1 && ","}
                    </span>
                  );
                })}
              </div>
            }
            {
              !checkSkeleton ? (
                <div className="share">
                  <b>Share this product:</b>
                  <span>
                    <FacebookShareButton
                      // url={`http://157.245.106.101:3000/products/${product.slug}`}
                      url={`https://duco9t.pro.vn/`}
                      quote={"Quindigo - explore the mall"}
                      hashtag="#Quindigo" >
                      <FacebookIcon size={32} round={true} />
                    </FacebookShareButton>
                    <TwitterShareButton
                      // url={`http://sthautsav.com.np/products/${product.slug}`}
                      url={`https://duco9t.pro.vn/`}
                      quote={"Quindigo - explore the mall"}
                      hashtag="#Quindigo"
                    >
                      <TwitterIcon size={32} round={true} />
                    </TwitterShareButton>
                  </span>
                </div>
              ): <div className="share"></div>
            }
          </div>
        </div>

      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  // saveCartItems: (cartItems) => {
  //   console.log(cartItems)
  //   dispatch({ type: STORE_CART_ITEMS, payload: cartItems });
  // },
  saveCheckoutItems: (checkoutItems) => {
    dispatch({ type: STORE_CHECKOUT_ITEMS, payload: checkoutItems });
  },
  placeOrder: (body) => {
    dispatch(actions.placeOrder(body))
  },
  addToCart: (slug, body) => {
    dispatch(actions.addToCart(slug, body))
  },
  getProductDetails: (slug) => {
    dispatch(actions.getProductDetails(slug))
  },
  removeCart: (id) => {
    dispatch(actions.removeCart(id))
  },
  removeFromWishList: (id) => {
    dispatch(actions.removeFromWishList(id))
  },
  addWishListItems: (id) => {
    dispatch(actions.addWishListItems(id))
  },
});
export default connect((state) => state, mapDispatchToProps)(withRouter(ProductSpecs));
