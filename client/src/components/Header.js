import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import './Header.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isAdmin = !!localStorage.getItem('adminToken');

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/admin/login';
  };

  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="logo">Blooms & Looms</Link>

        <nav className={`nav ${menuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Shop</Link>
          <Link to="/custom-order" className="nav-link">Custom</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          {isAdmin ? (
            <>
              <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
              <button className="btn btn-secondary btn-small" onClick={handleLogout}><FiLogOut /> Logout</button>
            </>
          ) : (
            <Link to="/admin/login" className="btn btn-outline btn-small">Admin</Link>
          )}
        </nav>

        <button className="mobile-menu-toggle" onClick={() => setMenuOpen((s) => !s)}>{menuOpen ? <FiX /> : <FiMenu />}</button>
      </div>
    </header>
  );
};

export default Header;
