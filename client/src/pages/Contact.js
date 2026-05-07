import React, { useEffect, useState } from 'react';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import { settingsAPI, contactAPI } from '../services/api';
import './Contact.css';

const Contact = () => {
  const [settings, setSettings] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data } = await settingsAPI.getPublicSettings();
        setSettings(data.data);
      } catch (error) {
        console.error('Failed to load contact settings', error);
      }
    };
    loadSettings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await contactAPI.sendMessage(formData);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
      console.error('Failed to send contact message:', err);
    } finally {
      setLoading(false);
    }
  };

  const contact = settings?.contact;

  return (
    <div className="contact-page">
      <div className="container">
        <div className="contact-header" data-reveal>
          <h1>Get In Touch</h1>
          <p>We are here to craft custom floral stories for your moments.</p>
        </div>

        <div className="contact-container" data-reveal>
          <aside className="contact-info">
            <div className="info-card">
              <h3>Blooms & Looms</h3>
              <p>{contact?.studioName || 'Blooms & Looms'}</p>
            </div>
            <div className="info-card">
              <h3><FiMapPin /> City</h3>
              <p>{contact?.city || 'Kolhapur, Maharashtra'}</p>
            </div>
            <div className="info-card">
              <h3><FiPhone /> Phone</h3>
              <p>{contact?.phone || '+91 9632982631'}</p>
            </div>
            <div className="info-card">
              <h3><FiMail /> Email</h3>
              <p>{contact?.email || 'bloomsnlooms@gmail.com'}</p>
            </div>
          </aside>

          <form onSubmit={handleSubmit} className="contact-form">
            {submitted && <div className="alert alert-success">Thank you. We have received your message and will get back to you soon!</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="contact-form-grid">
              <div className="form-group">
                <label>Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div className="form-group contact-span-2">
                <label>Subject *</label>
                <input type="text" name="subject" value={formData.subject} onChange={handleInputChange} required />
              </div>
              <div className="form-group contact-span-2">
                <label>Message *</label>
                <textarea name="message" value={formData.message} onChange={handleInputChange} rows="5" required />
              </div>
            </div>
            <div className="contact-btn-wrap">
              <button type="submit" className="btn btn-primary contact-submit-btn" disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
