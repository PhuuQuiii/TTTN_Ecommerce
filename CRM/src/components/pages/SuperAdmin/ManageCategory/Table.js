import { SearchOutlined } from '@ant-design/icons';
import { Table as AntdTable, Button, Drawer, Input, Modal, Space } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { deleteCategory, flipCategoryAvailability, getCategories, getProductBrands } from '../../../../redux/actions/category_action';

const mapDispatchToProps = {
    getCategories,
    getProductBrands,
    flipCategoryAvailability,
    deleteCategory
};

const Table = ({ getCategories, getProductBrands, categories, brands, totalCount, multiLoading, flipCategoryAvailability, deleteCategory }) => {
    const [pagination, setPagination] = useState({
        defaultPageSize: 5,
        total: 0,
        pageSizeOptions: [5, 10, 15, 20, 50, 100],
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
    })

    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState(null);
    const searchInput = useRef(null);

    useEffect(() => {
        getCategories(pagination.current, pagination.pageSize);
        getProductBrands();
    }, [])

    useEffect(() => {
        setPagination({ ...pagination, total: totalCount })
    }, [totalCount])

    const handleTableChange = (pagination, filters) => {
        getCategories(pagination.current, pagination.pageSize, filters.status?.[0])
    }

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
    };

    const handleReset = clearFilters => {
        clearFilters();
    };

    const handleToggleStatus = (category) => {
        flipCategoryAvailability(category.slug);
    };

    const handleDelete = (category) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this category?',
            content: 'This action cannot be undone.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deleteCategory(category.slug);
            }
        });
    };

    const getCategorySearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8, backgroundColor: '#495057'}}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Cancel
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : '#495057' }} />,
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => searchInput.current.select(), 100);
            }
        },
        render: text => text
    })

    const openCategory = (category) => {
        setSelectedCategory(category);
        setIsDrawerOpen(true)
    }

    const getBrandName = (brandId) => {
        if (!Array.isArray(brands)) return 'Loading...';
        
        const brand = brands.find(b => b._id === brandId);
        return brand ? brand.brandName : 'Unknown Brand';
    }

    const getParentCategoryName = (parentId) => {
        // Nếu không có parentId, trả về None
        if (!parentId) return "None";

        // Tìm category cha trong danh sách categories
        const parentCategory = categories.find(cat => {
            // So sánh cả string và ObjectId
            return cat._id.toString() === parentId.toString();
        });

        // Trả về tên category cha nếu tìm thấy, ngược lại trả về Unknown Parent
        return parentCategory ? parentCategory.displayName : "Unknown Parent";
    };

    const columns = useMemo(() => [
        {
            title: 'Display Name',
            dataIndex: 'displayName',
            key: 'displayName',
            width: '20%',
            ...getCategorySearchProps('displayName')
        },
        {
            title: 'System Name',
            dataIndex: 'systemName',
            width: '15%',
        },
        {
            title: 'Parent Category',
            dataIndex: 'parent',
            width: '20%',
            render: (parentId, record) => {
                return getParentCategoryName(parentId);
            }
        },
        {
            title: 'Brands',
            dataIndex: 'brands',
            width: '20%',
            render: brandIds => {
                if (!Array.isArray(brandIds) || !Array.isArray(brands)) {
                    return 'Loading...';
                }
                return brandIds.length > 0 ? 
                    brandIds.map(id => getBrandName(id)).join(', ') : 
                    'No brands';
            }
        },
        {
            title: 'Status',
            dataIndex: 'isDisabled',
            key: 'status',
            filterMultiple: false,
            filters: [
                { text: 'All', value: 'undefined' },
                { text: 'Active', value: 'active' },
                { text: 'Disabled', value: 'disabled' },
            ],
            render: isDisabled => {
                if (isDisabled) return (<span className="badge badge-pill badge-danger">Disabled</span>)
                return (<span className="badge badge-pill badge-success">Active</span>)
            },
            width: '10%',
        },
        {
            title: 'Created Date',
            dataIndex: 'createdAt',
            width: '15%',
            render: date => moment(date).format("MMM Do YYYY")
        },
        {
            title: 'Action',
            key: 'action',
            width: '15%',
            render: category => (
                <Space size="small">
                    <Button
                        type={category.isDisabled ? "primary" : "default"}
                        size="small"
                        onClick={() => handleToggleStatus(category)}
                        icon={category.isDisabled ? 
                            <i className="fas fa-eye"></i> : 
                            <i className="fas fa-eye-slash"></i>}
                    />
                    <Button
                        type="danger"
                        size="small"
                        onClick={() => handleDelete(category)}
                        icon={<i className="fas fa-trash"></i>}
                    />
                </Space>
            ),
        },
    ], [categories, brands]);

    return (
        <>
            <AntdTable
                columns={columns}
                rowKey={record => record._id}
                dataSource={categories}
                pagination={pagination}
                loading={multiLoading}
                onChange={handleTableChange}
                size='small'
            />
            <Drawer
                title="Category Details"
                placement="right"
                width={600}
                closable
                onClose={() => setIsDrawerOpen(false)}
                visible={isDrawerOpen}
                closeIcon={<i className="fas fa-times btn btn-danger"></i>}
            >
                {selectedCategory && (
                    <div className="category-details">
                        <h3>{selectedCategory.displayName}</h3>
                        <p><strong>System Name:</strong> {selectedCategory.systemName}</p>
                        <p><strong>Parent Category:</strong> {getParentCategoryName(selectedCategory.parent)}</p>
                        <p><strong>Status:</strong> {selectedCategory.isDisabled ? 'Disabled' : 'Active'}</p>
                        <div>
                            <strong>Brands:</strong>
                            <div className="brands-list">
                                {selectedCategory.brands && selectedCategory.brands.length > 0 ? 
                                    selectedCategory.brands.map(brandId => (
                                        <span key={brandId} className="brand-tag">
                                            {getBrandName(brandId)}
                                        </span>
                                    )) : 
                                    'No brands assigned'
                                }
                            </div>
                        </div>
                    </div>
                )}
            </Drawer>
        </>
    )
}

Table.propTypes = {
    categories: PropTypes.array,
    brands: PropTypes.array,
    multiLoading: PropTypes.bool,
    totalCount: PropTypes.number,
    getCategories: PropTypes.func.isRequired,
    getProductBrands: PropTypes.func.isRequired,
    flipCategoryAvailability: PropTypes.func.isRequired,
    deleteCategory: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
    categories: state.category.categories,
    brands: state.category.brands,
    multiLoading: state.category.loading,
    totalCount: state.category.totalCount,
})

export default connect(mapStateToProps, mapDispatchToProps)(Table)