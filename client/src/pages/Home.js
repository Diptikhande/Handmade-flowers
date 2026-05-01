import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiFeather, FiGift, FiTruck, FiAward, FiArrowRight } from 'react-icons/fi';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import UnifiedLoginModal from '../components/UnifiedLoginModal';
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
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loginAction, setLoginAction] = useState(null);

  useEffect(() => {
    productAPI.getAllProducts()
      .then(({ data }) => setFeatured(data.data?.slice(0, 6) || []))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = (product) => {
    setSelectedProduct(product);
    setLoginAction('addToCart');
    setLoginModalOpen(true);
  };

  const handleBuyNow = (product) => {
    setSelectedProduct(product);
    setLoginAction('buyNow');
    setLoginModalOpen(true);
  };

  const handleLoginSuccess = ({ type, data }) => {
    if (type === 'customer') {
      // Handle customer login
      if (loginAction === 'addToCart') {
        // Add product to cart and show notification
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart.push(selectedProduct);
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${selectedProduct.name} added to cart!`);
      } else if (loginAction === 'buyNow') {
        // Redirect to product details page
        navigate(`/product/${selectedProduct._id}`);
      }
    } else if (type === 'admin') {
      // Redirect admin to dashboard
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="home">
      {/* Login Modal */}
      <UnifiedLoginModal
        isOpen={loginModalOpen}
        onClose={() => {
          setLoginModalOpen(false);
          setSelectedProduct(null);
          setLoginAction(null);
        }}
        onLoginSuccess={handleLoginSuccess}
        loginType="customer"
      />

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
                <ProductCard
                  key={p._id}
                  product={p}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                />
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default Home;