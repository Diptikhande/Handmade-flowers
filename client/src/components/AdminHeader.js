import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import './AdminHeader.css';

const AdminHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  return (
    <header className="admin-header">
      <div className="container admin-header-content">
        <Link to="/admin/dashboard" className="admin-logo">Blooms & Looms</Link>

        <nav className={`admin-nav ${menuOpen ? 'active' : ''}`}>
          <Link to="/admin/dashboard" className="admin-nav-link">Dashboard</Link>
          <Link to="/admin/products" className="admin-nav-link">Products</Link>
          <Link to="/admin/orders" className="admin-nav-link">Orders</Link>
          <Link to="/admin/custom-orders" className="admin-nav-link">Custom Orders</Link>
          <button className="btn btn-secondary btn-small" onClick={handleLogout}>
            <FiLogOut /> Logout
          </button>
        </nav>

        <button className="mobile-menu-toggle" onClick={() => setMenuOpen((s) => !s)}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
