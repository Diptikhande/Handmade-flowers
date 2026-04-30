import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { adminAPI, checkServerHealth } from '../services/api';
import './AdminLogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [serverStatus, setServerStatus] = useState(null);
  const [checking, setChecking] = useState(true);

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  // Check server health on component mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const health = await checkServerHealth();
        setServerStatus(health);
        
        if (!health.isDatabaseConnected) {
          setMessage('⚠️ The database connection is being re-established. Please try again in a moment.');
        }
      } catch (error) {
        console.error('Health check error:', error);
        setServerStatus({ isHealthy: false, isDatabaseConnected: false });
      } finally {
        setChecking(false);
      }
    };

    checkHealth();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Quick health check before attempting login
      const health = await checkServerHealth();
      if (!health.isDatabaseConnected) {
        setMessage('🔄 Database is reconnecting. Please wait a moment and try again.');
        setLoading(false);
        return;
      }

      const response = await adminAPI.login(formData);

      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminUser', JSON.stringify(response.data.data));

      navigate('/admin/dashboard');
    } catch (error) {
      // Handle specific error types
      const errorData = error.response?.data;
      
      if (error.response?.status === 503) {
        // Service unavailable
        setMessage('🔄 Server is temporarily reconnecting to the database. Please try again in a few moments.');
      } else if (errorData?.error === 'DATABASE_UNAVAILABLE') {
        setMessage('🔄 Database connection lost. The system is attempting to reconnect. Please try again shortly.');
      } else if (!error.response) {
        // Network error or timeout
        if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
          setMessage('⏱️ Request timed out. The server may be temporarily unavailable. Please check your internet connection and try again.');
        } else {
          setMessage('🌐 Network error: Unable to connect to the server. Please check your internet connection.');
        }
      } else if (error.response?.status === 401) {
        setMessage('❌ Invalid username or password. Please try again.');
      } else {
        // Use user-friendly message if available, otherwise use API message
        setMessage(errorData?.userMessage || errorData?.message || error.message || 'Login failed. Please try again.');
      }
      
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="admin-login-page" data-reveal>
        <div className="login-container">
          <div className="login-card">
            <h1>Admin Dashboard Access</h1>
            <p className="subtitle">Authorized access only</p>
            <div className="alert alert-info" style={{ textAlign: 'center', padding: '20px' }}>
              <p>🔄 Checking server connection...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-login-page" data-reveal>
      <div className="login-container">
        <div className="login-card">

          <h1>Admin Dashboard Access</h1>
          <p className="subtitle">Authorized access only</p>

          {message && (
            <div className={`alert ${message.includes('Invalid') ? 'alert-danger' : 'alert-warning'}`}>
              {message}
            </div>
          )}

          {serverStatus && !serverStatus.isDatabaseConnected && (
            <div className="alert alert-warning" style={{ marginBottom: '15px' }}>
              <p style={{ margin: 0, fontSize: '0.9em' }}>
                ℹ️ System Status: Database reconnecting - please wait a moment before trying again.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="form">

            {/* USERNAME */}
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </div>

            {/* PASSWORD */}
            <div className="form-group password-group">
              <label>Password</label>

              <div className="password-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  disabled={loading}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary login-btn"
              disabled={loading || !serverStatus?.isDatabaseConnected}
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
};

export default AdminLogin;