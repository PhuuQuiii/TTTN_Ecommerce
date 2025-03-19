import { AutoComplete, Drawer, message } from "antd";
import { debounce } from "lodash";
import Router, { withRouter } from "next/router";
import React, { Component } from "react";
import { connect } from "react-redux";
import actions from "../../../redux/actions";

class SearchDrawer extends Component {
    state = {
        placement: "right",
        searchOptions: [],
        loading: false,
        inputValue: ""
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const searchValue = this.state.inputValue.trim();
        if (searchValue) {
            this.setState({ loading: true });
            try {
                // Gọi API tìm kiếm
                await this.props.getSearchProducts(searchValue);
                // Chuyển hướng và load lại trang
                Router.push({
                    pathname: '/search/[slug]',
                    query: { slug: searchValue }
                }, `/search/${encodeURIComponent(searchValue)}`);
                this.props.onCloseDrawer();
            } catch (error) {
                message.error('Search failed. Please try again.');
                this.setState({ loading: false });
            }
        }
    };

    componentDidUpdate(prevProps) {
        let {
            listing: { getSearchKeywords, getSearchProducts },
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

        // Handle search results
        if (getSearchProducts !== prevProps.listing.getSearchProducts) {
            this.setState({ loading: false });
            if (getSearchProducts && getSearchProducts.products && getSearchProducts.products.length > 0) {
                message.success('Found products');
            } else {
                message.info('No products found');
            }
        }
    }

    onChange = (e) => {
        this.setState({
            placement: e.target.value,
        });
    };

    selectKeyword = (keyword) => {
        if (keyword) {
            this.setState({ inputValue: keyword });
            this.handleSubmit({ preventDefault: () => {} });
        }
    }
  
    getSearchKeywordsDeb = (search) => {
        this.setState({ inputValue: search });
        if (search.trim()) {
            this.debouceSearchKeywords(search);
        }
    }
  
    debouceSearchKeywords = debounce((keyword) => {
        if (keyword.trim()) {
            this.props.getSearchKeywords(keyword);
        }
    }, 500)

    render() {
        const { placement, loading, inputValue } = this.state;
        let { parentCate } = this.props;

        return (
            <>
                <Drawer
                    title="Search"
                    placement={placement}
                    closable={false}
                    onClose={this.props.onCloseDrawer}
                    visible={this.props.showDrawer}
                    key={placement}
                    className="mobile-menu-drawer search-drawer"
                >
                    <div className="menu-list alldepart">
                        <form onSubmit={this.handleSubmit}>
                            <AutoComplete
                                value={inputValue}
                                options={this.state.searchOptions}
                                style={{
                                    width: "100%",
                                }}
                                onSelect={(select) => {
                                    this.selectKeyword(select)
                                }}
                                onSearch={(search) => {
                                    this.getSearchKeywordsDeb(search);
                                }}
                                placeholder="Search for products, brands and more"
                                loading={loading}
                            />
                        </form>
                    </div>
                </Drawer>
            </>
        );
    }
}

export default connect((state) => state, actions)(withRouter(SearchDrawer));

