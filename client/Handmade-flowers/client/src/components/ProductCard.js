import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart, onBuyNow }) => {
  const handleAddToCart = (e) => {
    e.preventDefault();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    if (onBuyNow) {
      onBuyNow(product);
    }
  };

  return (
    <article className="product-card">
      <Link to={`/product/${product._id}`} className="product-image" aria-label={product.name}>
        <img src={product.imageUrl} alt={product.name} />
      </Link>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>

        <span className={`category-badge ${product.category}`}>
          {product.category.replace('-', ' ')}
        </span>

        {product.shortDescription && (
          <p className="product-description">{product.shortDescription}</p>
        )}

        <div className="product-footer">
          <span className="product-price">₹{product.price}</span>
          <div className="product-actions">
            <button onClick={handleAddToCart} className="btn btn-secondary btn-small">
              Add to Cart
            </button>
            <button onClick={handleBuyNow} className="btn btn-primary btn-small">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
