import axios from 'axios';
import React, { useEffect, useState } from 'react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:3001/api/order/admin-orders', {
          headers: {
            Authorization: token
          }
        });
        setOrders(response.data.orders);
      } catch (error) {
        console.error(error);
      }
    };
    fetchOrders();
  }, []);

  const handleConfirm = async (orderId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`http://localhost:3001/api/order/confirm/${orderId}`, {}, {
        headers: {
          Authorization: token
        }
      });
      alert('Order confirmed');
      // Cập nhật lại danh sách đơn hàng
      setOrders(orders.map(order => order._id === orderId ? { ...order, status: { ...order.status, currentStatus: 'confirmed' } } : order));
    } catch (error) {
      console.error(error);
      alert('Failed to confirm order');
    }
  };

  return (
    <div>
      <h1>Admin Orders</h1>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th>Product</th>
            <th>Status</th>
            <th>Shipping Address</th>
            <th>Actions</th>
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
              <td>
                {order.status.currentStatus === 'active' && (
                  <button onClick={() => handleConfirm(order._id)}>Confirm</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;
