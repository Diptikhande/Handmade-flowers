import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiShoppingCart, FiPackage, FiArrowLeft } from 'react-icons/fi';
import { customerAPI, orderAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const customerToken = localStorage.getItem('customerToken');
    if (!customerToken) {
      navigate('/');
      return;
    }

    const customerData = localStorage.getItem('customerUser');
    if (customerData) {
      setUser(JSON.parse(customerData));
    }

    const cartData = localStorage.getItem('cart');
    if (cartData) {
      setCart(JSON.parse(cartData));
    }

    // Fetch orders
    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getAllOrders();
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  return (
    <div className="profile-page">
      <div className="container">
        <button className="back-button" onClick={() => navigate('/')}>
          <FiArrowLeft /> Back
        </button>

        <div className="profile-header">
          <h1>My Profile</h1>
          <p className="subtitle">Manage your account, cart, and orders</p>
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
          <button
            className={`tab ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            <FiUser /> My Details
          </button>
          <button
            className={`tab ${activeTab === 'cart' ? 'active' : ''}`}
            onClick={() => setActiveTab('cart')}
          >
            <FiShoppingCart /> My Cart ({cart.length})
          </button>
          <button
            className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <FiPackage /> My Orders ({orders.length})
          </button>
        </div>

        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="profile-section">
            <h2>Personal Information</h2>
            <div className="info-grid">
              <div className="info-item">
                <label>Email</label>
                <p>{user?.email || 'N/A'}</p>
              </div>
              <div className="info-item">
                <label>Name</label>
                <p>{user?.name || 'Not provided'}</p>
              </div>
              <div className="info-item">
                <label>Phone</label>
                <p>{user?.phone || 'Not provided'}</p>
              </div>
              <div className="info-item">
                <label>Address</label>
                <p>{user?.address || 'Not provided'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Cart Tab */}
        {activeTab === 'cart' && (
          <div className="profile-section">
            <h2>Shopping Cart</h2>
            {cart.length > 0 ? (
              <div className="cart-list">
                {cart.map((product, index) => (
                  <div key={index} className="cart-item">
                    <img src={product.imageUrl} alt={product.name} />
                    <div className="cart-info">
                      <h3>{product.name}</h3>
                      <p className="category">{product.category}</p>
                    </div>
                    <div className="cart-price">
                      <p>₹{product.price}</p>
                    </div>
                  </div>
                ))}
                <div className="cart-summary">
                  <h3>Total Items: {cart.length}</h3>
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate('/checkout')}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <FiShoppingCart />
                <p>Your cart is empty</p>
                <button className="btn btn-primary" onClick={() => navigate('/products')}>
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="profile-section">
            <h2>My Orders</h2>
            {orders.length > 0 ? (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order._id} className="order-card">
                    <div className="order-header">
                      <div>
                        <h3>{order.productName}</h3>
                        <p className="order-id">Order ID: {order._id.slice(0, 8)}...</p>
                      </div>
                      <span className={`order-status ${order.status}`}>
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="order-details">
                      <p><strong>Quantity:</strong> {order.quantity}</p>
                      <p><strong>Amount:</strong> ₹{order.amount}</p>
                      <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <FiPackage />
                <p>No orders yet</p>
                <button className="btn btn-primary" onClick={() => navigate('/products')}>
                  Start Shopping
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
