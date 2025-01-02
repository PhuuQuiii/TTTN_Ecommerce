import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Switch, Popconfirm, Tooltip } from 'antd';
import { connect } from 'react-redux';
import { toggleOrderApproval, toggletobeReturnOrder } from '../../../redux/actions/order_actions';

const OrderStatus = ({ loading, status, order_id, admin_id, toggleOrderApproval, toggletobeReturnOrder, remainingProductQty, isOrderDetailOpen }) => {
  const [defaultCheckApprove, setdefaultCheckApprove] = useState(false);
  const [defaultCheckComplete, setdefaultCheckComplete] = useState(false);
  const [switchClass, setSwitchClass] = useState('');
  const [openToBeReturnedForm, setOpenToBeReturnedForm] = useState(false);
  const [toBereturnedFormData, setToBeReturnedFormData] = useState({
    remark: '',
    returnedAmount: ''
  });

  useEffect(() => {
    if (status === 'active') {
      setSwitchClass('order-status-active');
      setdefaultCheckApprove(true);
    } else if (status === 'approve') {
      setSwitchClass('order-status-approve');
      setdefaultCheckApprove(false);
    } else if (status === 'complete') {
      setSwitchClass('order-status-complete');
      setdefaultCheckComplete(true);
    } else if (status === 'tobereturned') {
      setSwitchClass('order-status-tobereturned');
      setdefaultCheckComplete(false);
    }
    setOpenToBeReturnedForm(false);
    setToBeReturnedFormData({
      remark: '',
      returnedAmount: ''
    });
  }, [status]);

  useEffect(() => {
    if (!isOrderDetailOpen) {
      setOpenToBeReturnedForm(false);
      setToBeReturnedFormData({
        remark: '',
        returnedAmount: ''
      });
    }
  }, [isOrderDetailOpen]);

  const toggleApproval = () => {
    toggleOrderApproval(admin_id, order_id);
  };

  const switchToToBeReturned = () => {
    toggletobeReturnOrder(admin_id, order_id, toBereturnedFormData.remark, toBereturnedFormData.returnedAmount);
  };

  const switchToComplete = () => {
    toggletobeReturnOrder(admin_id, order_id);
  };

  const handleReturnedFormDataChange = (e) => {
    setToBeReturnedFormData({
      ...toBereturnedFormData,
      [e.target.name]: e.target.value
    });
  };

  const toBeReturnedForm = () => {
    return (
      <div className="col-md-12">
        Remark:
        <textarea
          className="form-control"
          onChange={handleReturnedFormDataChange}
          name="remark"
          rows={2}
          placeholder="Customer reason"
          value={toBereturnedFormData.remark}
          required
        />
        Return amount:
        <input
          type="number"
          onChange={handleReturnedFormDataChange}
          value={toBereturnedFormData.returnedAmount}
          min="0"
          name="returnedAmount"
          className="form-control mb-2 mr-sm-2"
          placeholder="xxx..."
        />
      </div>
    );
  };

  if (status === 'active' && remainingProductQty < 1) {
    return (
      <Tooltip title="Product is out of stock, cannot approve.">
        <span>
          <Switch
            className={switchClass}
            disabled
            onClick={toggleApproval}
            loading={loading}
            checkedChildren="active"
            unCheckedChildren="approve"
            checked={defaultCheckApprove}
          />
        </span>
      </Tooltip>
    );
  }

  if (status === 'approve' || status === 'active') {
    return (
      <Switch
        className={switchClass}
        onClick={toggleApproval}
        loading={loading}
        checkedChildren="active"
        unCheckedChildren="approve"
        checked={defaultCheckApprove}
      />
    );
  }

  if (status === 'complete') {
    return (
      <Popconfirm
        title={toBeReturnedForm}
        visible={openToBeReturnedForm}
        onConfirm={switchToToBeReturned}
        onCancel={() => setOpenToBeReturnedForm(false)}
        okButtonProps={{ loading }}
        okText="Submit"
        cancelText="Cancel"
      >
        <Switch
          className={switchClass}
          onClick={() => setOpenToBeReturnedForm(true)}
          loading={loading}
          checkedChildren="complete"
          unCheckedChildren="toberetured"
          checked={defaultCheckComplete}
        />
      </Popconfirm>
    );
  }

  if (status === 'tobereturned') {
    return (
      <Switch
        className={switchClass}
        onClick={switchToComplete}
        loading={loading}
        checkedChildren="complete"
        unCheckedChildren="toberetured"
        checked={defaultCheckComplete}
      />
    );
  }

  const otherStatus = (status) => {
    let badgeClass =
      status === 'dispatch'
        ? 'badge badge-pill badge-primary'
        : status === 'cancel'
        ? 'badge badge-pill badge-danger'
        : status === 'complete'
        ? 'badge badge-pill badge-success'
        : status === 'tobereturned'
        ? 'badge badge-pill badge-warning'
        : 'badge badge-pill badge-dark';
    return <span className={badgeClass}>{status}</span>;
  };

  return <>{otherStatus(status)}</>;
};

OrderStatus.propTypes = {
  status: PropTypes.string,
  order_id: PropTypes.string,
  admin_id: PropTypes.string,
  loading: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => ({
  loading: state.order.orderStatusLoading
});

export default connect(mapStateToProps, { toggleOrderApproval, toggletobeReturnOrder })(React.memo(OrderStatus));
