import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './OrderStatus.css';

const OrderStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const transactionId = location.state?.transactionId || '';

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState(transactionId);

  useEffect(() => {
    if (transactionId) {
      fetchOrderStatus(transactionId);
    } else {
      setLoading(false);
    }
  }, [transactionId]);

  const fetchOrderStatus = async (id) => {
    try {
      setLoading(true);
      const { data } = await orderAPI.getOrderByTransactionId(id);
      setOrder(data.data);
    } catch (error) {
      console.error('Failed to fetch order:', error);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchId.trim()) {
      fetchOrderStatus(searchId);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'approved') return 'approved';
    if (status === 'rejected') return 'rejected';
    return 'pending';
  };

  const getStatusIcon = (status) => {
    if (status === 'approved') return '✓';
    if (status === 'rejected') return '✕';
    return '⏳';
  };

  return (
    <div className="order-status-page">
      <div className="container">
        {/* Header */}
        <div className="status-header">
          <h1>Order Status</h1>
          <p>Check your order status using your transaction ID</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter your transaction ID (e.g., UPI123456789)"
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>

        {/* Order Status Card */}
        {loading ? (
          <LoadingSpinner message="Loading order details..." />
        ) : order ? (
          <div className="status-card">
            {/* Status Badge */}
            <div className={`status-badge ${getStatusColor(order.status)}`}>
              <span className="status-icon">{getStatusIcon(order.status)}</span>
              <span className="status-text">{order.statusMessage}</span>
            </div>

            {/* Order Details */}
            <div className="order-details">
              <div className="detail-row">
                <span className="label">Transaction ID:</span>
                <span className="value">{order.transactionId}</span>
              </div>

              <div className="detail-row">
                <span className="label">Product:</span>
                <span className="value">{order.productName}</span>
              </div>

              <div className="detail-row">
                <span className="label">Amount:</span>
                <span className="value">₹{order.amount}</span>
              </div>

              <div className="detail-row">
                <span className="label">Customer Name:</span>
                <span className="value">{order.customerName}</span>
              </div>

              <div className="detail-row">
                <span className="label">Phone:</span>
                <span className="value">{order.phone}</span>
              </div>

              <div className="detail-row">
                <span className="label">Delivery Address:</span>
                <span className="value">{order.address}</span>
              </div>

              <div className="detail-row">
                <span className="label">Order Date:</span>
                <span className="value">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>

              {order.status === 'rejected' && order.rejectionReason && (
                <div className="rejection-reason">
                  <h3>Rejection Reason:</h3>
                  <p>{order.rejectionReason}</p>
                </div>
              )}
            </div>

            {/* Status Timeline */}
            <div className="status-timeline">
              <h3>Order Timeline</h3>
              <div className="timeline">
                <div className={`timeline-item ${['pending', 'approved', 'rejected'].includes(order.status) ? 'completed' : ''}`}>
                  <span className="timeline-dot"></span>
                  <span className="timeline-label">Order Submitted</span>
                </div>
                <div className={`timeline-item ${order.status === 'approved' || order.status === 'rejected' ? 'completed' : ''}`}>
                  <span className="timeline-dot"></span>
                  <span className="timeline-label">Payment Verification</span>
                </div>
                <div className={`timeline-item ${order.status === 'approved' ? 'completed' : ''}`}>
                  <span className="timeline-dot"></span>
                  <span className="timeline-label">Order Confirmed</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              {order.status === 'pending' && (
                <p className="info-message">
                  ⏳ Your order is being verified. We'll update you soon.
                </p>
              )}
              {order.status === 'approved' && (
                <p className="success-message">
                  ✓ Your order has been confirmed! We'll contact you with delivery details.
                </p>
              )}
              {order.status === 'rejected' && (
                <p className="error-message">
                  ✕ Unfortunately, your payment could not be verified. Please try again.
                </p>
              )}

              <button
                className="btn btn-outline"
                onClick={() => navigate('/products')}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="no-order">
            <p>No order found. Please check your transaction ID and try again.</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/products')}
            >
              Back to Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderStatus;
