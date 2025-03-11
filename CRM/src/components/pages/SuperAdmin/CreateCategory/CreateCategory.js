import { Button, Form, Input, Select } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getProductBrands, getCategories, createCategory } from '../../../../redux/actions/category_action';

const { Option } = Select;

const CreateCategory = ({ getProductBrands, getCategories, createCategory, brands, categories, loading }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        getProductBrands();
        getCategories(); // Lấy danh sách categories
    }, [getProductBrands, getCategories]);

    const onFinish = (values) => {
        const categoryData = {
            systemName: values.systemName,
            displayName: values.displayName,
            slug: values.displayName.toLowerCase().replace(/\s+/g, '-'),
            brands: values.brands,
            parent_id: values.parent_id || null // Gửi parent_id nếu có
        };

        createCategory(categoryData, form).then(() => {
            window.location.reload(); // Reload lại trang sau khi tạo thành công
        });
    };

    return (
        <div className="create-category-container">
            <h2>Create New Category</h2>
            <Form form={form} layout="vertical" onFinish={onFinish} style={{ maxWidth: 600 }}>
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
                    label="Parent Category"
                    name="parent_id"
                >
                    <Select placeholder="Select parent category" allowClear style={{ width: '100%' }}>
                        {categories.map((category) => (
                            <Option key={category._id} value={category._id}>
                                {category.displayName}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Brands"
                    name="brands"
                    rules={[{ required: true, message: 'Please select at least one brand!' }]}
                >
                    <Select mode="multiple" placeholder="Select brands" style={{ width: '100%' }}>
                        {brands.map((brand) => (
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
    getCategories: PropTypes.func.isRequired, // Thêm getCategories
    createCategory: PropTypes.func.isRequired,
    brands: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired, // Thêm categories
    loading: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
    brands: state.category.brands,
    categories: state.category.categories, // Lấy categories từ Redux
    loading: state.category.loading
});

export default connect(mapStateToProps, { getProductBrands, getCategories, createCategory })(CreateCategory);
