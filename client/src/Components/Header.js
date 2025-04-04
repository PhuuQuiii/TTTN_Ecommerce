import { SearchOutlined } from '@ant-design/icons';
import { AutoComplete, Col, Row, message } from "antd";
import { debounce, isEmpty } from "lodash";
import Link from "next/link";
import Router, { withRouter } from "next/router";
import React, { Component } from "react";
import { connect } from "react-redux";
import actions from "../../redux/actions";
import { getUserInfo } from "../../utils/common";

class Header extends Component {
  state = {
    search: "",
    parentCate: [],
    loginToken: "",
    userInfo: {},
    searchOptions: [],
    searchValue: "",
    currentMenu: {},
    allCategories: [],
    currentChildCate: [],
    currentChildChildCate: [],
    handleDelay: '',
    loading: false
  };

  componentDidMount() {
    if (isEmpty(this.props.menu.menuCategories)) {
      this.props.productCategories();
    }
    let loginToken = this.props.authentication.token;
    let userInfo = getUserInfo(loginToken);

    let slug = this.props.router.asPath?.split("/")[1];

    if (slug === "search") {
      this.setState({
        searchValue: this.props.router.query.slug,
      });
    }

    this.setState({
      loginToken,
      userInfo,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.authentication.token !== nextProps.authentication.token) {
      let userInfo = [];
      if (nextProps.authentication.token) {
        userInfo = getUserInfo(this.state.loginToken);
      }
      this.setState({
        loginToken: nextProps.authentication.token,
        userInfo,
      });
    }
  }

  componentDidUpdate(prevProps) {
    let {
      listing: { getSearchKeywords },
    } = this.props;

    if (
      getSearchKeywords !== prevProps.listing.getSearchKeywords &&
      getSearchKeywords
    ) {
      let searchOpts = [];
      getSearchKeywords.map((opt) => {
        let ele = { value: opt };
        searchOpts.push(ele);
      });

      this.setState({
        searchOptions: searchOpts,
      });
    }
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const searchValue = this.state.searchValue.trim();
    if (searchValue) {
      this.setState({ loading: true });
      try {
        // Gọi action searchProducts từ Redux
        await this.props.searchProducts(searchValue);
        Router.push({
          pathname: '/search/[slug]',
          query: { slug: searchValue }
        }, `/search/${encodeURIComponent(searchValue)}`);
      } catch (error) {
        console.error('Search error:', error);
        message.error('Search failed. Please try again.');
      } finally {
        this.setState({ loading: false });
      }
    }
  };

  selectKeyword = (keyword) => {
    if (keyword) {
      this.setState({ searchValue: keyword });
      this.handleSubmit({ preventDefault: () => {} });
    }
  }

  searchSelectedProduct = debounce((keyword) => {
    if (keyword) {
      this.setState({ loading: true });
      this.props.searchProducts(keyword)
        .then(() => {
          Router.push({
            pathname: '/search/[slug]',
            query: { slug: keyword }
          }, `/search/${encodeURIComponent(keyword)}`);
        })
        .catch(error => {
          console.error('Search error:', error);
          message.error('Search failed. Please try again.');
        })
        .finally(() => {
          this.setState({ loading: false });
        });
    }
  }, 500)

  getSearchKeywordsDeb = (search) => {
    this.setState({ searchValue: search });
    if (search.trim()) {
      this.debouceSearchKeywords(search);
    }
  }

  debouceSearchKeywords = debounce((keyword) => {
    if (keyword.trim()) {
      this.props.getSearchKeywords(keyword);
    }
  }, 500)

  getCurrentChildCates = (cate) => {
    this.setState({ currentMenu: cate, currentChildCate: cate.childCate, currentChildChildCate: [] })
  }

  getCurrentChildChildCates = (cate) => {
    this.setState({ currentChildChildCate: cate.childCate, currentActiveChildId: cate._id })
  }

  searchProducts = (e, slug, id) => {
    e.preventDefault();
    Router.push({
      pathname: '/search/[slug]',
      query: { slug }
    }, `/search/${slug}`);
  }

  render() {
    let { loginToken, loading } = this.state;
    let parentCate = this.props.menu.menuCategories || []
    return (
      <React.Fragment>
        <div className="top-header">
          <div>
            Customer Care: +84983675437
          </div>
          <div>
            <ul>
              <li>Sell On Quindigo</li>
              <li className="about-top-head">About Us</li>
              <li className="profile-top-head">
                <Link href="/myprofile/manageAccount">
                  <a>
                    {loginToken ? "My Profile" : "Login"}
                  </a>
                </Link>
              </li>
              {!loginToken &&
                <li className="register-top-head">
                  <Link href="/register">
                    <a>
                      Register
                    </a>
                  </Link>
                </li>
              }
            </ul>
          </div>
        </div>
        <div className="middle-menu">
          <Row className="middle-menu-row">
            <Col lg={20} sm={20}>
              <Row className="menu-logo">
                <Col span={4} className="logo">
                  <Link href="/">
                    <a>
                      <img src="/images/logo.png" /> 
                    </a>
                  </Link>
                </Col>
                <Col span={20} className="search">
                  <form onSubmit={this.handleSubmit}>
                    <div className="search-cover">
                      <AutoComplete
                        value={this.state.searchValue}
                        options={this.state.searchOptions}
                        className="auto-search"
                        onSelect={(select) => {
                          this.selectKeyword(select)
                        }}
                        onSearch={(search) => {
                          this.getSearchKeywordsDeb(search)
                        }}
                        placeholder="Search for products, brands and more"
                        loading={loading}
                        notFoundContent={null}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      />
                      <div className="search-btn" onClick={() => this.selectKeyword(this.state.searchValue)}>
                        <SearchOutlined />
                      </div>
                    </div>
                  </form>
                </Col>
              </Row>
            </Col>
            <Col lg={4} sm={4} className="menu-right">
              <div className="menu-right-items">
                {
                  loginToken ? (
                    <Link href="/myprofile/myWishlist">
                      <a>
                        <div className="list-icon">
                          <img src="/images/heart.png" />
                        </div>
                        <div className="list-text">Wishlist</div>
                      </a>
                    </Link>
                  ) : (
                    <Link href={`/login?origin=${this.props.router.asPath}`}>
                      <a>
                        <div className="list-icon">
                          <img src="/images/heart.png" />
                        </div>
                        <div className="list-text">Wishlist</div>
                      </a>
                    </Link>
                  )
                }
              </div>
              <div className="menu-right-items">
                {
                  loginToken ? (
                    <Link href="/cart">
                      <a>
                        <div className="list-icon">
                          <img src="/images/bag.png" />
                        </div>
                        <div className="list-text">Cart</div>
                      </a>
                    </Link>
                  ) : <Link href={`/login?origin=${this.props.router.asPath}`}>
                    <a>
                      <div className="list-icon">
                        <img src="/images/bag.png" />
                      </div>
                      <div className="list-text">Cart</div>
                    </a>
                  </Link>
                }
              </div>
            </Col>
          </Row>
        </div>
        <div className="main-header">
          <div className="all-menu">
            <div className="sub-menu-header">
              <div className="parent-cate-cover">
                <div
                  className={"parent-cate "}
                >
                  Home
                </div>
                {
                  !isEmpty(parentCate) && parentCate.map((cate, i) => {
                    return (
                      <div
                        className={"parent-cate "}
                        key={i}
                        onMouseEnter={() => {
                          this.getCurrentChildCates(cate);
                          this.setState({
                            currentActiveChildId: ''
                          })
                        }}
                      >
                        {cate.displayName}
                      </div>
                    )
                  })
                }
              </div>
              {
                !isEmpty(this.state.currentChildCate) &&
                <div className="child-cates-cover">
                  <Row className="child-cates-row" style={{ background: '#fff' }}>
                    <Col
                      lg={7}
                      sm={7}
                      className={`${!isEmpty(this.state.currentChildChildCate) && 'child-cates-col'}`}
                    >
                      <div>
                        {
                          this.state.currentChildCate?.map((cate, i) => {
                            return (
                              <div
                                className={"child-cate " + (cate._id === this.state.currentActiveChildId ? 'active' : '')}
                                key={i}
                                onClick={(e) =>
                                  this.searchProducts(
                                    e,
                                    cate.slug,
                                    cate._id
                                  )
                                }
                              >
                                <span
                                  onMouseEnter={() => {
                                    this.getCurrentChildChildCates(cate);
                                  }}
                                >{cate.displayName}</span>
                              </div>
                            )
                          })
                        }
                      </div>
                    </Col>
                    <Col
                      lg={7}
                      sm={7}
                      className={`${!isEmpty(this.state.currentChildChildCate) && 'child-child-cates-col'}`}
                    >
                      <div>
                        {
                          this.state.currentChildChildCate?.map((cate, i) => {
                            return (
                              <div
                                className={"child-cate " + (cate._id === this.state.currentActiveChildChildId ? 'active' : '')}
                                onMouseLeave={() => this.setState({ currentActiveChildChildId: '' })}
                                onMouseEnter={() => this.setState({ currentActiveChildChildId: cate._id })}
                                key={i}
                                onClick={(e) =>
                                  this.searchProducts(
                                    e,
                                    cate.slug,
                                    cate._id
                                  )
                                }
                              >
                                <span>{cate.displayName}</span>
                              </div>
                            )
                          })
                        }
                      </div>
                    </Col>
                    <Col lg={10} sm={10} style={{ textAlign: 'right' }}>
                      <div><img src="/images/elect-imag.jpg" /></div>
                    </Col>
                  </Row>
                </div>
              }
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default connect((state) => state, actions)(withRouter(Header));
