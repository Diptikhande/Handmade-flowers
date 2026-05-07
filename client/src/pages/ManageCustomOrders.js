import React, { useEffect, useState } from 'react';
import { customOrderAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './ManageCustomOrders.css';

const ManageCustomOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

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
    if (!status) return;

    const reason = status === 'rejected' ? prompt('Please provide a reason for rejection:') : null;
    if (status === 'rejected' && !reason) return;

    try {
      const payload = status === 'rejected' ? { status, rejectionReason: reason } : { status };
      await customOrderAPI.updateCustomOrder(id, payload);
      fetchOrders();
      setSelectedOrder(null);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update order');
    }
  };

  const handleRemoveOrder = (id) => {
    const reason = prompt('Reason for removing this order:');
    if (!reason) return;

    if (window.confirm('Remove this order?')) {
      handleStatusUpdate(id, 'rejected');
    }
  };

  const filteredOrders = statusFilter === 'all' ? orders : orders.filter(o => o.status === statusFilter);

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f39c12',
      approved: '#27ae60',
      rejected: '#e74c3c',
    };
    return colors[status] || '#95a5a6';
  };

  if (loading) return <LoadingSpinner message="Loading custom orders..." />;

  return (
    <div className="manage-custom-orders-page">
      <div className="container">
        <h1>Manage Custom Orders</h1>

        <div className="orders-wrapper">
          {/* Status Filter */}
          <div className="filter-bar">
            <label>Filter by Status:</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="in-progress">In Progress</option>
            </select>
          </div>

          {/* Custom Orders Table - Full Width */}
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
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="empty-message">No custom orders found</td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order._id}>
                      <td>{order.name}</td>
                      <td>{order.phone}</td>
                      <td>{order.productType}</td>
                      <td>{order.quantity}</td>
                      <td>{order.occasion}</td>
                      <td>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          className="status-select"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <option value="">-- Select --</option>
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                          <option value="in-progress">In Progress</option>
                        </select>
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-secondary btn-small"
                            onClick={() => setSelectedOrder(order)}
                          >
                            View
                          </button>
                          <button
                            className="btn btn-danger btn-small"
                            onClick={() => handleRemoveOrder(order._id)}
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Order Details Panel */}
          {selectedOrder && (
            <div className="order-details-panel">
              <div className="panel-header">
                <h2>Order Details</h2>
                <button
                  className="close-button"
                  onClick={() => setSelectedOrder(null)}
                >
                  ✕
                </button>
              </div>

              <div className="order-info">
                <div className="info-row">
                  <span className="label">Name:</span>
                  <span className="value">{selectedOrder.name}</span>
                </div>
                <div className="info-row">
                  <span className="label">Email:</span>
                  <span className="value">{selectedOrder.email}</span>
                </div>
                <div className="info-row">
                  <span className="label">Phone:</span>
                  <span className="value">{selectedOrder.phone}</span>
                </div>
                <div className="info-row">
                  <span className="label">Product Type:</span>
                  <span className="value">{selectedOrder.productType}</span>
                </div>
                <div className="info-row">
                  <span className="label">Quantity:</span>
                  <span className="value">{selectedOrder.quantity}</span>
                </div>
                <div className="info-row">
                  <span className="label">Occasion:</span>
                  <span className="value">{selectedOrder.occasion}</span>
                </div>
                <div className="info-row">
                  <span className="label">Budget:</span>
                  <span className="value">₹{selectedOrder.budget}</span>
                </div>
                <div className="info-row">
                  <span className="label">Special Requirements:</span>
                  <span className="value">{selectedOrder.specialRequirements || 'None'}</span>
                </div>
                <div className="info-row">
                  <span className="label">Status:</span>
                  <span className="value">
                    <span style={{ backgroundColor: getStatusColor(selectedOrder.status), color: 'white', padding: '4px 12px', borderRadius: '20px', fontWeight: '600' }}>
                      {selectedOrder.status.toUpperCase()}
                    </span>
                  </span>
                </div>
                {selectedOrder.rejectionReason && (
                  <div className="info-row">
                    <span className="label">Rejection Reason:</span>
                    <span className="value">{selectedOrder.rejectionReason}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageCustomOrders;
