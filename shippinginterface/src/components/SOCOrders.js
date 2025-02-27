import axios from 'axios';
import React, { useEffect, useState } from 'react';

const SOCOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:3001/api/order/soc-orders', {
          headers: {
            Authorization: token
          }
        });
        setOrders(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <h1>Orders</h1>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th>Product</th>
            <th>Status</th>
            <th>Shipping Address</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.user.name}</td>
              <td>{order.product.name}</td>
              <td>{order.status.currentStatus}</td>
              <td>{order.shipto.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SOCOrders;
