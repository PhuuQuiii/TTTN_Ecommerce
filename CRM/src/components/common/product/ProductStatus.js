import { Checkbox, Popconfirm, Radio } from 'antd';
import axios from 'axios';
import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { approveProduct, disApproveProduct } from '../../../redux/actions/superadmin_action';

export const ProductStatus = ({ isSuperadmin, product, loading , approveProduct, disApproveProduct}) => {
    const [value, setValue] = useState(null)
    const [openRejectForm, setOpenRejectForm] = useState(false)
    const [rejectFormData, setRejectFormData] = useState('')
    const [openFeaturedConfirmation,setOpenFeaturedConfirmation] = useState(false)

    function onChange(e) {
        if (e.target.value === 'verify') {
            approveProduct(product.slug)
        }
        setValue(e.target.value)
    }
    function onFeaturedCheckboxClicked (e) {
        console.log(e,'onfeaturedclicked');
    }

    const handleRejectFormData = e => {
        setRejectFormData(e.target.value)
    }

    function makeProductFeatured() {
        if (!product?.slug) return;
    
        const token = localStorage.getItem("token");
    
        axios.put(`https://servertttn-production.up.railway.app/api/superadmin/featured-product/${product.slug}`, {}, {
            headers: {
                "x-auth-token": token,
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            console.log('✅ Product marked as featured:', response.data);
            
            // Cập nhật UI ngay lập tức
            product.isFeatured = true;  
            setOpenFeaturedConfirmation(false); // Đóng popconfirm sau khi xác nhận
        })
        .catch(error => {
            console.error('❌ Error marking product as featured:', error.response?.data || error);
        });
    }    

    //to be returned form 
    const rejectForm = () => {
        return (
            <div className="col-md-12">
                Remark:
                <textarea className="form-control" onChange={handleRejectFormData} name="comment" rows={2} placeholder="Reject reason" value={rejectFormData} required />
            </div>

        )
    }
    const rejectProduct = () => {
        rejectFormData && disApproveProduct(product.slug,rejectFormData)
    }
    return (
        <Fragment>

            <div className="mb-2">
                <p><strong>Status:</strong> {product && (
                    product.isDeleted && isSuperadmin ? <><span className="badge badge-pill badge-dark">deleted</span><span className="badge badge-pill badge-danger">unverified</span></> :
                    product.isRejected ? <><span className="badge badge-pill badge-warning">rejected</span><span className="badge badge-pill badge-danger">unverified</span></> :
                    product.isFeatured ? <><span className="badge badge-pill badge-secondary">featured</span><span className="badge badge-pill badge-success">verified</span></> :
                    !product.isVerified ? <span className="badge badge-pill badge-danger">unverified</span> :
                    product.isVerified ? <span className="badge badge-pill badge-success">verified</span> :
                    null
                )}
                </p>
                {
                    isSuperadmin && product && !product.isDeleted && !product.isRejected && !product.isVerified && !product.isFeatured && <Popconfirm
                        title={rejectForm}
                        visible={openRejectForm}
                        onConfirm={rejectProduct}
                        onCancel={() => setOpenRejectForm(false)}
                        okButtonProps={{ loading }}
                        okText="Submit"
                        cancelText="Cancel"
                    >
                        <Radio.Group onChange={onChange} value={value}>
                            <Radio disabled={loading} value={'verify'}>Verify</Radio>
                            <Radio disabled={loading} checked={false} onClick={() => setOpenRejectForm(true)} value={'reject'}>Reject</Radio>
                        </Radio.Group>
                    </Popconfirm>
                }
                {
                    isSuperadmin && product && !product.isDeleted && !product.isRejected && product.isVerified && !product.isFeatured && <Popconfirm
                        title={"Are you sure to make it featured?"}
                        visible={openFeaturedConfirmation}
                        onConfirm={makeProductFeatured}
                        onCancel={() => setOpenFeaturedConfirmation(false)}
                        okButtonProps={{ loading }}
                        okText="Ok"
                        cancelText="Cancel"
                    >
<Checkbox
    disabled={loading}
    onChange={() => setOpenFeaturedConfirmation(true)}
>
    Make it Featured
</Checkbox>
                    </Popconfirm>
                }
            </div>

        </Fragment>
    )
}

ProductStatus.propTypes = {
    product: PropTypes.object,
    isSuperadmin: PropTypes.bool,
    loading: PropTypes.bool,
}

const mapStateToProps = (state) => ({
    loading: state.product.toggleProductApprovalLoading
})

const mapDispatchToProps = {
    approveProduct,
    disApproveProduct
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductStatus)
