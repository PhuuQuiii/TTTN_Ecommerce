import { Button, Form, Select } from 'antd';
import axios from 'axios';
import PropTypes from "prop-types";
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

const { Option } = Select;

const AddProduct = ({ onSelectProduct, next, adminId }) => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        // Fetch products from API
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`http://server-tttn.railway.internal:3001/api/product/products/${adminId}`);
                setProducts(response.data);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            }
        };

        if (adminId) {
            fetchProducts();
        }
    }, [adminId]);

    const handleProductChange = (value) => {
        setSelectedProduct(value);
        onSelectProduct(value);
    };

    const handleNext = () => {
        if (selectedProduct) {
            next();
        } else {
            alert('Please select a product');
        }
    };

    return (
        <>
            <h2>Select Product for Sale</h2>
            <Form layout="vertical">
                <Form.Item label="Product" required>
                    <Select
                        placeholder="Select a product"
                        onChange={handleProductChange}
                        value={selectedProduct}
                    >
                        {products && products.map((product) => (
                            <Option key={product._id} value={product._id}>
                                {product.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Button type="primary" onClick={handleNext}>
                    Next
                </Button>
            </Form>
        </>
    );
};

AddProduct.propTypes = {
    onSelectProduct: PropTypes.func.isRequired,
    next: PropTypes.func.isRequired,
    adminId: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
    adminId: state.auth && state.auth.authUser ? state.auth.authUser._id : null,
});

export default connect(mapStateToProps)(AddProduct);