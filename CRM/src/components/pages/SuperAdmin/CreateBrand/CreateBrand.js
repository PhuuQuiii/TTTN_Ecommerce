import { Button, Form, Input, message } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import shortid from 'shortid';
import { createBrand } from '../../../../redux/actions/brand_actions';

const CreateBrand = ({ createBrand, loading }) => {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        const brandData = {
            systemName: shortid.generate(),
            brandName: values.brandName,
            slug: values.brandName.toLowerCase().replace(/\s+/g, '-')
        };

        createBrand(brandData).then(() => {
            form.resetFields();
            message.success('Brand created successfully');
        });
    };

    return (
        <div className="create-brand-container">
            <h2>Create New Brand</h2>
            <Form form={form} layout="vertical" onFinish={onFinish} style={{ maxWidth: 600 }}>
                <Form.Item
                    label="Brand Name"
                    name="brandName"
                    rules={[{ required: true, message: 'Please input brand name!' }]}
                >
                    <Input placeholder="Enter brand name" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Create Brand
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

CreateBrand.propTypes = {
    createBrand: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    loading: state.brand.loading
});

export default connect(mapStateToProps, { createBrand })(CreateBrand);