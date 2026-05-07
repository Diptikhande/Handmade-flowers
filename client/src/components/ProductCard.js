import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resolveImageUrl } from '../services/api';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart, onBuyNow }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const imageUrl = resolveImageUrl(product.imageUrl, product.updatedAt);
  const fallbackImage = '/images/img1.jpg';

  const openDetails = () => {
    navigate(`/product/${product._id}`);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onBuyNow?.(product);
  };

  return (
    <article className="product-card" role="button" tabIndex={0} onClick={openDetails} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openDetails()}>
      <div className="product-image" aria-label={product.name}>
        {imageUrl && !imageError ? (
          <img src={imageUrl} alt={product.name} onError={() => setImageError(true)} loading="lazy" />
        ) : (
          <img src={fallbackImage} alt={product.name} className="product-fallback-image" loading="lazy" />
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <span className={`category-badge ${product.category}`}>{product.category.replace('-', ' ')}</span>
        {product.shortDescription && <p className="product-description">{product.shortDescription}</p>}
        <div className="product-footer">
          <span className="product-price">Rs {product.price}</span>
          <div className="product-actions">
            <button onClick={handleAddToCart} className="btn btn-secondary btn-small">Add to Cart</button>
            <button onClick={handleBuyNow} className="btn btn-primary btn-small">Buy Now</button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
