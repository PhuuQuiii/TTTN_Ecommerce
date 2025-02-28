import { Checkbox, Col, Row } from 'antd';
import React, { Component } from "react";

class Filter extends Component{
    
    onChange = (checkedValues) => {
        console.log('checked = ', checkedValues);
    }


    render(){
        const brandOptions = [
            { label: 'Roadster', value: 'Roadster' },
            { label: 'Puma', value: 'Puma' },
            { label: 'Tommy Hilfiger', value: 'tommy-hilfiger' },
            { label: 'Huetrap', value: 'Huetrap' },
            { label: 'Jack & Jones', value: 'Jack & Jones' },
        ];
    
        const priceOptions = [
            { label: 'vnđ. 179 to vnđ. 1977', value: '179-1977' },
            { label: 'vnđ. 1977 to vnđ. 3775', value: '1977-3775' },
            { label: 'vnđ. 3775 to vnđ. 5179', value: '3775-5179' }
        ];
    
        const colorOptions = [
            { label: 'Black', value: 'black' },
            { label: 'Blue', value: 'blue' },
            { label: 'Red', value: 'red' },
            { label: 'Orange', value: 'orange' }
        ];

        return (
            <div className={"listing-filter " + this.props.removeThisFilter}>
                <div className={"filter-title " + this.props.removeThisTitle}>
                    <span>FILTERS</span>
                    {/* <Icon type="close" className="close"/> */}
                </div>
                <div className="filter-types">
                    <div className="type-title">BRAND</div>
                    <div className="type-list">
                        <Checkbox.Group options={brandOptions} onChange={this.onChange} />
                    </div>
                </div>
                <div className="filter-types">
                    <div className="type-title">Price</div>
                    <div className="type-list">
                        <Checkbox.Group options={priceOptions} onChange={this.onChange} />
                    </div>
                </div>
                <div className="filter-types last-child-fi-type">
                    <div className="type-title">Color</div>
                    <div className="type-list">
                        <Checkbox.Group options={colorOptions} onChange={this.onChange} />
                    </div>
                </div>
                <div className="sticky-filter inside-filter-sticky">
                    <Row style={{width: '100%'}}>
                        <Col span={12}>
                            <div className="filter-type" onClick = { this.props.closeThisFilter }>
                                <span>CLOSE</span>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className="filter-type apply-type removeBorder">
                                <span>APPLY</span>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

export default Filter