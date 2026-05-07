import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { orderAPI, settingsAPI } from '../services/api';
import './Checkout.css';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [settings, setSettings] = useState(null);
  const [preview, setPreview] = useState('');
  const [formData, setFormData] = useState({
    customerName: '', phone: '', address: '', transactionId: '', paymentScreenshot: null, quantity: location.state?.quantity || 1,
  });

  useEffect(() => { settingsAPI.getPublicSettings().then(({ data }) => setSettings(data.data)).catch(() => null); }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, paymentScreenshot: file }));
    setPreview(file ? URL.createObjectURL(file) : '');
  };

  const total = product ? Number(product.price) * Number(formData.quantity || 1) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      if (!formData.paymentScreenshot) throw new Error('Please upload payment screenshot');
      const payload = new FormData();
      Object.entries({
        productId: product._id,
        customerName: formData.customerName,
        phone: formData.phone,
        address: formData.address,
        transactionId: formData.transactionId,
        quantity: String(formData.quantity),
      }).forEach(([k, v]) => payload.append(k, v));
      payload.append('paymentScreenshot', formData.paymentScreenshot);
      const response = await orderAPI.createOrder(payload);
      setMessage(`success:${response.data.message}`);
      setTimeout(() => navigate('/order-status', { state: { transactionId: formData.transactionId } }), 1200);
    } catch (error) {
      setMessage(`error:${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!product) return <div className="container text-center" style={{ padding: '2rem 0' }}><p>No product selected.</p><button className="btn btn-primary" onClick={() => navigate('/products')}>Back to Products</button></div>;

  return (
    <div className="checkout-page">
      <div className="container">
        <button className="back-button" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>
        <h1>Secure Checkout</h1>
        <div className="checkout-container">
          <aside className="summary-card">
            <div className="summary-item"><img src={product.imageUrl} alt={product.name} /><div><h3>{product.name}</h3><p className="text-muted">{product.category}</p></div></div>
            <div className="summary-divider" />
            <p>Unit Price <strong>Rs {product.price}</strong></p>
            <p>Quantity <strong>{formData.quantity}</strong></p>
            <p>Total <strong>Rs {total}</strong></p>
          </aside>

          <section className="payment-form-container">
            <div className="upi-section text-center">
              <h3>Scan QR to Pay</h3>
              {settings?.payment?.qrCodeUrl ? <img className="checkout-qr" src={settings.payment.qrCodeUrl} alt="QR" /> : <div className="qr-placeholder">QR coming soon</div>}
              <p>UPI ID: <strong>{settings?.payment?.upiId || 'blooms@upi'}</strong></p>
            </div>

            <form onSubmit={handleSubmit} className="form">
              {message && <div className={`alert ${message.startsWith('success') ? 'alert-success' : 'alert-danger'}`}>{message.replace(/^(success|error):/, '')}</div>}
              <div className="form-group"><label>Name *</label><input name="customerName" value={formData.customerName} onChange={handleInputChange} required /></div>
              <div className="form-group"><label>Phone *</label><input name="phone" value={formData.phone} onChange={handleInputChange} pattern="[0-9]{10}" required /></div>
              <div className="form-group"><label>Address *</label><textarea name="address" value={formData.address} onChange={handleInputChange} required /></div>
              <div className="form-group"><label>Quantity *</label><input name="quantity" type="number" min="1" value={formData.quantity} onChange={handleInputChange} required /></div>
              <div className="form-group"><label>Transaction ID *</label><input name="transactionId" value={formData.transactionId} onChange={handleInputChange} required /></div>
              <div className="form-group"><label>Payment Screenshot *</label><input type="file" accept="image/*" onChange={handleFileChange} required />{preview && <img src={preview} alt="preview" className="upload-preview" />}</div>
              <button className="btn btn-primary" disabled={loading}>{loading ? 'Submitting...' : 'Submit Order'}</button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
