import React, { useEffect, useState } from 'react';
import { FiEye, FiEyeOff, FiX } from 'react-icons/fi';
import { adminAPI, customerAPI } from '../services/api';
import '../styles/UnifiedLoginModal.css';

const UnifiedLoginModal = ({ isOpen, onClose, onLoginSuccess, loginType = 'auto' }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('customer');
  const [customerMode, setCustomerMode] = useState('login');
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    password: '',
    confirmPassword: '',
  });

  const showAdminTab = loginType === 'auto' || loginType === 'admin';
  const showCustomerTab = loginType === 'auto' || loginType === 'customer';

  useEffect(() => {
    if (!isOpen) return;

    setMessage('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setCustomerMode('login');
    setActiveTab(showCustomerTab ? 'customer' : 'admin');
  }, [isOpen, showCustomerTab]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const saveCustomerSession = (response) => {
    localStorage.setItem('customerToken', response.data.token);
    localStorage.setItem('customerUser', JSON.stringify(response.data.data));
    onLoginSuccess({ type: 'customer', data: response.data.data });
    onClose();
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await adminAPI.login({
        username: formData.username,
        password: formData.password,
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

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await customerAPI.loginWithPassword({
        email: formData.email,
        password: formData.password,
      });
      saveCustomerSession(response);
    } catch (error) {
      setMessage(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const response = await customerAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      });
      saveCustomerSession(response);
    } catch (error) {
      setMessage(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-modal-overlay">
      <div className="login-modal-container">
        <button className="login-modal-close" onClick={onClose}>
          <FiX />
        </button>

        {showAdminTab && showCustomerTab && (
          <div className="login-modal-tabs">
            <button className={`tab ${activeTab === 'admin' ? 'active' : ''}`} onClick={() => setActiveTab('admin')}>
              Admin
            </button>
            <button className={`tab ${activeTab === 'customer' ? 'active' : ''}`} onClick={() => setActiveTab('customer')}>
              Customer
            </button>
          </div>
        )}

        {(activeTab === 'admin' || (showAdminTab && !showCustomerTab)) && (
          <div className="login-modal-form">
            <h2>Admin Login</h2>
            {message && <div className="login-modal-message error">{message}</div>}
            <form onSubmit={handleAdminSubmit} autoComplete="off">
              <input type="text" name="fake-username" autoComplete="username" tabIndex="-1" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
              <input type="password" name="fake-password" autoComplete="new-password" tabIndex="-1" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
              <div className="form-group">
                <label>Username</label>
                <input type="text" name="username" value={formData.username} onChange={handleInputChange} required autoComplete="off" />
              </div>
              <div className="form-group">
                <label>Password</label>
                <div className="password-input-group">
                  <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} required autoComplete="new-password" />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword((p) => !p)}>
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

        {(activeTab === 'customer' || (showCustomerTab && !showAdminTab)) && (
          <div className="login-modal-form">
            <h2>{customerMode === 'register' ? 'Create Account' : 'Customer Login'}</h2>
            <p className="subtitle">Use email and password to sign in or register a new account</p>
            {message && <div className="login-modal-message error">{message}</div>}

            <div className="mode-buttons">
              <button type="button" className={`mode-button ${customerMode === 'login' ? '' : 'secondary'}`} onClick={() => setCustomerMode('login')}>
                Login
              </button>
              <button type="button" className={`mode-button ${customerMode === 'register' ? '' : 'secondary'}`} onClick={() => setCustomerMode('register')}>
                Register
              </button>
            </div>

            {customerMode === 'login' && (
              <form onSubmit={handlePasswordLogin} autoComplete="off">
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required autoComplete="off" />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <div className="password-input-group">
                    <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} required autoComplete="new-password" />
                    <button type="button" className="password-toggle" onClick={() => setShowPassword((p) => !p)}>
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>
                <button type="submit" className="login-modal-submit" disabled={loading}>
                  {loading ? 'Please wait...' : 'Login'}
                </button>
              </form>
            )}

            {customerMode === 'register' && (
              <form onSubmit={handleRegister} autoComplete="off">
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required autoComplete="off" />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required autoComplete="off" />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required autoComplete="off" />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleInputChange} required autoComplete="off" />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleInputChange} required autoComplete="off" />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input type="text" name="state" value={formData.state} onChange={handleInputChange} required autoComplete="off" />
                </div>
                <div className="form-group">
                  <label>Pincode</label>
                  <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} required autoComplete="off" />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <div className="password-input-group">
                    <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} required autoComplete="new-password" />
                    <button type="button" className="password-toggle" onClick={() => setShowPassword((p) => !p)}>
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label>Confirm Password</label>
                  <div className="password-input-group">
                    <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required autoComplete="new-password" />
                    <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword((p) => !p)}>
                      {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>
                <button type="submit" className="login-modal-submit" disabled={loading}>
                  {loading ? 'Please wait...' : 'Create Account'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UnifiedLoginModal;
