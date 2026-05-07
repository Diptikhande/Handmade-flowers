import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiFeather, FiGift, FiTruck, FiAward, FiArrowRight, FiShoppingCart } from 'react-icons/fi';
import { productAPI } from '../services/api';
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
  { key: 'fridge-magnet', name: 'Fridge Magnets', desc: 'Colorful flower magnets for your kitchen.' },
  { key: 'bookmark', name: 'Bookmarks', desc: 'Elegant handmade reading markers.' },
];

const categoryImages = {
  bouquet: '/images/img12.jpg',
  'flower-pot': '/images/img13.jpg',
  'hair-clip': '/images/img14.jpg',
  keychain: '/images/img15.jpg',
  'fridge-magnet': '/images/img10.jpg',
  bookmark: '/images/img18.jpg',
};

const fallbackProducts = [
  { name: 'Pink Bouquet', price: 499, image: '/images/img1.jpg' },
  { name: 'Lavender Set', price: 399, image: '/images/img2.jpg' },
  { name: 'Sunflower Pot', price: 699, image: '/images/img17.jpg' },
  { name: 'Blue Floral', price: 459, image: '/images/img16.jpg' },
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

  const handleLoginSuccess = ({ type }) => {
    if (type === 'customer') {
      if (loginAction === 'addToCart') {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart.push(selectedProduct);
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${selectedProduct.name} added to cart!`);
      } else if (loginAction === 'buyNow') {
        navigate(`/product/${selectedProduct._id}`);
      }
    } else if (type === 'admin') {
      navigate('/admin/dashboard');
    }
  };

  const displayProducts = featured.length > 0 ? featured : fallbackProducts;

  return (
    <div className="home">
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

      <section className="hero" data-reveal>
        <div className="hero-slider" aria-hidden="true">
          <div className="slide" style={{ backgroundImage: "url('/images/img6.jpg')" }} />
          <div className="slide" style={{ backgroundImage: "url('/images/img8.jpg')" }} />
          <div className="slide" style={{ backgroundImage: "url('/images/img3.jpg')" }} />
          <div className="slide" style={{ backgroundImage: "url('/images/img4.jpg')" }} />
          <div className="slide" style={{ backgroundImage: "url('/images/img5.jpg')" }} />
        </div>

        <div className="hero-overlay">
          <div className="hero-content container">
            <h1>Blooms & Looms</h1>
            <p>Handcrafted elegance for every special moment</p>

            <div className="hero-buttons">
              <Link to="/products" className="btn btn-primary">Shop Now</Link>
              <Link to="/custom-order" className="btn btn-outline">Custom Order</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" data-reveal>
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Choose your favorite handmade collection</p>

          <div className="category-grid">
            {categories.map((category) => (
              <Link key={category.key} to={`/products?category=${category.key}`} className="category-card-clean">
                <div className="category-img-clean">
                  <img src={categoryImages[category.key]} alt={category.name} />
                </div>

                <div className="category-content">
                  <h3>{category.name}</h3>
                  <p>{category.desc}</p>
                  <span className="explore-btn">Explore <FiArrowRight /></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section soft why-us" data-reveal>
        <div className="container">
          <h2 className="why-title">Why Choose Us</h2>

          <div className="why-grid">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="why-card">
                  <div className="why-icon">
                    <Icon />
                  </div>

                  <div className="why-text">
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
