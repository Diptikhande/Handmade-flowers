import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiFeather, FiGift, FiTruck, FiAward } from 'react-icons/fi';
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
      if (loginAction === 'buyNow') {
        navigate(`/product/${selectedProduct._id}`);
      }
    } else {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="home">

      {/* LOGIN MODAL */}
      <UnifiedLoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* 🔥 HERO SECTION */}
      <section className="hero">

        <div className="hero-slider">
          <div className="slide" style={{ backgroundImage: "url('/images/img6.jpg')" }}></div>
          <div className="slide" style={{ backgroundImage: "url('/images/img8.jpg')" }}></div>
          <div className="slide" style={{ backgroundImage: "url('/images/img3.jpg')" }}></div>
          <div className="slide" style={{ backgroundImage: "url('/images/img4.jpg')" }}></div>
          <div className="slide" style={{ backgroundImage: "url('/images/img5.jpg')" }}></div>
        </div>

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

      {/* 🌸 CATEGORY SECTION (PREMIUM CLEAN) */}
      <section className="section category-section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Choose your favorite handmade collection </p>
          <p className="section-subtitle"></p>

          <div className="category-grid">

            {[
              { key: 'bouquet', name: 'Bouquets', desc: 'Elegant floral bundles', img: '/images/img12.jpg' },
              { key: 'flower-pot', name: 'Flower Pots', desc: 'Beautiful decor pieces', img: '/images/img13.jpg' },
              { key: 'hair-clip', name: 'Hair Clips', desc: 'Cute floral accessories', img: '/images/img14.jpg' },
              { key: 'keychain', name: 'Keychains', desc: 'Mini aesthetic charms', img: '/images/img15.jpg' },
              { key: 'keychain', name: 'Keychains', desc: 'Mini aesthetic charms', img: '/images/img18.jpg' },              
              { key: 'custom', name: 'Custom', desc: 'Made just for you', img: '/images/img5.jpg' }
            ].map((item, index) => (

              <Link 
                key={index} 
                to={`/products?category=${item.key}`} 
                className="category-card-clean"
              >

                <div className="category-img-clean">
                  <img src={item.img} alt={item.name} />
                </div>

                <div className="category-content">
                  <h3>{item.name}</h3>
                  <p>{item.desc}</p>

                  <span className="explore-btn">
                    Explore →
                  </span>
                </div>

              </Link>

            ))}

          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
<section className="section why-us">
  <div className="container">

    <h2 className="why-title">Why Choose Us </h2>

    <div className="why-grid">
      {features.map((f) => {
        const Icon = f.icon;
        return (
          <div key={f.title} className="why-card">
            <div className="why-icon">
              <Icon />
            </div>

            <div className="why-text">
              <h3>{f.title}</h3>
              <p>{f.description}</p>
            </div>
          </div>
        );
      })}
    </div>

  </div>
</section>

      {/* BEST SELLERS */}
<section className="section best-sellers">
  <div className="container">

    <div className="section-header">
      <div>
        <h2 className="section-title">Best Sellers </h2>
        <p className="section-subtitle">Most loved handmade creations</p>
      </div>

      <Link to="/products" className="btn btn-secondary">View All</Link>
    </div>

    {loading ? (
      <LoadingSpinner message="Loading..." />
    ) : (
      <div className="product-grid">

        {(featured.length > 0 ? featured : [
          { name: "Pink Bouquet", price: 499, image: "/images/img1.jpg" },
          { name: "Lavender Set", price: 399, image: "/images/img2.jpg" },
          { name: "Sunflower Pot", price: 699, image: "/images/img17.jpg" },
          { name: "Blue Floral", price: 459, image: "/images/img16.jpg" }
        ]).map((p, i) => (

          <div className="product-card" key={i}>

            <div className="product-img">
              <img src={p.image || p.images?.[0]} alt={p.name} />
            </div>

            <div className="product-info">
              <h3>{p.name}</h3>
              <p className="price">₹{p.price}</p>

              <button className="btn btn-primary small">
                View Product →
              </button>
            </div>

          </div>
        ))}

      </div>
    )}
  </div>
</section>

    </div>
  );
};

export default Home;