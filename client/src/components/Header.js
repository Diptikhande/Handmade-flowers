import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut, FiUser, FiShoppingCart } from 'react-icons/fi';
import './Header.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isCustomer = !!localStorage.getItem('customerToken');
  const customerUser = localStorage.getItem('customerUser') ? JSON.parse(localStorage.getItem('customerUser')) : null;

  const handleLogout = () => {
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customerUser');
    localStorage.removeItem('cart');
    navigate('/');
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
          {isCustomer ? (
            <>
              <Link to="/profile" className="nav-link"><FiUser /> Profile</Link>
              <button className="btn btn-secondary btn-small" onClick={handleLogout}>
                <FiLogOut /> Logout
              </button>
            </>
          ) : (
            <Link to="/admin/login" className="btn btn-outline btn-small">Admin</Link>
          )}
        </nav>

        <button className="mobile-menu-toggle" onClick={() => setMenuOpen((s) => !s)}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
    </header>
  );
};

export default Header;
