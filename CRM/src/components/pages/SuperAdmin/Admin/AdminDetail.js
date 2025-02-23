import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Tabs } from 'antd';
import { connect } from 'react-redux';
import {
  flipAdminBusinessApproval,
  flipAdminBankApproval,
  flipAdminWarehouseApproval,
  flipAdminAccountApproval,
  blockUnblockAdmin,
  getAdmin
} from '../../../../redux/actions/superadmin_action';
import { getBusinessInfo } from '../../../../redux/actions/business_actions';
import { fetchBankInfo } from '../../../../redux/actions/bank_actions';
import { fetchWareHouseInfo } from '../../../../redux/actions/warehouse_actions';

const { TabPane } = Tabs;

const AdminDetail = ({ adminId, admin }) => {
  const dispatch = useDispatch();
  const { loading, error, data } = useSelector(state => state.superadmin);
  const { business, loading: businessLoading, error: businessError } = useSelector(state => state.business);
  const { bank, loading: bankLoading, error: bankError } = useSelector(state => state.bank);
  const { warehouse, loading: warehouseLoading, error: warehouseError } = useSelector(state => state.warehouse);

  useEffect(() => {
    if (adminId) {
      console.log("Admin ID in AdminDetail:", adminId);
      dispatch(getBusinessInfo(adminId));
      dispatch(getAdmin(adminId)); 
      dispatch(fetchBankInfo(adminId));
      dispatch(fetchWareHouseInfo(adminId));
    }
  }, [dispatch, adminId]);

  useEffect(() => {
    console.log("Business Info:", business); // Log dữ liệu business khi nó thay đổi
  }, [business]);

  useEffect(() => {
    console.log("Bank Info:", bank); // Log dữ liệu bank khi nó thay đổi
  }, [bank]);

  useEffect(() => {
    console.log("Warehouse Info:", warehouse); // Log dữ liệu warehouse khi nó thay đổi
  }, [warehouse]);

  const handleApproveBusiness = () => {
    if (business?._id) {
      dispatch(flipAdminBusinessApproval(business._id));
    }
  };

  const handleApproveBank = () => {
    if (bank?._id) {
      dispatch(flipAdminBankApproval(bank._id));
    }
  };

  const handleApproveWarehouse = () => {
    if (warehouse?._id) {
      dispatch(flipAdminWarehouseApproval(warehouse._id));
    }
  };

  const handleApproveAccount = () => {
    dispatch(flipAdminAccountApproval(adminId));
  };

  const handleBlockUnblockAdmin = () => {
    dispatch(blockUnblockAdmin(adminId));
  };

    
  return (
    <div style={{ padding: '1rem' }}>
      <h2>Admin Detail</h2>
      <p>
        <strong>Name:</strong> {admin?.name}
      </p>
      
      <p>
        <button onClick={handleBlockUnblockAdmin}>Block/Unblock Admin</button>
      </p>

      <Tabs defaultActiveKey="business">
        <TabPane tab="Business Info" key="business">
          {businessLoading ? (
            <p>Loading...</p>
          ) : businessError.msg ? (
            <p>Error: {businessError.msg}</p>
          ) : business ? (
            <>
                <p><strong>Owner Name:</strong> {business?.ownerName}</p>
                <p><strong>Address:</strong> {business?.address}</p>
                <p><strong>City:</strong> {business?.city}</p>
                <p><strong>Citizenship Number:</strong> {business?.citizenshipNumber}</p>
                <p><strong>Business Register Number:</strong> {business?.businessRegisterNumber}</p>

                <p><strong>Citizenship Front:</strong> 
                <img src={business?.citizenshipFront} alt="Citizenship Front" />
                </p>

                <p><strong>Citizenship Back:</strong> 
                <img src={business?.citizenshipBack} alt="Citizenship Back" />
                </p>

                <p><strong>Business Licence:</strong> 
                <img src={business?.businessLicence} alt="Business Licence" />
                </p>

                <p><strong>Verification Status:</strong> {business?.isVerified ? 'Verified' : 'Not Verified'}</p>
              {!business?.isVerified && (
                <button onClick={handleApproveBusiness}>Approve Business</button>
              )}
            </>
            ) : (
              <p>No business information available</p>
          )}
        </TabPane>

        <TabPane tab="Bank Info" key="bank">
        {bankLoading ? (
              <p>Loading...</p>
          ) : bankError.msg ? (
              <p>Error: {bankError.msg}</p>
          ) : bank ? (
              <>
                  <p><strong>Account Holder:</strong> {bank.accountHolder ?? "N/A"}</p>
                  <p><strong>Account Number:</strong> {bank.accountNumber}</p>
                  <p><strong>Bank Name:</strong> {bank.bankName}</p>
                  <p><strong>Branch Name:</strong> {bank.branchName}</p>
                  <p><strong>Routing Number:</strong> {bank.routingNumber}</p>
                  <p><strong>Cheque Copy:</strong>
                  <img src={`${process.env.REACT_APP_SERVER_URL}/uploads/${bank.chequeCopy}`} alt="Cheque Copy"
                    // style={{ width: '200px', height: 'auto' }}
                  /></p>
                  <p><strong>Verification Status:</strong> {bank.isVerified ? 'Verified' : 'Not Verified'}</p>
                  {!bank.isVerified && (
                    <button onClick={handleApproveBank}>Approve Bank</button>
                  )}
              </>
          ) : (
              <p>No bank data available</p>
          )}
        </TabPane>

        <TabPane tab="Warehouse Info" key="warehouse">
          {warehouseLoading ? (
            <p>Loading...</p>
          ) : warehouseError.msg ? (
            <p>Error: {warehouseError.msg}</p>
          ) : warehouse ? (
            <>
              <p><strong>Name:</strong> {warehouse.name}</p>
              <p><strong>Address:</strong> {warehouse.address}</p>
              <p><strong>City:</strong> {warehouse.city}</p>
              <p><strong>Phone Number:</strong> {warehouse.phoneno}</p>
              <p><strong>Verification Status:</strong> {warehouse.isVerified ? 'Verified' : 'Not Verified'}</p>
              {!warehouse.isVerified && (
                <button onClick={handleApproveWarehouse}>Approve Warehouse</button>
              )}
            </>
          ) : (
            <p>No warehouse information available</p>
          )}
        </TabPane>

        <TabPane tab="Overall Account" key="account">
          <p>
            <strong>Account Status:</strong>{' '}
            {admin?.isVerified
              ? `Verified on ${admin?.isVerified}`
              : 'Not Verified'}
          </p>
          <button onClick={handleApproveAccount}>Approve Account</button>
        </TabPane>

        <TabPane tab="Other" key="other">
          <p>Other Info</p>
        </TabPane>
      </Tabs>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {data && <p>Success: {JSON.stringify(data)}</p>}
    </div>
  );
};

AdminDetail.propTypes = {
  adminId: PropTypes.string.isRequired,
  admin: PropTypes.object
};

const mapStateToProps = (state) => ({
  admin: state.superadmin.admin, // Lấy thông tin admin từ Redux store
  business: state.business.business,
  businessLoading: state.business.loading,
  businessError: state.business.error,
  bank: state.bank.bank,
  bankLoading: state.bank.loading,
  bankError: state.bank.error
});

const mapDispatchToProps = {
  getBusinessInfo,
  getAdmin,
  fetchBankInfo,
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminDetail);
