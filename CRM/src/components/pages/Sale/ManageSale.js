import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getAllSales } from "../../../redux/actions/sale_actions";
import { Table, Spin } from "antd";

function ManageSale({ sales, loading, getAllSales }) {
  useEffect(() => {
    getAllSales();
  }, [getAllSales]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Return original if invalid
    
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
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
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    // Format with date and time
    return `${month} ${day}${suffix} ${year} ${hours}:${minutes}:${seconds}`;
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Products",
      key: "products",
      render: (_, record) => {
        // Hiển thị tất cả sản phẩm trong mảng products
        if (Array.isArray(record?.products) && record.products.length > 0) {
          return record.products.map((p) => p.name || "Unnamed").join(", ");
        }
        return "No product";
      },
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
    </div>
  );
}

const mapStateToProps = (state) => ({
  sales: state.sale.sales,
  loading: state.sale.loading,
});

export default connect(mapStateToProps, { getAllSales })(ManageSale);
