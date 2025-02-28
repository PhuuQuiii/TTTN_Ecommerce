import { Popconfirm, Radio } from 'antd';
import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { blockUnblockUser } from '../../../redux/actions/superadmin_action';

export const UserStatus = ({ isSuperadmin, user, loading, blockUnblockUser }) => {
    const [value, setValue] = useState(user.isBlocked ? 'block' : 'unblock');
    const [openBlockConfirmation, setOpenBlockConfirmation] = useState(false);

    function onChange(e) {
        if (e.target.value === 'block') {
            blockUnblockUser(user.id, true);
        } else if (e.target.value === 'unblock') {
            blockUnblockUser(user.id, false);
        }
        setValue(e.target.value);
    }

    return (
        <Fragment>
            <div className="mb-2">
                <p><strong>Status:</strong> {user && (
                    user.isBlocked ? <span className="badge badge-pill badge-danger">blocked</span> :
                    <span className="badge badge-pill badge-success">active</span>
                )}
                </p>
                {
                    isSuperadmin && user && <Popconfirm
                        title={`Are you sure to ${user.isBlocked ? 'unblock' : 'block'} this user?`}
                        visible={openBlockConfirmation}
                        onConfirm={() => onChange({ target: { value: user.isBlocked ? 'unblock' : 'block' } })}
                        onCancel={() => setOpenBlockConfirmation(false)}
                        okButtonProps={{ loading }}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Radio.Group onChange={onChange} value={value}>
                            <Radio disabled={loading} value={'block'}>Block</Radio>
                            <Radio disabled={loading} value={'unblock'}>Unblock</Radio>
                        </Radio.Group>
                    </Popconfirm>
                }
            </div>
        </Fragment>
    );
}

UserStatus.propTypes = {
    user: PropTypes.object,
    isSuperadmin: PropTypes.bool,
    loading: PropTypes.bool,
}

const mapStateToProps = (state) => ({
    loading: state.user.toggleUserBlockLoading
})

const mapDispatchToProps = {
    blockUnblockUser
}

export default connect(mapStateToProps, mapDispatchToProps)(UserStatus);