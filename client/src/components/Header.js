import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import './Header.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isCustomer = !!localStorage.getItem('customerToken');

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    localStorage.removeItem('customerToken');
    localStorage.removeItem('customerUser');
    localStorage.removeItem('cart');
    closeMenu();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="logo" onClick={closeMenu}>
          <img src="/images/logo.jpeg" alt="Blooms & Looms logo" className="logo-img" />
          <span>Blooms & Looms</span>
        </Link>

        <nav className={`nav ${menuOpen ? 'active' : ''}`}>
          <NavLink to="/" onClick={closeMenu} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Home
          </NavLink>
          <NavLink to="/products" onClick={closeMenu} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Shop
          </NavLink>
          <NavLink to="/custom-order" onClick={closeMenu} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Custom
          </NavLink>
          <NavLink to="/contact" onClick={closeMenu} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Contact
          </NavLink>

          {isCustomer ? (
            <>
              <NavLink to="/profile" onClick={closeMenu} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Profile
              </NavLink>
              <button className="btn btn-secondary btn-small" onClick={handleLogout}>
                <FiLogOut /> Logout
              </button>
            </>
          ) : (
            <Link to="/admin/login" onClick={closeMenu} className="btn btn-outline btn-small">
              Admin
            </Link>
          )}
        </nav>

        <button className="mobile-menu-toggle" onClick={() => setMenuOpen((current) => !current)}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
    </header>
  );
};

export default Header;
