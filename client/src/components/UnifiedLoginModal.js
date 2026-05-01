import React, { useState } from 'react';
import { FiEye, FiEyeOff, FiX } from 'react-icons/fi';
import { adminAPI, customerAPI } from '../services/api';
import '../styles/UnifiedLoginModal.css';

const UnifiedLoginModal = ({ isOpen, onClose, onLoginSuccess, loginType = 'auto' }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('customer'); // 'admin' or 'customer'

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await adminAPI.login({
        username: formData.username,
        password: formData.password
      });

      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminUser', JSON.stringify(response.data.data));

      onLoginSuccess({ type: 'admin', data: response.data.data });
      onClose();
    } catch (error) {
      setMessage(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await customerAPI.login({
        email: formData.email
      });

      localStorage.setItem('customerToken', response.data.token);
      localStorage.setItem('customerUser', JSON.stringify(response.data.data));

      onLoginSuccess({ type: 'customer', data: response.data.data });
      onClose();
    } catch (error) {
      setMessage(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const showAdminTab = loginType === 'auto' || loginType === 'admin';
  const showCustomerTab = loginType === 'auto' || loginType === 'customer';

  return (
    <div className="login-modal-overlay">
      <div className="login-modal-container">
        <button className="login-modal-close" onClick={onClose}>
          <FiX />
        </button>

        {showAdminTab && showCustomerTab && (
          <div className="login-modal-tabs">
            <button
              className={`tab ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin')}
            >
              Admin
            </button>
            <button
              className={`tab ${activeTab === 'customer' ? 'active' : ''}`}
              onClick={() => setActiveTab('customer')}
            >
              Customer
            </button>
          </div>
        )}

        {/* Admin Login Form */}
        {(activeTab === 'admin' || (showAdminTab && !showCustomerTab)) && (
          <div className="login-modal-form">
            <h2>Admin Dashboard Access</h2>
            <p className="subtitle">Authorized access only</p>

            {message && (
              <div className="login-modal-message error">
                {message}
              </div>
            )}

            <form onSubmit={handleAdminSubmit}>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter username"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="password-input-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <button type="submit" className="login-modal-submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
        )}

        {/* Customer Login Form */}
        {(activeTab === 'customer' || (showCustomerTab && !showAdminTab)) && (
          <div className="login-modal-form">
            <h2>Customer Login</h2>
            <p className="subtitle">Continue shopping with your email</p>

            {message && (
              <div className="login-modal-message error">
                {message}
              </div>
            )}

            <form onSubmit={handleCustomerSubmit}>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  disabled={loading}
                  required
                />
              </div>

              <button type="submit" className="login-modal-submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Continue'}
              </button>
            </form>

            <p className="login-modal-note">
              We'll create an account or log you in with your email.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedLoginModal;
