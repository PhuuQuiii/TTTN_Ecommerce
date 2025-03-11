import { Button, Form, Input, message, Select } from 'antd';
import axios from 'axios';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getProductBrands } from '../../../../redux/actions/category_action';

const { Option } = Select;

const CreateCategory = ({ getProductBrands, brands }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getProductBrands();
    }, [getProductBrands]);

    const onFinish = async (values) => {
        try {
            setLoading(true);
            const response = await axios.put('http://localhost:3001/api/superadmin/product-category', {
                systemName: values.systemName,
                displayName: values.displayName,
                slug: values.displayName.toLowerCase().replace(/\s+/g, '-'),
                brands: values.brands
            });

            if (response.data.success) {
                message.success('Category created successfully');
                form.resetFields();
            } else {
                message.error(response.data.message || 'Failed to create category');
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-category-container">
            <h2>Create New Category</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                style={{ maxWidth: 600 }}
            >
                <Form.Item
                    label="System Name"
                    name="systemName"
                    rules={[{ required: true, message: 'Please input system name!' }]}
                >
                    <Input placeholder="Enter system name" />
                </Form.Item>

                <Form.Item
                    label="Display Name"
                    name="displayName"
                    rules={[{ required: true, message: 'Please input display name!' }]}
                >
                    <Input placeholder="Enter display name" />
                </Form.Item>

                <Form.Item
                    label="Brands"
                    name="brands"
                    rules={[{ required: true, message: 'Please select at least one brand!' }]}
                >
                    <Select
                        mode="multiple"
                        placeholder="Select brands"
                        style={{ width: '100%' }}
                    >
                        {brands.map(brand => (
                            <Option key={brand._id} value={brand._id}>
                                {brand.brandName}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Create Category
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

CreateCategory.propTypes = {
    getProductBrands: PropTypes.func.isRequired,
    brands: PropTypes.array.isRequired
};

const mapStateToProps = (state) => ({
    brands: state.category.brands
});

export default connect(mapStateToProps, { getProductBrands })(CreateCategory); 