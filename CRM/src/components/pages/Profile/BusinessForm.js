import { message } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getBusinessInfo, updateBusinessInfo } from '../../../redux/actions/business_actions';

const BusinessForm = ({ user, business, getBusinessInfo, updateBusinessInfo }) => {
  const [businessData, setBusinessData] = useState({
    ownerName: '',
    address: '',
    city: '',
    citizenshipNumber: '',
    businessRegisterNumber: ''
  });

  const [files, setFiles] = useState({
    citizenshipFront: null,
    citizenshipBack: null,
    businessLicence: null
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      getBusinessInfo(user._id);
    }
  }, [user, getBusinessInfo]);

  useEffect(() => {
    if (business) {
      setBusinessData({
        ownerName: business.ownerName || '',
        address: business.address || '',
        city: business.city || '',
        citizenshipNumber: business.citizenshipNumber || '',
        businessRegisterNumber: business.businessRegisterNumber || ''
      });
    }
  }, [business]);

  const { ownerName, address, city, citizenshipNumber, businessRegisterNumber } = businessData;

  const onChange = e => {
    const { name, type } = e.target;
    
    if (type === 'file') {
      setFiles({
        ...files,
        [name]: e.target.files[0] || null
      });
    } else {
      setBusinessData({
        ...businessData,
        [name]: e.target.value
      });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    
    // Append text data
    Object.keys(businessData).forEach(key => {
      formData.append(key, businessData[key]);
    });
    
    // Append files
    Object.keys(files).forEach(key => {
      if (files[key]) {
        formData.append(key, files[key]);
      }
    });

    // Append user ID
    if (user?._id) {
      formData.append('userId', user._id);
    }

    try {
      await updateBusinessInfo(formData);
      message.success('Business information updated successfully');
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to update business information');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col-md-12">
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Business Information</h5>
        </div>
        <div className="card-body">
          <form onSubmit={onSubmit}>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="inputEmail4">Owner Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="inputEmail4" 
                  placeholder="owner name"
                  name='ownerName'
                  value={ownerName}
                  onChange={onChange} 
                />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="add">Address</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="add" 
                  placeholder="Address"
                  name='address'
                  value={address}
                  onChange={onChange} 
                />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="dist">City</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="dist" 
                  placeholder="City"
                  name='city'
                  value={city}
                  onChange={onChange} 
                />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="inputPassword4">Citizenship Number</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="inputPassword4" 
                  placeholder="citizenship number"
                  name='citizenshipNumber'
                  value={citizenshipNumber}
                  onChange={onChange} 
                />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="inputPassword">Business Register Number</label>
                <input 
                  type="text" 
                  className="form-control" 
                  id="inputPassword" 
                  placeholder="business register number"
                  name='businessRegisterNumber'
                  value={businessRegisterNumber}
                  onChange={onChange} 
                />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="exampleFormControlFile1">Citizenship Front Image</label>
                <input 
                  type="file" 
                  className="form-control-file" 
                  id="exampleFormControlFile1"
                  name='citizenshipFront'
                  onChange={onChange} 
                  accept="image/*"
                />
                {business?.citizenshipFront && (
                  <small className="form-text text-muted">
                    Current file: {business.citizenshipFront}
                  </small>
                )}
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="exampleFormControlFile2">Citizenship Back Image</label>
                <input 
                  type="file" 
                  className="form-control-file" 
                  id="exampleFormControlFile2"
                  name='citizenshipBack'
                  onChange={onChange} 
                  accept="image/*"
                />
                {business?.citizenshipBack && (
                  <small className="form-text text-muted">
                    Current file: {business.citizenshipBack}
                  </small>
                )}
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="exampleFormControlFile3">Business Licence Copy</label>
                <input 
                  type="file" 
                  className="form-control-file" 
                  id="exampleFormControlFile3"
                  name='businessLicence'
                  onChange={onChange} 
                  accept="image/*"
                />
                {business?.businessLicence && (
                  <small className="form-text text-muted">
                    Current file: {business.businessLicence}
                  </small>
                )}
              </div>
            </div>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

BusinessForm.propTypes = {
  user: PropTypes.object,
  business: PropTypes.object,
  getBusinessInfo: PropTypes.func.isRequired,
  updateBusinessInfo: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  user: state.auth.adminProfile,
  business: state.business.business
});

export default connect(mapStateToProps, { getBusinessInfo, updateBusinessInfo })(BusinessForm);
