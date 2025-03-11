import { SearchOutlined } from '@ant-design/icons';
import { Table as AntdTable, Button, Drawer, Input, Modal, Space } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { deleteBrand, flipBrandStatus, getBrands } from '../../../../redux/actions/brand_actions';

const Table = ({ getBrands, flipBrandStatus, deleteBrand, brands, totalCount, loading }) => {
    console.log('Component Props:', { brands, totalCount, loading });

    const [pagination, setPagination] = useState({
        defaultPageSize: 5,
        total: 0,
        pageSizeOptions: [5, 10, 15, 20, 50, 100],
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
    });

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState(null);
    const searchInput = useRef(null);

    useEffect(() => {
        getBrands(pagination.current, pagination.pageSize);
    }, [getBrands, pagination.current, pagination.pageSize]);

    useEffect(() => {
        setPagination(prev => ({ ...prev, total: totalCount }));
    }, [totalCount]);

    const handleTableChange = (pagination, filters) => {
        getBrands(pagination.current, pagination.pageSize);
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
    };

    const handleReset = clearFilters => {
        clearFilters();
    };

    const handleToggleStatus = (brand) => {
        flipBrandStatus(brand._id);
    };

    const handleDelete = (brand) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this brand?',
            content: 'This action cannot be undone.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deleteBrand(brand._id);
            }
        });
    };

    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8, backgroundColor: '#495057' }}>
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
                    <Button 
                        onClick={() => handleReset(clearFilters)} 
                        size="small" 
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : '#495057' }} />,
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => searchInput.current.select(), 100);
            }
        },
    });

    const columns = useMemo(() => [
        {
            title: 'Brand Name',
            dataIndex: 'brandName',
            key: 'brandName',
            width: '25%',
            ...getColumnSearchProps('brandName')
        },
        {
            title: 'System Name',
            dataIndex: 'systemName',
            width: '20%',
        },
        {
            title: 'Status',
            dataIndex: 'isDisabled',
            key: 'status',
            width: '15%',
            render: isDisabled => (
                <span className={`badge badge-pill badge-${isDisabled ? 'danger' : 'success'}`}>
                    {isDisabled ? 'Disabled' : 'Active'}
                </span>
            )
        },
        {
            title: 'Created Date',
            dataIndex: 'createdAt',
            width: '20%',
            render: date => moment(date).format("MMM Do YYYY")
        },
        {
            title: 'Action',
            key: 'action',
            width: '20%',
            render: brand => (
                <Space size="small">
                    {/* <Button
                        type={brand.isDisabled ? "primary" : "default"}
                        size="small"
                        onClick={() => handleToggleStatus(brand)}
                        icon={brand.isDisabled ? 
                            <i className="fas fa-eye"></i> : 
                            <i className="fas fa-eye-slash"></i>}
                    /> */}
                    <Button
                        type="danger"
                        size="small"
                        onClick={() => handleDelete(brand)}
                        icon={<i className="fas fa-trash"></i>}
                    />
                </Space>
            ),
        },
    ], []);

    return (
        <>
            <AntdTable
                columns={columns}
                rowKey={record => record._id}
                dataSource={brands}
                pagination={pagination}
                loading={loading}
                onChange={handleTableChange}
                size='small'
            />
            <Drawer
                title="Brand Details"
                placement="right"
                width={600}
                closable
                onClose={() => setIsDrawerOpen(false)}
                visible={isDrawerOpen}
                closeIcon={<i className="fas fa-times btn btn-danger"></i>}
            >
                {selectedBrand && (
                    <div className="brand-details">
                        <h3>{selectedBrand.brandName}</h3>
                        <p><strong>System Name:</strong> {selectedBrand.systemName}</p>
                        <p><strong>Status:</strong> {selectedBrand.isDisabled ? 'Disabled' : 'Active'}</p>
                        <p><strong>Created:</strong> {moment(selectedBrand.createdAt).format("MMMM Do YYYY, h:mm:ss a")}</p>
                    </div>
                )}
            </Drawer>
        </>
    );
};

Table.propTypes = {
    brands: PropTypes.array,
    loading: PropTypes.bool,
    totalCount: PropTypes.number,
    getBrands: PropTypes.func.isRequired,
    flipBrandStatus: PropTypes.func.isRequired,
    deleteBrand: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
    console.log('Redux State:', state); // Thêm log này
    return {
        brands: state.brand.brands || [],
        loading: state.brand.loading,
        totalCount: state.brand.totalCount,
    };
};

const mapDispatchToProps = {
    getBrands,
    flipBrandStatus,
    deleteBrand
};

export default connect(mapStateToProps, mapDispatchToProps)(Table);