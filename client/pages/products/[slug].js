import React, { useEffect, useState } from "react";
import { Row, Col, Breadcrumb } from "antd";
import DetailSlider from "../../src/Includes/Details/DetailSlider";
import ProductSpecs from "../../src/Includes/Details/ProductSpecs";
import OtherDetails from "../../src/Includes/Details/OtherDetails";
import Layout from "../../src/Components/Layout";
import initialize from "../../utils/initialize";
import { withRouter } from "next/router";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { previousQuery } from "../../utils/common";
import { productDetailSkeleton } from "../../utils/skeletons";
import { isEmpty } from "lodash";
import actions from "../../redux/actions/productActions";
import { getActiveSales } from "../../redux/actions/saleActions";

const Details = (props) => {
  const dispatch = useDispatch();
  const productState = useSelector((state) => state.products.productDetails);
  const flashSales = useSelector((state) => state.sale.activeSales);
  let [productDetails, setProductDetails] = useState({ product: productDetailSkeleton });
  let { query } = props.router;
  let prevQuery = previousQuery(query.slug);

  useEffect(() => {
    if (!props.isServer && prevQuery !== query.slug) {
      dispatch(actions.getProductDetails(query.slug));
    }
  }, [query.slug]);

  useEffect(() => {
    if (!isEmpty(productState.product)) {
      setProductDetails(productState);
    }
  }, [productState.product]);

  useEffect(() => {
    dispatch(actions.getQandA(query.slug + "?page=1"));
    dispatch(actions.getProductReviews(query.slug + "?page=1&perPage=10"));
  }, []);

  // NEW: Nếu flashSales chưa có, gọi action getActiveSales để lấy dữ liệu
  useEffect(() => {
    if (!flashSales || flashSales.length === 0) {
      dispatch(getActiveSales());
    }
  }, [flashSales, dispatch]);

  // Determine if product is on flash sale and compute discounted price
  const product = productDetails?.product;
  let flashSaleInfo = null;
  if (flashSales && product) {
    flashSales.forEach((sale) => {
      // Assumes product slug can be used to check membership
      const saleProduct = sale.products.find((p) => p.slug === product.slug);
      if (saleProduct) {
        const discountRate = sale.discountRate || 20;
        const originalPrice = parseFloat(product.price?.$numberDecimal) || 999000;
        flashSaleInfo = {
          discountRate,
          discountedPrice: originalPrice * (1 - discountRate / 100)
        };
      }
    });
  }

  return (
    <Layout title={product?.name}>
      <div className="wrapper">
        <section className="detail">
          <div className="container">
            <Row className="breadcrumb-all">
              <Col lg={24}>
                {product?.name && (
                  <Breadcrumb>
                    <Breadcrumb.Item>
                      <Link href="/"><a>Home</a></Link>
                    </Breadcrumb.Item>
                    {product.category[0]?.parent && (
                      <Breadcrumb.Item>
                        <Link href={`/category/${product.category[0].parent.slug}/${product.category[0].parent._id}`}>
                          <a>{product.category[0].parent.displayName}</a>
                        </Link>
                      </Breadcrumb.Item>
                    )}
                    {product.category[0]?.parent && (
                      <Breadcrumb.Item>
                        <a>{product.category[0].displayName}</a>
                      </Breadcrumb.Item>
                    )}
                  </Breadcrumb>
                )}
              </Col>
            </Row>
            {product && (
              <Row>
                <Col lg={10} xs={24} md={24}>
                  <DetailSlider data={product} />
                </Col>
                <Col lg={14} xs={24} md={18}>
                  <ProductSpecs data={productDetails} flashSaleInfo={flashSaleInfo} />
                </Col>
              </Row>
            )}
            {product?.name && (
              <Row>
                <Col lg={24}>
                  <OtherDetails data={productDetails} />
                </Col>
              </Row>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};

Details.getInitialProps = async (ctx) => {
  initialize(ctx);
  if (ctx.isServer) {
    await ctx.store.dispatch(actions.getProductDetails(ctx.query.slug, ctx));
  }
  return {
    isServer: ctx.isServer
  };
};

export default withRouter(Details);
