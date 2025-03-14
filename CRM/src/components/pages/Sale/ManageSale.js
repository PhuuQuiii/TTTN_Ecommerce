import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  getSalesByAdminId,
  deleteSale,
} from "../../../redux/actions/sale_actions";
import { Table, Spin, Space, Modal, List, Popconfirm, message } from "antd";

function ManageSale({
  sales,
  loading,
  getSalesByAdminId,
  deleteSale,
  adminId,
}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    if (adminId) {
      getSalesByAdminId(adminId);
    }
  }, [getSalesByAdminId, adminId]);

  useEffect(() => {
    console.log("Current adminId:", adminId);
    if (adminId) {
      console.log("Fetching sales for admin:", adminId);
      getSalesByAdminId(adminId);
    }
  }, [getSalesByAdminId, adminId]);

  useEffect(() => {
    console.log("Sales data:", sales);
  }, [sales]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Return original if invalid

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    // Add ordinal suffix to day (1st, 2nd, 3rd, etc.)
    let suffix = "th";
    if (day % 10 === 1 && day !== 11) suffix = "st";
    else if (day % 10 === 2 && day !== 12) suffix = "nd";
    else if (day % 10 === 3 && day !== 13) suffix = "rd";

    // Get time components
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    // Format with date and time
    return `${month} ${day}${suffix} ${year} ${hours}:${minutes}:${seconds}`;
  };

  const showModal = (products) => {
    setSelectedProducts(products);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDeleteSale = async (saleId) => {
    try {
      await deleteSale(saleId);
      message.success("Sale deleted successfully");
      // Refresh the sales list after deletion
      if (adminId) {
        getSalesByAdminId(adminId);
      }
    } catch (error) {
      message.error("Failed to delete sale");
      console.error("Delete sale error:", error);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Discount Rate",
      dataIndex: "discountRate",
      key: "discountRate",
      render: (rate) => `${rate}%`,
    },
    {
      title: "StartTime",
      dataIndex: "startTime",
      key: "startTime",
      render: (startTime) => formatDate(startTime),
    },
    {
      title: "EndTime",
      dataIndex: "endTime",
      key: "endTime",
      render: (endTime) => formatDate(endTime),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <button
            className="btn btn-info btn-sm"
            onClick={() => showModal(record.products)}
          >
            <i className="fas fa-eye"></i>
          </button>

          <Popconfirm
            title="Are you sure you want to delete this sale?"
            onConfirm={() => handleDeleteSale(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <button className="btn btn-danger btn-sm">
              <i className="fas fa-trash"></i>
            </button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      {loading ? (
        <Spin />
      ) : (
        <Table
          dataSource={sales}
          columns={columns}
          rowKey={(record) => record._id}
        />
      )}
      <Modal
        title="Product Details"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <List
          itemLayout="horizontal"
          dataSource={selectedProducts}
          renderItem={(product) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <img
                    src={`${process.env.REACT_APP_SERVER_URL}/uploads/${product.images[0]._id.thumbnail}`}
                    alt={product.name}
                    style={{ width: 100, height: "auto", objectFit: "cover" }}
                  />
                }
                title={product.name}
                description={
                  <>
                    <p>
                      <strong>Price:</strong> {product.price.$numberDecimal}
                    </p>
                  </>
                }
              />
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    sales: state.sale.salesByAdmin, // Changed from state.sale.sales
    loading: state.sale.loading,
    adminId: state.auth && state.auth.authUser ? state.auth.authUser._id : null,
  };
};
export default connect(mapStateToProps, { getSalesByAdminId, deleteSale })(
  ManageSale
);