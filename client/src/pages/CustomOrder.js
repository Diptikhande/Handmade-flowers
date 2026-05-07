import React, { useState } from 'react';
import { customOrderAPI } from '../services/api';
import './CustomOrder.css';

const CustomOrder = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    productType: '',
    color: '',
    customText: '',
    quantity: '1',
    occasion: 'gift',
  });

  const productTypes = ['keychain', 'fridge-magnet', 'hair-clip', 'flower-pot', 'bouquet'];
  const occasions = ['birthday', 'anniversary', 'wedding', 'gift', 'other'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await customOrderAPI.createCustomOrder(formData);
      setMessage('success:' + response.data.message);

      // Reset form
      setFormData({
        name: '',
        phone: '',
        address: '',
        productType: '',
        color: '',
        customText: '',
        quantity: '1',
        occasion: 'gift',
      });

      setTimeout(() => {
        setMessage('');
      }, 5000);
    } catch (error) {
      setMessage('error:' + (error.response?.data?.errors?.[0] || error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="custom-order-page">
      <div className="container">
        <div className="custom-order-header">
          <h1>Create Your Custom Order</h1>
          <p>Design your perfect handmade flower creation</p>
        </div>

        <div className="custom-order-wrapper">
          <div className="custom-order-info">
            <div className="info-card">
              <h3>🎨 Custom Design Process</h3>
              <ol>
                <li>Fill in your details</li>
                <li>Choose product type and color</li>
                <li>Add custom text (optional)</li>
                <li>Specify occasion</li>
                <li>We'll contact you with quote</li>
              </ol>
            </div>

            <div className="info-card">
              <h3>💡 Examples</h3>
              <ul>
                <li>Name bouquets</li>
                <li>Date keychains</li>
                <li>Personalized hair clips</li>
                <li>Custom magnets</li>
                <li>Special occasion arrangements</li>
              </ul>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="custom-order-form">
            {message && (
              <div className={`alert ${message.startsWith('success') ? 'alert-success' : 'alert-danger'}`}>
                {message.replace(/^(success|error):/, '')}
              </div>
            )}

            <div className="form-row">
              {/* Name */}
              <div className="form-group">
                <label>Your Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                  disabled={loading}
                />
              </div>

              {/* Phone */}
              <div className="form-group">
                <label>Phone (10 digits) *</label>
                <input
                  type="tel"
                  name="phone"
                  pattern="[0-9]{10}"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="9876543210"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Address */}
            <div className="form-group">
              <label>Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Your complete address"
                rows={3}
                required
                disabled={loading}
              ></textarea>
            </div>

            <div className="form-row">
              {/* Product Type */}
              <div className="form-group">
                <label>Product Type *</label>
                <select
                  name="productType"
                  value={formData.productType}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                >
                  <option value="">Select Type</option>
                  {productTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.replace('-', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Occasion */}
              <div className="form-group">
                <label>Occasion</label>
                <select
                  name="occasion"
                  value={formData.occasion}
                  onChange={handleInputChange}
                  disabled={loading}
                >
                  {occasions.map((occ) => (
                    <option key={occ} value={occ}>
                      {occ.charAt(0).toUpperCase() + occ.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Custom Text */}
            <div className="form-group">
              <label>Custom Text (Optional)</label>
              <input
                type="text"
                name="customText"
                value={formData.customText}
                onChange={handleInputChange}
                placeholder="e.g., Happy Birthday, 2024, Your Name"
                maxLength={100}
                disabled={loading}
              />
              <small>{formData.customText.length}/100 characters</small>
            </div>

            <div className="form-row">
              {/* Color */}
              <div className="form-group">
                <label>Color Preference *</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  placeholder="Red, Pink, Blue…"
                  required
                  disabled={loading}
                />
              </div>

              {/* Quantity */}
              <div className="form-group">
                <label>Quantity *</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="1"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary btn-large"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Request Custom Order'}
            </button>

            <p className="form-note">
              We'll contact you within 24 hours with a quote and design options.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomOrder;
