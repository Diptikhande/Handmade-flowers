import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import { settingsAPI } from '../services/api';
import './Footer.css';

const DEFAULT_CONTACT = {
  city: 'Kolhapur, Maharashtra',
  phone: '+91 9632982631',
  email: 'bloomsnlooms@gmail.com',
};

const Footer = () => {
  const year = new Date().getFullYear();
  const [contact, setContact] = useState(DEFAULT_CONTACT);

  useEffect(() => {
    let mounted = true;

    settingsAPI.getPublicSettings()
      .then(({ data }) => {
        const apiContact = data?.data?.contact;
        if (!mounted || !apiContact) return;

        setContact({
          city: apiContact.city || DEFAULT_CONTACT.city,
          phone: apiContact.phone || DEFAULT_CONTACT.phone,
          email: apiContact.email || DEFAULT_CONTACT.email,
        });
      })
      .catch(() => {
        // Keep defaults if public settings fail.
      });

    return () => {
      mounted = false;
    };
  }, []);

  const phoneHref = useMemo(
    () => `tel:${String(contact.phone || '').replace(/\s+/g, '')}`,
    [contact.phone]
  );
  const emailHref = useMemo(() => `mailto:${contact.email}`, [contact.email]);

  return (
    <footer className="footer">
      <div className="container footer-wrap" data-reveal>
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>Blooms & Looms</h3>
            <p>Handcrafted elegance for every moment.</p>

            <div className="footer-socials" aria-label="Social links">
              <a
                href="https://www.instagram.com/bloomsnlooms/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FiInstagram />
              </a>
              <a href={emailHref} aria-label="Email">
                <FiMail />
              </a>
            </div>
          </div>

          <nav className="footer-links" aria-label="Footer links">
            <h4>Quick Links</h4>
            <Link to="/products">Products</Link>
            <Link to="/custom-order">Custom Order</Link>
            <Link to="/contact">Contact</Link>
          </nav>

          <div className="footer-contact">
            <h4>Contact</h4>
            <a className="footer-contact-item" href={phoneHref} aria-label="Phone">
              <FiPhone />
              <span>{contact.phone}</span>
            </a>
            <div className="footer-contact-item" aria-label="Location">
              <FiMapPin />
              <span>{contact.city}</span>
            </div>
            <a className="footer-contact-item" href={emailHref} aria-label="Email">
              <FiMail />
              <span>{contact.email}</span>
            </a>
          </div>
        </div>

        <div className="footer-bottom">{'\u00A9'} {year} Blooms & Looms. All rights reserved.</div>
      </div>
    </footer>
  );
};

export default Footer;
