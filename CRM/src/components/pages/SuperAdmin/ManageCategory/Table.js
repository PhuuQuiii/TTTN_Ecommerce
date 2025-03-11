import { SearchOutlined } from '@ant-design/icons';
import { Table as AntdTable, Button, Drawer, Input, Space } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { getCategories, getProductBrands } from '../../../../redux/actions/category_action';

const Table = ({ getCategories, getProductBrands, categories, brands, totalCount, multiLoading }) => {
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
        getProductBrands(); // Fetch brands when component mounts
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
        const brand = brands.find(b => b._id === brandId);
        return brand ? brand.brandName : 'Unknown Brand';
    }

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
            render: parent => parent ? parent.displayName : '-'
        },
        {
            title: 'Brands',
            dataIndex: 'brands',
            width: '20%',
            render: brandIds => brandIds && brandIds.length > 0 ? 
                brandIds.map(id => getBrandName(id)).join(', ') : 
                'No brands'
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
            width: '10%',
            render: category => (
                <Space size="small">
                    <Button 
                        type="primary" 
                        size="small" 
                        onClick={() => openCategory(category)}
                        icon={<i className="fas fa-edit"></i>}
                    />
                    <Button 
                        type="danger" 
                        size="small"
                        icon={<i className="fas fa-trash"></i>}
                    />
                </Space>
            ),
        },
    ], [brands]);

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
                        <p><strong>Parent:</strong> {selectedCategory.parent?.displayName || 'None'}</p>
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
}

const mapStateToProps = (state) => ({
    categories: state.category.categories,
    brands: state.category.brands,
    multiLoading: state.category.loading,
    totalCount: state.category.totalCount,
})

export default connect(mapStateToProps, { getCategories, getProductBrands })(Table)