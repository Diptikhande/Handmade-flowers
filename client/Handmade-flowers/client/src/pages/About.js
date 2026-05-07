import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="container">
        {/* Header */}
        <div className="about-header">
          <h1>🌸 About Our Business</h1>
          <p>Our Story & Premium Craft</p>
        </div>

        {/* Story Section */}
        <section className="story-section">
          <div className="story-container">
            <div className="story-image">
              <div className="story-placeholder">🎨</div>
            </div>
            <div className="story-content">
              <h2>✨ Our Journey</h2>
              <p>
                What started as a creative hobby has blossomed into a passion for creating beautiful, handmade artificial flowers. Each flower is crafted with love, care, and meticulous attention to detail using premium, sustainable materials.
              </p>
              <p>
                We believe that everyone deserves beautiful, affordable decorations and gifts. Our mission is to bring joy, elegance, and creativity to homes and celebrations through our unique, professionally-designed handmade creations.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mission-section">
          <div className="mission-card">
            <h3>🎯 Our Mission</h3>
            <p>
              To provide exquisite, sustainable, and affordable handmade flowers that bring joy, creativity, and timeless elegance to every occasion.
            </p>
          </div>

          <div className="mission-card">
            <h3>💚 Our Values</h3>
            <ul>
              <li>✓ Premium quality craftsmanship</li>
              <li>✓ Sustainability and eco-friendliness</li>
              <li>✓ Customer satisfaction & delight</li>
              <li>✓ Innovative creative design</li>
              <li>✓ Affordable luxury pricing</li>
            </ul>
          </div>

          <div className="mission-card">
            <h3>⭐ Why Choose Us</h3>
            <ul>
              <li>✓ 100% handmade with precision</li>
              <li>✓ Fully customizable designs</li>
              <li>✓ Quick & reliable turnaround</li>
              <li>✓ Premium eco-friendly materials</li>
              <li>✓ 24/7 customer support</li>
            </ul>
          </div>
        </section>

        {/* Services Section */}
        <section className="services-section">
          <h2>✨ What We Offer</h2>
          <div className="services-grid">
            <div className="service-card">
              <span className="service-icon">🔑</span>
              <h3>Premium Keychains</h3>
              <p>Cute, colorful, and durable flower keychains for your stylish collection</p>
            </div>
            <div className="service-card">
              <span className="service-icon">🧲</span>
              <h3>Fridge Magnets</h3>
              <p>Beautiful floral magnets to transform and brighten your kitchen space</p>
            </div>
            <div className="service-card">
              <span className="service-icon">👑</span>
              <h3>Hair Clips</h3>
              <p>Elegant and unique hair accessories that elevate any hairstyle</p>
            </div>
            <div className="service-card">
              <span className="service-icon">🪴</span>
              <h3>Flower Pots</h3>
              <p>Exquisite decorative arrangements perfect for modern home decor</p>
            </div>
            <div className="service-card">
              <span className="service-icon">💐</span>
              <h3>Premium Bouquets</h3>
              <p>Custom designer bouquets for weddings, celebrations & special moments</p>
            </div>
            <div className="service-card">
              <span className="service-icon">🎨</span>
              <h3>Custom Creations</h3>
              <p>Personalized bespoke designs tailored perfectly to your vision & needs</p>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="cta-section">
          <h2>Get in Touch</h2>
          <p>Have questions? We'd love to hear from you!</p>
          <a href="/contact" className="btn btn-primary btn-large" style={{ maxWidth: '300px' }}>
            Contact Us
          </a>
        </section>
      </div>
    </div>
  );
};

export default About;
