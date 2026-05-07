import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiEdit2, FiLogOut, FiShoppingBag, FiUser, FiShoppingCart } from 'react-icons/fi';
import { customerAPI, resolveImageUrl } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('details');
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    checkAuth();
    loadProfileData();
  }, []);

  useEffect(() => {
    const requestedTab = searchParams.get('tab');
    if (requestedTab) {
      setActiveTab(requestedTab);
    }
  }, [searchParams]);

  const checkAuth = () => {
    const token = localStorage.getItem('customerToken');
    if (!token) {
      navigate('/products');
    }
  };

  const loadProfileData = async () => {
    try {
      const [profileRes, ordersRes] = await Promise.all([
        customerAPI.getProfile(),
        customerAPI.getOrders(),
      ]);

      const customerData = profileRes.data.data;
      setProfile(customerData);
      setFormData(customerData);

      setOrders(ordersRes.data.data || []);

      // Load cart from localStorage
      const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCart(savedCart);

      setLoading(false);
    } catch (error) {
      console.error('Failed to load profile:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await customerAPI.updateProfile({
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      });
      setProfile(formData);
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleRemoveFromCart = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const openProductDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  const openOrderStatus = (transactionId) => {
    navigate(`/order-status?transactionId=${encodeURIComponent(transactionId)}`);
  };

  const handleCartBuyNow = (item) => {
    navigate('/checkout', { state: { product: item, quantity: 1 } });
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('customerToken');
      localStorage.removeItem('customerUser');
      navigate('/products');
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

  if (loading) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <button className="btn btn-outline" onClick={handleLogout}>
            <FiLogOut /> Logout
          </button>
        </div>

        <div className="profile-container">
          {/* Sidebar Navigation */}
          <aside className="profile-sidebar">
            <nav className="profile-nav">
              <button
                className={`nav-item ${activeTab === 'details' ? 'active' : ''}`}
                onClick={() => setActiveTab('details')}
              >
                <FiUser /> My Details
              </button>
              <button
                className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <FiShoppingBag /> My Orders
              </button>
              <button
                className={`nav-item ${activeTab === 'cart' ? 'active' : ''}`}
                onClick={() => setActiveTab('cart')}
              >
                <FiShoppingCart /> Cart ({cart.length})
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="profile-content">
            {/* My Details Tab */}
            {activeTab === 'details' && (
              <div className="tab-content">
                <div className="tab-header">
                  <h2>Personal Information</h2>
                  {!editMode && (
                    <button
                      className="btn btn-secondary btn-small"
                      onClick={() => setEditMode(true)}
                    >
                      <FiEdit2 /> Edit
                    </button>
                  )}
                </div>

                {editMode ? (
                  <form onSubmit={handleUpdateProfile} className="profile-form">
                    <div className="form-group">
                      <label>Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input type="email" value={formData.email} disabled />
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>State</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Pincode</label>
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="form-buttons">
                      <button type="submit" className="btn btn-primary">
                        Save Changes
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => {
                          setEditMode(false);
                          setFormData(profile);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="profile-details">
                    <div className="detail-row">
                      <span className="label">Name:</span>
                      <span className="value">{profile?.name}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Email:</span>
                      <span className="value">{profile?.email}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Phone:</span>
                      <span className="value">{profile?.phone || 'Not provided'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Address:</span>
                      <span className="value">{profile?.address || 'Not provided'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">City:</span>
                      <span className="value">{profile?.city || 'Not provided'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">State:</span>
                      <span className="value">{profile?.state || 'Not provided'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Pincode:</span>
                      <span className="value">{profile?.pincode || 'Not provided'}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* My Orders Tab */}
            {activeTab === 'orders' && (
              <div className="tab-content">
                <h2>My Orders</h2>
                <p className="orders-hint">Click any order card to open its live status page.</p>
                {orders.length === 0 ? (
                  <div className="empty-state">
                    <FiShoppingBag size={48} />
                    <p>You haven't placed any orders yet.</p>
                  </div>
                ) : (
                  <div className="orders-grid">
                    {orders.map((order) => (
                      <div
                        key={order._id}
                        className="order-card order-card-clickable"
                        role="button"
                        tabIndex={0}
                        onClick={() => openOrderStatus(order.transactionId)}
                        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openOrderStatus(order.transactionId)}
                      >
                        <div className="order-header">
                          <div className="order-title-group">
                            <div className="order-thumb">
                              <img
                                src={resolveImageUrl(order.productId?.imageUrl, order.productId?.updatedAt) || '/images/img1.jpg'}
                                alt={order.productId?.name || order.productName}
                              />
                            </div>
                            <div>
                              <h3>{order.productId?.name || order.productName}</h3>
                              <p className="order-card-subtitle">Transaction ID: {order.transactionId}</p>
                            </div>
                          </div>
                          <span className={`badge ${getStatusBadge(order.status).class}`}>
                            {getStatusBadge(order.status).text}
                          </span>
                        </div>
                        <div className="order-body">
                          <p>
                            <strong>Amount:</strong> ₹{order.amount}
                          </p>
                          <p>
                            <strong>Quantity:</strong> {order.quantity}
                          </p>
                          <p>
                            <strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                          {order.rejectionReason && (
                            <p className="rejection-reason">
                              <strong>Cancellation Reason:</strong> {order.rejectionReason}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Cart Tab */}
            {activeTab === 'cart' && (
              <div className="tab-content">
                <h2>Shopping Cart</h2>
                {cart.length === 0 ? (
                  <div className="empty-state">
                    <FiShoppingCart size={48} />
                    <p>Your cart is empty.</p>
                  </div>
                ) : (
                  <div className="cart-list">
                    {cart.map((item, index) => (
                      <div
                        key={index}
                        className="cart-item"
                        role="button"
                        tabIndex={0}
                        onClick={() => openProductDetails(item._id)}
                        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openProductDetails(item._id)}
                      >
                        <div className="cart-item-content">
                          <div className="cart-item-image">
                            <img src={resolveImageUrl(item.imageUrl, item.updatedAt) || '/images/img1.jpg'} alt={item.name} />
                          </div>
                          <div className="cart-item-details">
                            <h3>{item.name}</h3>
                            <p className="category">{item.category}</p>
                            <p className="price">₹{item.price}</p>
                          </div>
                        </div>
                        <div className="cart-item-actions">
                          <button
                            className="btn btn-danger btn-small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFromCart(index);
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="cart-summary">
                      <div className="summary-row">
                        <strong>Total Items:</strong>
                        <span>{cart.length}</span>
                      </div>
                      <div className="summary-row">
                        <strong>Total Price:</strong>
                        <span>₹{cart.reduce((sum, item) => sum + item.price, 0)}</span>
                      </div>
                      <div className="summary-actions">
                        <button
                          className="btn btn-primary"
                          disabled={cart.length === 0}
                          onClick={() => handleCartBuyNow(cart[cart.length - 1])}
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;
