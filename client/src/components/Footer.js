import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiMail } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-minimal" data-reveal>
        <h3>Blooms & Looms</h3>
        <p>Handcrafted Elegance for Every Moment</p>
        <div className="footer-links-inline">
          <Link to="/products">Products</Link>
          <Link to="/custom-order">Custom Order</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div className="footer-socials">
          <a href="#" aria-label="Instagram"><FiInstagram /></a>
          <a href="#" aria-label="Facebook"><FiFacebook /></a>
          <a href="mailto:bloomsnlooms@gmail.com" aria-label="Email"><FiMail /></a>
        </div>
        <div className="footer-bottom">© {year} Blooms & Looms. All rights reserved.</div>
      </div>
    </footer>
  );
};

export default Footer;
