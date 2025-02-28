import { SearchOutlined } from '@ant-design/icons';
import { Table as AntdUserTable, Button, Input, Popconfirm, Space } from 'antd';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useRef, useState } from 'react';

const UserTable = ({ getUsers, blockUnblockUser, multiLoading, users, totalCount }) => {
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
        pageSizeOptions: [5, 10, 15, 20, 50, 100],
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
    });
    const [searchText, setSearchText] = useState('');
    const [filteredUsers, setFilteredUsers] = useState(users);
    const searchInput = useRef(null);

    useEffect(() => {
        setPagination((prev) => ({
            ...prev,
            total: totalCount
        }));
    }, [totalCount]);

    useEffect(() => {
        getUsers({ page: pagination.current, perPage: pagination.pageSize });
    }, [pagination.current, pagination.pageSize]);

    useEffect(() => {
        setFilteredUsers(users.filter(user => user.name.toLowerCase().includes(searchText.toLowerCase())));
    }, [searchText, users]);

    const handleUserTableChange = (pagination, filters) => {
        setPagination((prev) => ({
            ...prev,
            current: pagination.current,
            pageSize: pagination.pageSize
        }));
    };

    // const handleSearch = (selectedKeys, confirm, dataIndex) => {
    //     confirm();
    //     setSearchText(selectedKeys[0]);
    // };

    const handleReset = clearFilters => {
        clearFilters();
        setSearchText('');
    };

    // const getUserSearchProps = dataIndex => ({
    //     filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
    //         <div style={{ padding: 8, backgroundColor: '#495057' }}>
    //             <Input
    //                 ref={searchInput}
    //                 placeholder={`Search ${dataIndex}`}
    //                 value={selectedKeys[0]}
    //                 onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
    //                 onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
    //                 style={{ width: 188, marginBottom: 8, display: 'block' }}
    //             />
    //             <Space>
    //                 <Button
    //                     type="primary"
    //                     onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
    //                     icon={<SearchOutlined />}
    //                     size="small"
    //                     style={{ width: 90 }}
    //                 >
    //                     Search
    //                 </Button>
    //                 <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
    //                     Cancel
    //                 </Button>
    //             </Space>
    //         </div>
    //     ),
    //     filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : '#495057' }} />,
    //     onFilterDropdownVisibleChange: visible => {
    //         if (visible) {
    //             setTimeout(() => searchInput.current.select(), 100);
    //         }
    //     },
    //     render: text => text
    // });

    const columns = useMemo(() => [
        {
            title: 'User',
            dataIndex: 'name',
            key: 'user',
            width: '30%',
            // ...getUserSearchProps('name')
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: '20%',
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
            width: '10%',
        },
        {
            title: 'DOB',
            dataIndex: 'dob',
            key: 'dob',
            width: '10%',
            render: date => `${moment(date, 'YYYY-MM-DD').format("MMM Do YYYY")}` // Sử dụng định dạng hợp lệ
        },
        {
            title: 'Status',
            dataIndex: 'isBlocked',
            key: 'status',
            filterMultiple: false,
            filters: [
                { text: 'All', value: 'undefined' },
                { text: 'Blocked', value: 'blocked' },
                { text: 'Active', value: 'active' },
            ],
            render: isBlocked => {
                if (isBlocked) return (<span className="badge badge-pill badge-danger">Blocked</span>);
                return (<span className="badge badge-pill badge-success">Active</span>);
            },
            width: '10%',
        },
        {
            title: 'createdAt',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: '10%',
            render: date => `${moment(date, 'YYYY-MM-DD').format("MMM Do YYYY")}` // Sử dụng định dạng hợp lệ
        },
        {
            title: 'Actions',
            dataIndex: '',
            width: '10%',
            render: user => <>
                <Popconfirm
                    title={`Are you sure to ${user.isBlocked ? 'unblock' : 'block'} this user?`}
                    onConfirm={() => blockUnblockUser(user._id, !user.isBlocked)}
                    okText="Yes"
                    cancelText="No"
                >
                    <button className="btn btn-danger btn-sm"><i className="fas fa-ban"></i></button>
                </Popconfirm>
            </>
        },
    ], [blockUnblockUser]);

    return (
        <AntdUserTable
            columns={columns}
            rowKey={record => record._id}
            dataSource={filteredUsers}
            pagination={pagination}
            loading={multiLoading}
            onChange={handleUserTableChange}
            size='small'
        />
    );
}

UserTable.propTypes = {
    users: PropTypes.array,
    multiLoading: PropTypes.bool,
    totalCount: PropTypes.number,
    getUsers: PropTypes.func.isRequired,
    blockUnblockUser: PropTypes.func.isRequired,
}

export default UserTable;