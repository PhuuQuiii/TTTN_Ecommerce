import { Col, Row } from "antd";
import { isEmpty } from "lodash";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import actions from "../redux/actions";
import MainCarousel from "../src/Components/Carousel";
import ProductCard from "../src/Components/Includes/ProductCard";
import Layout from "../src/Components/Layout";
import ProductSlider from "../src/Components/ProductSlider";
import SliderHeader from "../src/Components/SliderHeader";
import initialize from "../utils/initialize";

const Index = (props) => {
  let dispatch = useDispatch();
  let allProducts = useSelector((state) => state.products)
  let bannerImages = useSelector((state) => state.other.getBannerImages)
  let livestreams = [
    {
      id: 1,
      thumbnail: "/images/default-image.jpg",
      title: "New Summer Collection 2025",
      description: "Check out our latest summer fashion collection with exclusive deals!",
      viewerCount: 1234,
      streamer: {
        name: "Sarah Johnson",
        avatar: "/images/default-user.png",
        role: "Fashion Specialist"
      }
    },
    {
      id: 2,
      thumbnail: "/images/default-image.jpg",
      title: "Tech Gadgets Review",
      description: "Live review of the newest smartphones and gadgets with special discounts!",
      viewerCount: 856,
      streamer: {
        name: "Mike Chen",
        avatar: "/images/default-user.png",
        role: "Tech Expert"
      }
    },
    {
      id: 3,
      thumbnail: "/images/default-image.jpg",
      title: "Home Decor Ideas",
      description: "Interior design tips and exclusive home decoration items showcase",
      viewerCount: 567,
      streamer: {
        name: "Emily White",
        avatar: "/images/default-user.png",
        role: "Interior Designer"
      }
    }
  ];

  useEffect(() => {
    if (!props.isServer) {
      if (isEmpty(allProducts.latestProducts?.products)) {
        dispatch(actions.getMinedProducts('', 'latest'));
      }

      if (isEmpty(allProducts.trendingProducts?.products)) {
        dispatch(actions.getMinedProducts('', 'trending'));
      }

      if (isEmpty(allProducts.topSellingProducts?.products)) {
        dispatch(actions.getMinedProducts('', 'topselling'));
      }

      if (isEmpty(allProducts.mostViewedProducts?.products)) {
        dispatch(actions.getMinedProducts('', 'mostviewed'));
      }

      if (isEmpty(allProducts.featuredProducts?.products)) {
        dispatch(actions.getMinedProducts('', 'featured'));
      }
    }
    if (isEmpty(bannerImages)) {
      dispatch(actions.getBannerImages())
    }
  }, [])

  return (
    <Layout title="Home">
      <div className="wrapper">
        <Row>
          {/* <Col lg={6}>
            <ul className="top-categories">
              <li className="title">Top Categories</li>
              <li>Fashion</li>
              <li>Electronics</li>
              <li>Gifts</li>
              <li>Home & Garden</li>
              <li>Music</li>
              <li>Sports</li>
            </ul>
          </Col> */}
          <Col lg={24}>
            <div className="main-carousel">
              <MainCarousel data={bannerImages} />
            </div>
          </Col>
        </Row>
        <div className="container">
          {/* Livestream Section */}
          <section className="livestream-section">
            <div className="livestream-container">
              <div className="livestream-header">
                <h2>Live Shopping</h2>
                <a href="/livestream" className="view-all">View All</a>
              </div>
              <div className="livestream-grid">
                {livestreams.map((stream) => (
                  <div 
                  key={stream.id} 
                  className="livestream-card" 
                  onClick={() => window.location.href = "http://localhost:3002/livestream"}
                  style={{ cursor: "pointer" }} 
                >
                  <div className="livestream-thumbnail">
                    <img src={stream.thumbnail} alt={stream.title} />
                    <div className="live-badge">
                      <span className="live-dot"></span> LIVE
                    </div>
                    <div className="viewer-count">
                      <i className="fas fa-eye"></i>
                      <span>{stream.viewerCount}</span>
                    </div>
                  </div>
                  <div className="livestream-info">
                    <div className="streamer-info">
                      <div className="streamer-avatar">
                        <img src={stream.streamer.avatar} alt={stream.streamer.name} />
                      </div>
                      <div className="streamer-details">
                        <h3>{stream.streamer.name}</h3>
                        <p>{stream.streamer.role}</p>
                      </div>
                    </div>
                    <h4 className="stream-title">{stream.title}</h4>
                    <p className="stream-description">{stream.description}</p>
                  </div>
                </div>                
                ))}
              </div>
            </div>
          </section>

          {/* Featured Products Section */}
          {
            !isEmpty(allProducts.featuredProducts?.products) &&
            <>
            {console.log("Danh sách sản phẩm hiển thị:", allProducts.featuredProducts?.products)}
              <SliderHeader
                headTitle="Featured Products"
                headDetails="Quicksand is a sans serif type family of three weights plus matching obliques"
                  removePaddingTop="paddingTopZero"
                  listLink="featuredProducts"
                />
                <ProductSlider data={allProducts.featuredProducts} sliderName="featured" />
              </>
          }
          {/* <section className="latest-popular">
            <Row>
              <Col lg={12} xs={24} md={12}>
                <Popular data={allProducts.latestProducts} />
              </Col>
              <Col lg={12} xs={24} md={12}>
                <LatestSLider data={allProducts.latestProducts} />
              </Col>
            </Row>
          </section> */}
          {
            !isEmpty(allProducts.trendingProducts?.products) &&
            <>
              <SliderHeader
                headTitle="Trending Products"
                headDetails="Quicksand is a sans serif type family of three weights plus matching obliques"
                removePaddingTop="paddingTopZero"
                listLink="trendingProducts"
              />
              <ProductSlider data={allProducts.trendingProducts} sliderName="trending" />
            </>
          }
          {
            !isEmpty(allProducts.topSellingProducts?.products) &&
            <>
              <SliderHeader
                headTitle="Top Selling"
                headDetails="Quicksand is a sans serif type family of three weights plus matching obliques"
                removePaddingTop="paddingTopZero"
                listLink="topSellingProducts"
              />
              <ProductSlider data={allProducts.topSellingProducts} sliderName="topselling" />
            </>
          }
          {
            !isEmpty(allProducts.mostViewedProducts?.products) &&
            <>
              <SliderHeader
                headTitle="Most Viewed"
                headDetails="Quicksand is a sans serif type family of three weights plus matching obliques"
                removePaddingTop="paddingTopZero"
                listLink="mostViewedProducts"
              />
              <ProductSlider data={allProducts.mostViewedProducts} sliderName="mostViewed" />
            </>
          }
          {
            !isEmpty(allProducts.latestProducts?.products) &&
            <>
              <SliderHeader
                headTitle="Latest Products"
                headDetails="Quicksand is a sans serif type family of three weights plus matching obliques"
                removePaddingTop="paddingTopZero"
                listLink="latestProducts"
              />
              <div className="latest-products">

                <Row>
                  {
                    allProducts.latestProducts?.products?.map((product, index) => {
                      return (
                        <Col className="latest-cards" key={index} lg={6} sm={8}>
                          <ProductCard data={product} sliderName="latest" />
                        </Col>
                      )
                    })
                  }
                </Row>
              </div>
            </>
          }

        </div>
      </div>
    </Layout>
  );
};

Index.getInitialProps = async (ctx) => {
  initialize(ctx);

  if (ctx.isServer) {
    await ctx.store.dispatch(actions.getMinedProducts(ctx, 'latest'));
    await ctx.store.dispatch(actions.getMinedProducts(ctx, 'trending'));
    await ctx.store.dispatch(actions.getMinedProducts(ctx, 'topselling'));
    await ctx.store.dispatch(actions.getMinedProducts(ctx, 'mostviewed'));
    await ctx.store.dispatch(actions.getMinedProducts(ctx, 'featured'));
  }
  return {}
};

export default (Index);