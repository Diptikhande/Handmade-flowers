import React, { useEffect, useState } from 'react';
import { customOrderAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const ManageCustomOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await customOrderAPI.getAllCustomOrders();
      setOrders(data.data || []);
    } catch (error) {
      console.error('Failed to fetch custom orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await customOrderAPI.updateCustomOrder(id, { status });
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update order');
    }
  };

  if (loading) return <LoadingSpinner message="Loading custom orders..." />;

  return (
    <div className="manage-orders-page">
      <div className="container">
        <h1>Manage Custom Orders</h1>
        <div className="orders-container">
          <div className="orders-list">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Product Type</th>
                  <th>Quantity</th>
                  <th>Occasion</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.name}</td>
                    <td>{order.phone}</td>
                    <td>{order.productType}</td>
                    <td>{order.quantity}</td>
                    <td>{order.occasion}</td>
                    <td>{order.status}</td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      >
                        <option value="pending">pending</option>
                        <option value="approved">approved</option>
                        <option value="rejected">rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCustomOrders;
