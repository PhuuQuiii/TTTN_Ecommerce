import { message } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { fetchWareHouseInfo, saveWareHouseInfo } from '../../../redux/actions/warehouse_actions'

const WarehouseForm = ({ warehouse, fetchWareHouseInfo, saveWareHouseInfo, user }) => {
    const [warehouseData, setWarehouseData] = useState({
        name: '',
        address: '',
        city: '',
        phoneno: ''
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user?._id) {
            fetchWareHouseInfo(user._id);
        }
    }, [user, fetchWareHouseInfo]);

    useEffect(() => {
        if (warehouse) {
            setWarehouseData({
                name: warehouse.name || '',
                address: warehouse.address || '',
                city: warehouse.city || '',
                phoneno: warehouse.phoneno || ''
            });
        }
    }, [warehouse]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setWarehouseData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validate required fields
            if (!warehouseData.name) throw new Error('Warehouse name is required');
            if (!warehouseData.address) throw new Error('Address is required');
            if (!warehouseData.city) throw new Error('City is required');
            if (!warehouseData.phoneno) throw new Error('Phone number is required');

            await saveWareHouseInfo(user._id, warehouseData);
            message.success('Warehouse information updated successfully');
        } catch (err) {
            console.error('Update error:', err);
            message.error(err.message || 'Failed to update warehouse information');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="col-md-12">
            <div className="card">
                <div className="card-header">
                    <h5 className="card-title">Warehouse Address</h5>
                    <h6 className="card-subtitle text-muted">It should be dispatcher/return address.</h6>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="name">Warehouse Name *</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="name"
                                    name="name"
                                    value={warehouseData.name}
                                    onChange={handleChange}
                                    placeholder="Warehouse name"
                                    required 
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="address">Address *</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="address"
                                    name="address"
                                    value={warehouseData.address}
                                    onChange={handleChange}
                                    placeholder="Address"
                                    required 
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="city">City *</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="city"
                                    name="city"
                                    value={warehouseData.city}
                                    onChange={handleChange}
                                    placeholder="City"
                                    required 
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="phoneno">Phone Number *</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="phoneno"
                                    name="phoneno"
                                    value={warehouseData.phoneno}
                                    onChange={handleChange}
                                    placeholder="Phone number"
                                    required 
                                />
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
    )
}

WarehouseForm.propTypes = {
    warehouse: PropTypes.object,
    fetchWareHouseInfo: PropTypes.func.isRequired,
    saveWareHouseInfo: PropTypes.func.isRequired,
    user: PropTypes.object
}

const mapStateToProps = (state) => ({
    warehouse: state.warehouse.warehouse,
    user: state.auth.adminProfile
})

export default connect(mapStateToProps, { fetchWareHouseInfo, saveWareHouseInfo })(WarehouseForm)
