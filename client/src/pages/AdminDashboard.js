import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI, customOrderAPI, productAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [orderStats, productsRes, customOrdersRes] = await Promise.all([
        orderAPI.getOrderStats(),
        productAPI.getAllProducts(),
        customOrderAPI.getAllCustomOrders(),
      ]);

      setStats({
        orders: orderStats.data.data,
        totalProducts: productsRes.data.count,
        totalCustomOrders: customOrdersRes.data.count,
      });
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <div className="admin-dashboard-page">
      <div className="container">
        <h1>Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <h3>Total Products</h3>
              <p className="stat-value">{stats?.totalProducts || 0}</p>
            </div>
            <Link to="/admin/products" className="stat-link">
              Manage →
            </Link>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <h3>Total Orders</h3>
              <p className="stat-value">{stats?.orders?.totalOrders || 0}</p>
            </div>
            <Link to="/admin/orders" className="stat-link">
              View →
            </Link>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3>Pending Orders</h3>
              <p className="stat-value">{stats?.orders?.pendingOrders || 0}</p>
            </div>
            <Link to="/admin/orders" className="stat-link">
              Verify →
            </Link>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✓</div>
            <div className="stat-content">
              <h3>Approved Orders</h3>
              <p className="stat-value">{stats?.orders?.approvedOrders || 0}</p>
            </div>
            <Link to="/admin/orders" className="stat-link">
              View →
            </Link>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>Total Revenue</h3>
              <p className="stat-value">₹{stats?.orders?.totalRevenue || 0}</p>
            </div>
            <Link to="/admin/orders" className="stat-link">
              Details →
            </Link>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🎨</div>
            <div className="stat-content">
              <h3>Custom Orders</h3>
              <p className="stat-value">{stats?.totalCustomOrders || 0}</p>
            </div>
            <Link to="/admin/custom-orders" className="stat-link">
              Manage →
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <section className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/admin/products" className="action-button">
              <span>📦</span>
              <span>Manage Products</span>
            </Link>
            <Link to="/admin/orders" className="action-button">
              <span>📋</span>
              <span>Verify Orders</span>
            </Link>
            <Link to="/admin/custom-orders" className="action-button">
              <span>🎨</span>
              <span>Custom Orders</span>
            </Link>
          </div>
        </section>

        {/* Info Box */}
        <div className="info-box">
          <h3>Welcome to Admin Panel</h3>
          <ul>
            <li>✓ Add, edit, or delete products</li>
            <li>✓ Verify and approve customer orders</li>
            <li>✓ Manage custom order requests</li>
            <li>✓ View revenue and order statistics</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
