import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
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

              <button className="btn btn-secondary btn-small" onClick={handleLogout}>
                <FiLogOut /> Logout
              </button>
            </>
          ) : (
            <Link to="/admin/login" className="btn btn-outline btn-small">Admin</Link>
          )}

        </nav>

        {/* MOBILE BUTTON */}
        <button className="mobile-menu-toggle" onClick={() => setMenuOpen((s) => !s)}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

      </div>
    </header>
  );
};

export default Header;