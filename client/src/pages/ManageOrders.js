import React, { useEffect, useState } from 'react';
import { orderAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './ManageOrders.css';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await orderAPI.getAllOrders();
      setOrders(data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (window.confirm('Approve this order?')) {
      try {
        await orderAPI.approveOrder(id);
        fetchOrders();
        setSelectedOrder(null);
      } catch (error) {
        console.error('Failed to approve order:', error);
        alert('Error approving order');
      }
    }
  };

  const handleReject = async (id) => {
    if (!rejectReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    if (window.confirm('Reject this order?')) {
      try {
        await orderAPI.rejectOrder(id, { reason: rejectReason });
        fetchOrders();
        setSelectedOrder(null);
        setRejectReason('');
      } catch (error) {
        console.error('Failed to reject order:', error);
        alert('Error rejecting order');
      }
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    if (!newStatus) return;
    
    try {
      if (newStatus === 'approved') {
        await orderAPI.approveOrder(id);
      } else if (newStatus === 'rejected') {
        const reason = prompt('Please provide a reason for rejection:');
        if (!reason) return;
        await orderAPI.rejectOrder(id, { reason });
      } else if (newStatus === 'in-progress' || newStatus === 'delivered') {
        // For these statuses, we can update directly via API
        await orderAPI.updateOrderStatus(id, { status: newStatus });
      }
      fetchOrders();
      if (selectedOrder?._id === id) {
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('Error updating order status');
    }
  };

  const handleRemoveOrder = async (id) => {
    const reason = prompt('Please provide a reason for removing this order:');
    if (!reason) return;

    if (window.confirm('Remove this order? This will notify the customer.')) {
      try {
        await orderAPI.rejectOrder(id, { reason });
        fetchOrders();
        setSelectedOrder(null);
      } catch (error) {
        console.error('Failed to remove order:', error);
        alert('Error removing order');
      }
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: 'pending', text: '⏳ Pending' },
      approved: { class: 'approved', text: '✓ Approved' },
      rejected: { class: 'rejected', text: '✕ Rejected' },
      'in-progress': { class: 'in-progress', text: '⚙ In Progress' },
      delivered: { class: 'delivered', text: '📦 Delivered' },
    };
    return badges[status] || badges.pending;
  };

  const filteredOrders = statusFilter === 'all' ? orders : orders.filter(o => o.status === statusFilter);

  return (
    <div className="manage-orders-page">
      <div className="container">
        <h1>Manage Orders</h1>

        {loading ? (
          <LoadingSpinner />
        ) : (
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
                <option value="delivered">Delivered</option>
              </select>
            </div>

            {/* Order Details Panel - Shows at TOP when selected */}
            {selectedOrder && (
              <div className="order-details-panel">
                <div className="panel-header">
                  <h2>Order Details</h2>
                  <button
                    className="close-button"
                    onClick={() => {
                      setSelectedOrder(null);
                      setRejectReason('');
                    }}
                  >
                    ✕
                  </button>
                </div>

                {/* Order Info */}
                <div className="order-info">
                  <div className="info-row">
                    <span className="label">Transaction ID:</span>
                    <span className="value">{selectedOrder.transactionId}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Customer Name:</span>
                    <span className="value">{selectedOrder.customerName}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Phone:</span>
                    <span className="value">{selectedOrder.phone}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Address:</span>
                    <span className="value">{selectedOrder.address}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Product:</span>
                    <span className="value">{selectedOrder.productName}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Quantity:</span>
                    <span className="value">{selectedOrder.quantity}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Amount:</span>
                    <span className="value">₹{selectedOrder.amount}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Status:</span>
                    <span className={`badge ${getStatusBadge(selectedOrder.status).class}`}>
                      {getStatusBadge(selectedOrder.status).text}
                    </span>
                  </div>
                  {selectedOrder.rejectionReason && (
                    <div className="info-row">
                      <span className="label">Cancellation Reason:</span>
                      <span className="value">{selectedOrder.rejectionReason}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {selectedOrder.status === 'pending' && (
                  <div className="action-section">
                    <div className="status-update">
                      <label>Update Status:</label>
                      <select 
                        onChange={(e) => handleUpdateStatus(selectedOrder._id, e.target.value)}
                        defaultValue=""
                      >
                        <option value="">-- Select Action --</option>
                        <option value="approved">Approve Order</option>
                        <option value="rejected">Reject Order</option>
                      </select>
                    </div>

                    <button
                      className="btn btn-danger"
                      onClick={() => handleRemoveOrder(selectedOrder._id)}
                    >
                      🗑 Remove Order
                    </button>

                    <div className="reject-section">
                      <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Reason for rejection (e.g., Invalid payment, Screenshot unclear)"
                        rows="3"
                      ></textarea>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleReject(selectedOrder._id)}
                      >
                        ✕ Reject Order (with reason above)
                      </button>
                    </div>
                  </div>
                )}

                {selectedOrder.status === 'rejected' && selectedOrder.rejectionReason && (
                  <div className="rejection-info">
                    <h3>Rejection Reason:</h3>
                    <p>{selectedOrder.rejectionReason}</p>
                  </div>
                )}
              </div>
            )}

            {/* Orders Table - Full Width */}
            <div className="orders-list">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Amount</th>
                    <th>Qty</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="empty-message">No orders found</td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order._id}>
                        <td>
                          <code>{order.transactionId?.slice(0, 12)}...</code>
                        </td>
                        <td>{order.customerName}</td>
                        <td>{order.productName}</td>
                        <td>₹{order.amount}</td>
                        <td>{order.quantity}</td>
                        <td>
                          <select 
                            value={order.status}
                            onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                            className={`status-select status-${order.status}`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <option value="">-- Select --</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="in-progress">In Progress</option>
                            <option value="delivered">Delivered</option>
                            <option value="rejected">Rejected</option>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageOrders;
