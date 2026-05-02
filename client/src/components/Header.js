import React, { useState } from 'react';
<<<<<<< HEAD
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut, FiUser, FiShoppingCart } from 'react-icons/fi';
=======
import { NavLink, Link } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut } from 'react-icons/fi';
>>>>>>> eae125b008b2fdeb979926c3e33514ffed20dc6c
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

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <div className="container header-content">

        {/* 🔥 LOGO WITH IMAGE */}
        <Link to="/" className="logo" onClick={closeMenu}>
          <img 
            src="/images/logo.jpeg"   /* 👈 YOUR JPEG IMAGE */
            alt="logo" 
            className="logo-img" 
          />
          <span>Blooms & Looms</span>
        </Link>

        {/* NAV */}
        <nav className={`nav ${menuOpen ? 'active' : ''}`}>
<<<<<<< HEAD
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Shop</Link>
          <Link to="/custom-order" className="nav-link">Custom</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          {isCustomer ? (
            <>
              <Link to="/profile" className="nav-link"><FiUser /> Profile</Link>
=======

          <NavLink to="/" onClick={closeMenu} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Home
          </NavLink>

          <NavLink to="/products" onClick={closeMenu} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Shop
          </NavLink>

          <NavLink to="/custom-order" onClick={closeMenu} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Custom
          </NavLink>

          <NavLink to="/contact" onClick={closeMenu} className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Contact
          </NavLink>

          {isAdmin ? (
            <>
              <NavLink to="/admin/dashboard" onClick={closeMenu} className="nav-link">
                Dashboard
              </NavLink>

>>>>>>> eae125b008b2fdeb979926c3e33514ffed20dc6c
              <button className="btn btn-secondary btn-small" onClick={handleLogout}>
                <FiLogOut /> Logout
              </button>
            </>
          ) : (
            <Link to="/admin/login" className="btn btn-outline btn-small">Admin</Link>
          )}

        </nav>

<<<<<<< HEAD
        <button className="mobile-menu-toggle" onClick={() => setMenuOpen((s) => !s)}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
=======
        {/* MOBILE BUTTON */}
        <button className="mobile-menu-toggle" onClick={() => setMenuOpen((s) => !s)}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

>>>>>>> eae125b008b2fdeb979926c3e33514ffed20dc6c
      </div>
    </header>
  );
};

export default Header;