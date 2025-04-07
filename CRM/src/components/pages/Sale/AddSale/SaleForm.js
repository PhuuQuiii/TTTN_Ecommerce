import React, { useState } from "react";
import { Steps, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { createSale } from "../../../../redux/actions/sale_actions";

import AddProduct from "./AddProduct";
import AddInformation from "./AddInformation";

const { Step } = Steps;

const AddSale = () => {
  const dispatch = useDispatch();

  // Lấy adminId từ store (auth)
  const adminId = useSelector((state) => state.auth.authUser?._id);

  const [current, setCurrent] = useState(0);

  // Danh sách ID sản phẩm đã chọn ở bước 1
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Dữ liệu của form AddInformation có thể lưu tạm để hiển thị lại
  const [saleDetails, setSaleDetails] = useState({
    name: "",
    discountRate: 0,
    startTime: null,
    endTime: null,
  });

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  // Khi nhấn Submit ở AddInformation (bước 2)
  const handleCreateSale = (formValues) => {
    // formValues: { name, discountRate, startTime, endTime } từ AddInformation
    // Chuyển Date thành chuỗi ISO nếu cần
    const payload = {
      name: formValues.name,
      discountRate: Number(formValues.discountRate),
      products: selectedProducts,
      createdBy: adminId,
      startTime: formValues.startTime?.toISOString(), 
      endTime: formValues.endTime?.toISOString(),
    };

    dispatch(createSale(payload))
      .then(() => {
        message.success("Success!");
      })
      .catch((err) => {
        message.error("Error " + err);
      });
  };

  return (
    <>
      <Steps current={current}>
        <Step title="Choose Product" />
        <Step title="Detail" />
      </Steps>

      {/* Thêm div bọc và thêm margin-top để tạo khoảng cách */}
      <div style={{ marginTop: '30px' }}>
        {/* Bước 1: Chọn sản phẩm */}
        {current === 0 && (
          <AddProduct
            onSelectProduct={setSelectedProducts}
            next={next}
          />
        )}

        {/* Bước 2: Form điền thông tin sale */}
        {current === 1 && (
          <AddInformation
            saleDetails={saleDetails}
            setSaleDetails={setSaleDetails}
            prev={prev}
            onSubmit={handleCreateSale}
          />
        )}
      </div>
    </>
  );
};

export default AddSale;