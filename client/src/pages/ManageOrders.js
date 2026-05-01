import React, { useEffect, useState } from 'react';
import { orderAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './ManageOrders.css';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

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

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: 'pending', text: '⏳ Pending' },
      approved: { class: 'approved', text: '✓ Approved' },
      rejected: { class: 'rejected', text: '✕ Rejected' },
    };
    return badges[status] || badges.pending;
  };

  return (
    <div className="manage-orders-page">
      <div className="container">
        <h1>Manage Orders</h1>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="orders-container">
            {/* Orders List */}
            <div className="orders-list">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <code>{order.transactionId}</code>
                      </td>
                      <td>{order.customerName}</td>
                      <td>{order.productName}</td>
                      <td>₹{order.amount}</td>
                      <td>
                        <span className={`badge ${getStatusBadge(order.status).class}`}>
                          {getStatusBadge(order.status).text}
                        </span>
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="btn btn-secondary btn-small"
                          onClick={() => setSelectedOrder(order)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Order Details */}
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
                    <span className="label">Amount:</span>
                    <span className="value">₹{selectedOrder.amount}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Status:</span>
                    <span className={`badge ${getStatusBadge(selectedOrder.status).class}`}>
                      {getStatusBadge(selectedOrder.status).text}
                    </span>
                  </div>
                </div>

                {/* Payment Screenshot */}
                <div className="payment-screenshot">
                  <h3>Payment Screenshot</h3>
                  <img src={selectedOrder.paymentScreenshot} alt="Payment Screenshot" />
                </div>

                {/* Actions */}
                {selectedOrder.status === 'pending' && (
                  <div className="action-section">
                    <button
                      className="btn btn-success"
                      onClick={() => handleApprove(selectedOrder._id)}
                    >
                      ✓ Approve Order
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
                        ✕ Reject Order
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
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageOrders;
