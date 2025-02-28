import { Tabs } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

const { TabPane } = Tabs;

export const UserDetail = ({ user }) => {
    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="row">
            <div className="col-xl-5">
                <img
                    src={`${process.env.REACT_APP_SERVER_URL}/uploads/${user.photo}`}
                    alt={user.name}
                    style={{ width: '100%', height: 'auto' }}
                />
            </div>
            <div className="col-xl-7">
                <div className="mb-2">
                    <h2>{user.name}</h2>
                </div>
                <div className="mb-2">
                    <p><strong>Email:</strong> {user.email}</p>
                </div>
                <div className="mb-2">
                    <p><strong>Date of Birth:</strong> {user.dob}</p>
                </div>
                <div className="mb-2">
                    <p><strong>Gender:</strong> {user.gender}</p>
                </div>
                <div className="mb-2">
                    <p><strong>Login Domain:</strong> {user.loginDomain}</p>
                </div>
            </div>
            <div className="row mb-12">
                <div className="col-md-12">
                    <Tabs>
                        <TabPane tab="Locations" key="a">
                            {user.location.map(loc => (
                                <p key={loc}>{loc}</p>
                            ))}
                        </TabPane>
                        <TabPane tab="Other" key="b">
                            <p>User created at: {user.createdAt}</p>
                            <p>User updated at: {user.updatedAt}</p>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

UserDetail.propTypes = {
    user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    user: state.superadmin.user,
});

export default connect(mapStateToProps)(UserDetail);