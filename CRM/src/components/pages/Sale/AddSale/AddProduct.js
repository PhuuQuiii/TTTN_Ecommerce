import React, { useState, useEffect } from 'react';
import { Button, Pagination, Spin, Card, Checkbox, Row, Col } from 'antd';
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import { getProducts } from '../../../../redux/actions/product_actions';

const AddProduct = ({ adminId, products, totalCount, multiLoading, getProducts, onSelectProduct, next }) => {
  const [page, setPage] = useState(1);
  const [perPage] = useState(5);
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    if (adminId) {
      getProducts({ id: adminId, page, perPage });
    }
  }, [adminId, page, perPage, getProducts]);

  useEffect(() => {
    // Cập nhật danh sách sản phẩm đã chọn thông qua callback
    onSelectProduct(selectedProducts);
  }, [selectedProducts, onSelectProduct]);

  const handleProductSelect = (productId) => {
    setSelectedProducts(prevSelected => {
      // Kiểm tra xem sản phẩm đã được chọn chưa
      if (prevSelected.includes(productId)) {
        // Nếu đã chọn, bỏ chọn sản phẩm
        return prevSelected.filter(id => id !== productId);
      } else {
        // Nếu chưa chọn, thêm vào danh sách
        return [...prevSelected, productId];
      }
    });
  };

  const handleNext = () => {
    if (selectedProducts.length > 0) {
      next();
    } else {
      alert('Please select at least one product');
    }
  };

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  return (
    <>
      {multiLoading ? (
        <Spin tip="Loading products..." />
      ) : (
        <>
          <div style={{ marginTop: '20px', marginBottom: '20px' }}>
            {products.map((product) => {
              console.log('Product:', product); // Thêm console.log để kiểm tra dữ liệu sản phẩm
              return (
                <Card 
                  key={product._id} 
                  bordered={false}
                  style={{ 
                    marginBottom: '10px',
                    border: selectedProducts.includes(product._id) ? '1px solid #1890ff' : '1px solid #f0f0f0'
                  }}
                  onClick={() => handleProductSelect(product._id)}
                >
                  <Row align="middle">
                    <Col span={1}>
                      <Checkbox 
                        checked={selectedProducts.includes(product._id)}
                        onChange={() => handleProductSelect(product._id)}
                      />
                    </Col>
                    <Col span={5}>
                    {product.images && product.images.length > 0 ?(
                        <img 
                          src={`${process.env.REACT_APP_SERVER_URL}uploads/${product.images[0].thumbnail}`} 
                          alt={product.name} 
                          style={{ width: '100%', height: 'auto', maxWidth: '120px' }}
                        />
                      ) : (
                        <div style={{ 
                          width: '120px', 
                          height: '100px', 
                          backgroundColor: '#f0f0f0', 
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center' 
                        }}>
                          
                        </div>
                      )}
                    </Col>
                    <Col span={14} style={{ paddingLeft: '20px' }}>
                      <h3>{product.name}</h3>
                    </Col>
                    <Col span={4} style={{ textAlign: 'right' }}>
                    <h3> {product.price?.$numberDecimal ? parseFloat(product.price.$numberDecimal).toLocaleString() : 'N/A'} VND</h3>                    </Col>
                  </Row>
                </Card>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button 
              type="primary" 
              onClick={handleNext}
              disabled={selectedProducts.length === 0}
            >
              Next
            </Button>
            
            <div>
              {selectedProducts.length > 0 && (
                <span style={{ marginRight: '15px' }}>
                  Selected: {selectedProducts.length} product(s)
                </span>
              )}
            </div>
          </div>
          
          <Pagination
            current={page}
            total={totalCount}
            pageSize={perPage}
            onChange={handlePageChange}
            style={{ marginTop: '16px' }}
          />
        </>
      )}
    </>
  );
};

AddProduct.propTypes = {
  onSelectProduct: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired,
  adminId: PropTypes.string,
  products: PropTypes.array,
  totalCount: PropTypes.number,
  multiLoading: PropTypes.bool,
  getProducts: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  adminId: state.auth?.authUser?._id || null,
  products: state.product.products,
  totalCount: state.product.totalCount,
  multiLoading: state.product.multiLoading
});

export default connect(mapStateToProps, { getProducts })(AddProduct);