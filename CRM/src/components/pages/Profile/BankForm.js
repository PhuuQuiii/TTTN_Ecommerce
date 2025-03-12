import { message, Spin } from 'antd'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { fetchBankInfo, saveBankInfo } from '../../../redux/actions/bank_actions'

const BankForm = ({ bank, saveBankInfo, fetchBankInfo, user }) => {
    console.log('BankForm Props:', { bank, user }); // Debug log for props

    const [adminBank, setAdminBank] = useState({
        accountHolder: '',
        bankName: '',
        branchName: '',
        accountNumber: '',
        routingNumber: '',
        chequeCopy: null
    })
    
    const [loading, setLoading] = useState(false)
    const [fetchLoading, setFetchLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const loadBankInfo = async () => {
            if (user?._id) {
                console.log('Loading bank info for user:', user._id)
                setFetchLoading(true)
                setError(null)
                try {
                    const result = await fetchBankInfo(user._id)
                    console.log('Fetch result:', result)
                } catch (err) {
                    console.error('Error fetching bank info:', err)
                    setError(err.message || 'Failed to load bank information')
                } finally {
                    setFetchLoading(false)
                }
            }
        }
        loadBankInfo()
    }, [user, fetchBankInfo])

    useEffect(() => {
        console.log('Bank data received in effect:', bank)
        if (bank) {
            console.log('Setting bank data to state:', bank)
            setAdminBank(prevState => {
                const newState = {
                    ...prevState,
                    accountHolder: bank.accountHolder || '',
                    bankName: bank.bankName || '',
                    branchName: bank.branchName || '',
                    accountNumber: bank.accountNumber || '',
                    routingNumber: bank.routingNumber || ''
                };
                console.log('New admin bank state:', newState);
                return newState;
            })
        }
    }, [bank])

    const onChange = e => {
        const { name, type, files, value } = e.target
        setAdminBank(prevState => ({ 
            ...prevState, 
            [name]: type === 'file' ? files[0] : value 
        }))
    }

    const onSubmit = async e => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            // Validate required fields
            if (!adminBank.accountHolder) throw new Error('Account holder name is required')
            if (!adminBank.bankName) throw new Error('Bank name is required')
            if (!adminBank.accountNumber) throw new Error('Account number is required')

            const formData = new FormData()
            
            // Append all text fields
            formData.append('accountHolder', adminBank.accountHolder)
            formData.append('bankName', adminBank.bankName)
            formData.append('branchName', adminBank.branchName || '')
            formData.append('accountNumber', adminBank.accountNumber)
            formData.append('routingNumber', adminBank.routingNumber || '')
            
            // Append file if selected
            if (adminBank.chequeCopy) {
                formData.append('chequeCopy', adminBank.chequeCopy)
            }

            const result = await saveBankInfo(formData, user._id)
            console.log('Update result:', result)
            message.success('Bank information updated successfully')
        } catch (err) {
            console.error('Update error:', err)
            setError(err.message || 'Failed to update bank information')
            message.error(err.message || 'Failed to update bank information')
        } finally {
            setLoading(false)
        }
    }
   
    if (fetchLoading) {
        return (
            <div className="col-md-12 text-center p-5">
                <Spin size="large" />
            </div>
        )
    }

    if (error && !bank) {
        return (
            <div className="col-md-12">
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            </div>
        )
    }

    return (
        <div className="col-md-12">
            <div className="card">
                <div className="card-header">
                    <h5 className="card-title">Bank Account</h5>
                </div>
                <div className="card-body">
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}
                    <form onSubmit={onSubmit}>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="inputEmail4">Account Holder Name *</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="inputEmail4" 
                                    placeholder="Account holder name" 
                                    name="accountHolder"
                                    value={adminBank.accountHolder}
                                    onChange={onChange}
                                    required
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="add">Bank Name *</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="add" 
                                    placeholder="Bank name" 
                                    name="bankName"
                                    value={adminBank.bankName}
                                    onChange={onChange}
                                    required
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="dist">Branch Name</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="dist" 
                                    placeholder="Branch name" 
                                    name="branchName"
                                    value={adminBank.branchName}
                                    onChange={onChange}
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="inputPassword4">Account Number *</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="inputPassword4" 
                                    placeholder="Account number"
                                    name="accountNumber"
                                    value={adminBank.accountNumber}
                                    onChange={onChange}
                                    required
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="inputPassword">Routing Number</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="inputPassword" 
                                    placeholder="Routing number" 
                                    name="routingNumber"
                                    value={adminBank.routingNumber}
                                    onChange={onChange}
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="exampleFormControlFile1">Cheque Copy</label>
                                <input 
                                    type="file" 
                                    className="form-control-file" 
                                    id="exampleFormControlFile1" 
                                    name="chequeCopy"
                                    onChange={onChange}
                                    accept="image/*"
                                />
                                {bank?.chequeCopy && (
                                    <div className="mt-2">
                                        <p className="mb-1">Current cheque copy:</p>
                                        <img 
                                            src={`${process.env.REACT_APP_SERVER_URL}/uploads/${bank.chequeCopy}`}
                                            alt="Current cheque copy"
                                            style={{ maxWidth: '200px', height: 'auto' }}
                                            className="img-thumbnail"
                                        />
                                    </div>
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
    )
}

BankForm.propTypes = {
    bank: PropTypes.object,
    saveBankInfo: PropTypes.func.isRequired,
    fetchBankInfo: PropTypes.func.isRequired,
    user: PropTypes.object
}

const mapStateToProps = (state) => ({
    bank: state.bank.bank,
    user: state.auth.adminProfile
})

export default connect(mapStateToProps, { saveBankInfo, fetchBankInfo })(BankForm)
