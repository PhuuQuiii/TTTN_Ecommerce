import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { blockUnblockUser, getUsers } from '../../../../redux/actions/superadmin_action';
import UserTable from '../../../common/user/UserTable';

const ManageUsers = () => {
    const dispatch = useDispatch();
    const users = useSelector(state => state.superadmin.users);
    const totalCount = useSelector(state => state.superadmin.totalCount);
    const multiLoading = useSelector(state => state.superadmin.multiLoading);

    useEffect(() => {
        dispatch(getUsers({ page: 1, perPage: 5 })); // Khởi tạo với trang 1 và số lượng 5
    }, [dispatch]);

    return (
        <div>
            <h1>Manage Users</h1>
            <UserTable
                getUsers={params => dispatch(getUsers(params))}
                blockUnblockUser={(userId, isBlocked) => dispatch(blockUnblockUser(userId, isBlocked))}
                users={users}
                totalCount={totalCount}
                multiLoading={multiLoading}
            />
        </div>
    );
};

export default ManageUsers;