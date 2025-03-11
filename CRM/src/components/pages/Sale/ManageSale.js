import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getAllSales } from "../../../redux/actions/sale_actions";
import { Table, Spin } from "antd";

function ManageSale({ sales, loading, getAllSales }) {
  useEffect(() => {
    getAllSales(); 
  }, [getAllSales]);

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Discount Rate",
      dataIndex: "discountRate",
      key: "discountRate",
      render: (rate) => `${rate}%`
    },
    {
      title: "StartTime",
      dataIndex: "startTime",
      key: "startTime"
    },
    {
      title: "EndTime",
      dataIndex: "endTime",
      key: "endTime"
    }
    // Thêm cột product list, v.v. tuỳ bạn 
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