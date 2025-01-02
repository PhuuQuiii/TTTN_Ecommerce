import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getBusinessInfo } from '../../../redux/actions/business_actions';

const BusinessForm = ({ user, business, getBusinessInfo }) => {
  const [businessData, setBusinessData] = useState({
    ownerName: '',
    address: '',
    city: '',
    citizenshipNumber: '',
    businessRegisterNumber: '',
    citizenshipFront: '',
    citizenshipBack: '',
    businessLicence: ''
  });

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
        businessRegisterNumber: business.businessRegisterNumber || '',
        citizenshipFront: business.citizenshipFront || '',
        citizenshipBack: business.citizenshipBack || '',
        businessLicence: business.businessLicence || ''
      });
    }
  }, [business]);

  const { ownerName, address, city, citizenshipNumber, businessRegisterNumber, citizenshipFront, citizenshipBack, businessLicence } = businessData;

  const onChange = e => setBusinessData({ ...businessData, [e.target.name]: e.target.value });

  return (
    <div className="col-md-12">
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Business Information</h5>
        </div>
        <div className="card-body">
          <form>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="inputEmail4">Owner Name</label>
                <input type="text" className="form-control" id="inputEmail4" placeholder="owner name"
                  name='ownerName'
                  value={ownerName}
                  onChange={onChange} />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="add">Address</label>
                <input type="text" className="form-control" id="add" placeholder="Address"
                  name='address'
                  value={address}
                  onChange={onChange} />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="dist">City</label>
                <input type="text" className="form-control" id="dist" placeholder="City"
                  name='city'
                  value={city}
                  onChange={onChange} />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="inputPassword4">Citizenship Number</label>
                <input type="text" className="form-control" id="inputPassword4" placeholder="citizenship number"
                  name='citizenshipNumber'
                  value={citizenshipNumber}
                  onChange={onChange} />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="inputPassword">Business Register Number</label>
                <input type="text" className="form-control" id="inputPassword" placeholder="business register number"
                  name='businessRegisterNumber'
                  value={businessRegisterNumber}
                  onChange={onChange} />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="exampleFormControlFile1">Citizenship Front Image</label>
                <input type="file" className="form-control-file" id="exampleFormControlFile1"
                  name='citizenshipFront'
                  value={citizenshipFront}
                  onChange={onChange} />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="exampleFormControlFile2">Citizenship Back Image</label>
                <input type="file" className="form-control-file" id="exampleFormControlFile2"
                  name='citizenshipBack'
                  value={citizenshipBack}
                  onChange={onChange} />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="exampleFormControlFile3">Business Licence Copy</label>
                <input type="file" className="form-control-file" id="exampleFormControlFile3"
                  name='businessLicence'
                  value={businessLicence}
                  onChange={onChange} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

BusinessForm.propTypes = {
  user: PropTypes.object,
  business: PropTypes.object,
  getBusinessInfo: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  user: state.auth.adminProfile,
  business: state.business.business
});

export default connect(mapStateToProps, { getBusinessInfo })(BusinessForm);
