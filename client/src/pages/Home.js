import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiFeather, FiGift, FiTruck, FiAward, FiArrowRight } from 'react-icons/fi';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import './Home.css';

const features = [
  { icon: FiFeather, title: 'Handcrafted Designs', description: 'Made with love and attention to detail.' },
  { icon: FiGift, title: 'Custom Orders', description: 'Personalized creations for every occasion.' },
  { icon: FiTruck, title: 'Fast Delivery', description: 'Quick and safe doorstep delivery.' },
  { icon: FiAward, title: 'Premium Quality', description: 'High-quality materials with elegant finish.' },
];

const categories = [
  { key: 'bouquet', name: 'Bouquets', desc: 'Elegant floral bundles for celebrations.' },
  { key: 'flower-pot', name: 'Flower Pots', desc: 'Beautiful handmade decor pieces.' },
  { key: 'hair-clip', name: 'Hair Clips', desc: 'Cute floral accessories.' },
  { key: 'keychain', name: 'Keychains', desc: 'Mini aesthetic floral charms.' },
];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productAPI.getAllProducts()
      .then(({ data }) => setFeatured(data.data?.slice(0, 6) || []))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home">

      {/* HERO */}
      <section className="hero" data-reveal>
        <div className="hero-overlay">
          <div className="hero-content container">
            <h1>Blooms & Looms</h1>
            <p>Handcrafted elegance for every special moment ✨</p>

            <div className="hero-buttons">
              <Link to="/products" className="btn btn-primary">Shop Now</Link>
              <Link to="/custom-order" className="btn btn-outline">Custom Order</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section" data-reveal>
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Choose your favorite handmade collection</p>

          <div className="grid-4">
            {categories.map((c) => (
              <Link key={c.key} to={`/products?category=${c.key}`} className="card">
                <h3>{c.name}</h3>
                <p>{c.desc}</p>
                <span className="link">Explore <FiArrowRight /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section soft" data-reveal>
        <div className="container">
          <h2 className="section-title">Why Choose Us</h2>
          <p className="section-subtitle">Premium handmade products with love</p>

          <div className="grid-4">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="card center">
                  <Icon className="icon" />
                  <h3>{f.title}</h3>
                  <p>{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="section" data-reveal>
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Best Sellers</h2>
              <p className="section-subtitle">Most loved handmade creations</p>
            </div>

            <Link to="/products" className="btn btn-secondary">View All</Link>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading..." />
          ) : (
            <div className="grid-3">
              {featured.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default Home;