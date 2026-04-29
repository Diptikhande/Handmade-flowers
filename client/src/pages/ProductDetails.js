import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    productAPI.getProductById(id)
      .then(({ data }) => setProduct(data.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner message="Loading product details..." />;
  if (!product) return <div className="container text-center" style={{ padding: '2rem 0' }}><p>Product not found.</p><button className="btn btn-primary" onClick={() => navigate('/products')}>Back to Products</button></div>;

  return (
    <div className="product-details-page">
      <div className="container">
        <button className="back-button" onClick={() => navigate(-1)}>Back</button>
        <div className="product-details-container fade-up">
          <div className="product-details-image"><img src={product.imageUrl} alt={product.name} /></div>
          <div className="product-details-info">
            <h1>{product.name}</h1>
            <p className="text-muted">{product.category.replace('-', ' ')}</p>
            <div className="price">Rs {product.price}</div>
            <p>{product.description}</p>
            <div className="quantity-row">
              <label htmlFor="qty">Quantity</label>
              <input id="qty" type="number" min="1" value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value || 1)))} />
            </div>
            <div className="action-buttons">
              <button className="btn btn-primary" onClick={() => navigate('/checkout', { state: { product, quantity } })}>Buy Now</button>
              <button className="btn btn-outline" onClick={() => navigate('/custom-order')}>Custom Order</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
