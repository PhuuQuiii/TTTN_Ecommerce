import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Card, Typography, Carousel } from 'antd';
import { FireOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { getActiveSales } from '../../redux/actions/saleActions';
import { IMAGE_BASE_URL } from "../../utils/constants";
import Link from "next/link";

const { Title, Text } = Typography;

const FlashSaleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const FlashSaleTitle = styled.div`
  display: flex;
  align-items: center;
`;

const FlashSaleText = styled(Title)`
  color: #f5222d !important;
  margin-right: 15px !important;
  margin-bottom: 0 !important;
`;

const TimerBox = styled.span`
  background-color: #000;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  margin: 0 2px;
  font-weight: bold;
`;

const ProductCard = styled(Card)`
  position: relative;
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
  height: 100%;
  display: flex;
  flex-direction: column;
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-5px);
  }
  .ant-card-body {
    padding: 12px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
  .ant-card-cover {
    overflow: hidden;
    width: 100%;
    position: relative;
    padding-top: 75%; /* 4:3 aspect ratio */
  }
`;

const ImageContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #f5f5f5;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.5s ease;
  &:hover {
    transform: scale(1.05);
  }
`;

const DiscountBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #f5222d;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: bold;
  display: flex;
  align-items: center;
  z-index: 1;
`;

const PriceText = styled(Text)`
  color: #f5222d;
  font-weight: bold;
  font-size: 18px;
  margin-top: auto;
`;

const ProductTitle = styled(Title)`
  min-height: 48px;
  margin-bottom: 12px !important;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;



const FlashSale = () => {
  const dispatch = useDispatch();
  const { activeSales, loading, error } = useSelector((state) => state.sale);

  const [countdown, setCountdown] = useState({ hours: 0, minutes: 3, seconds: 3 });

  useEffect(() => {
    dispatch(getActiveSales());
  }, [dispatch]);


  const formatCurrency = (value) => new Intl.NumberFormat('vi-VN').format(value);

  const responsiveSettings = { xs: 12, sm: 12, md: 8, lg: 8, xl: 4, xxl: 4 };

  if (loading) return <div>Đang tải dữ liệu Flash Sale...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  // Gom sale + product
  const allItems = Array.isArray(activeSales)
  ? activeSales
      .map((sale) =>
        (sale.products || []).map((product) => ({ sale, product }))
      )
      .flat()
  : [];

  return (
    <div className="flash-sale-container" style={{ padding: '20px 0' }}>
      <FlashSaleHeader>
        <FlashSaleTitle>
          <FlashSaleText level={3}>
            <FireOutlined style={{ marginRight: 8 }} />
            FLASH SALE
          </FlashSaleText>
        </FlashSaleTitle>
      </FlashSaleHeader>

      {/* Desktop view */}
      <div className="desktop-view" style={{ display: 'block' }}>
        <Row gutter={[16, 16]}>
          {allItems.map(({ sale, product }, index) => {
            const originalPrice = parseFloat(product.price?.$numberDecimal) || 999000;
            const discountRate = sale.discountRate || 20;
            const discountedPrice = originalPrice * (1 - discountRate / 100);

            return (
            <Col key={index} {...responsiveSettings}>
                    <Link href={`/products/${product.slug}`}>
                    <a>
                <ProductCard
                  hoverable
                  cover={
                    <ImageContainer>
                      <DiscountBadge>
                        <FireOutlined style={{ marginRight: 4 }} />
                        -{sale.discountRate || 20}%
                      </DiscountBadge>
                      {product.images && product.images.length > 0 ? (
                        <ProductImage
                          src={`${IMAGE_BASE_URL}/${product.images[0]._id.medium}`}
                          alt={product.name || 'Sản phẩm'}
                        />
                      ) : (
                        <ProductImage
                          src="https://via.placeholder.com/300x225"
                          alt="Placeholder"
                        />
                      )}
                    </ImageContainer>
                  }
                >
                  <ProductTitle level={4} ellipsis={{ rows: 2 }}>
                    {product.name || 'Tên sản phẩm'}
                  </ProductTitle>
                  <PriceText>
                    $ {formatCurrency(discountedPrice)}
                  </PriceText>
                  {/* <StatusBadge status="SELLING_FAST">ĐANG BÁN CHẠY</StatusBadge> */}
                </ProductCard>
                    </a>
                    </Link>
              </Col>
            );
          })}
        </Row>
      </div>

      {/* Mobile view */}
      <div className="mobile-view" style={{ display: 'none' }}>
        <Carousel autoplay>
          {allItems.map(({ sale, product }, index) => {
            const originalPrice = parseFloat(product.price?.$numberDecimal) || 999000;
            const discountRate = sale.discountRate || 20;
            const discountedPrice = originalPrice * (1 - discountRate / 100);

            return (
              <div key={index}>
                <Link href={`/products/${product.slug}`}>
                <a>
                <ProductCard
                  hoverable
                  cover={
                    <ImageContainer>
                      <DiscountBadge>
                        <FireOutlined style={{ marginRight: 4 }} />
                        -{sale.discountRate || 20}%
                      </DiscountBadge>
                      {product.images && product.images.length > 0 ? (
                        <ProductImage
                          src={`${IMAGE_BASE_URL}/${product.images[0]._id.medium}`}
                          alt={product.name || 'Sản phẩm'}
                        />
                      ) : (
                        <ProductImage
                          src="https://via.placeholder.com/300x225"
                          alt="Placeholder"
                        />
                      )}
                    </ImageContainer>
                  }
                >
                  <ProductTitle level={4} ellipsis={{ rows: 2 }}>
                    {product.name || 'Tên sản phẩm'}
                  </ProductTitle>
                  <PriceText>
                    ₫{formatCurrency(discountedPrice)}
                  </PriceText>
                  {/* <StatusBadge status="SELLING_FAST">ĐANG BÁN CHẠY</StatusBadge> */}
                </ProductCard>
                </a>
            </Link>
              </div>
            );
          })}
        </Carousel>
      </div>

      <style jsx global>{`
        @media (max-width: 767px) {
          .desktop-view {
            display: none !important;
          }
          .mobile-view {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};

export default FlashSale;