import React from "react";
import { Form, Input, DatePicker, Button } from "antd";
import PropTypes from "prop-types";

const AddInformation = ({ saleDetails, setSaleDetails, onSubmit, prev }) => {
  const [form] = Form.useForm();

  const handleFinish = (values) => {
    // Khi người dùng bấm Submit, ta gọi hàm onSubmit do SaleForm truyền vào
    onSubmit(values);
  };

  const handlePrevious = () => {
    prev();
  };

  return (
    <>
      <Form
        form={form}
        name="detail_information"
        onFinish={handleFinish}
        initialValues={{
          // Nếu cần hiển thị lại giá trị cũ (chỉnh sửa), có thể map saleDetails vào
          name: saleDetails.name,
          discountRate: saleDetails.discountRate,
          startTime: saleDetails.startTime,
          endTime: saleDetails.endTime,
        }}
      >
        <Form.Item
          label="Name of sale"
          name="name"
          rules={[{ required: true, message: "Please enter name sale!" }]}
        >
          <Input placeholder="Ví dụ: Sale Mùa Hè Sôi Động" />
        </Form.Item>

        <Form.Item
          label="Discount rate (%)"
          name="discountRate"
          rules={[{ required: true, message: "Please enter discount sale!!" }]}
        >
          <Input type="number" placeholder="0 - 100" />
        </Form.Item>

        <Form.Item
          label="Time start"
          name="startTime"
          rules={[{ required: true, message: "Please enter time sale!" }]}
        >
          {/* DatePicker showTime cho phép chọn cả ngày lẫn giờ */}
          <DatePicker showTime style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Time end"
          name="endTime"
          rules={[{ required: true, message: "Please enter time sale!" }]}
        >
          <DatePicker showTime style={{ width: "100%" }} />
        </Form.Item>

        <div className="steps-action" style={{ marginTop: 20 }}>
          <Button style={{ marginRight: 8 }} onClick={handlePrevious}>
            Previous
          </Button>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </div>
      </Form>
    </>
  );
};

AddInformation.propTypes = {
  saleDetails: PropTypes.object.isRequired,
  setSaleDetails: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  prev: PropTypes.func.isRequired,
};

export default AddInformation;