import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import './Products.css';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');

  const categories = [
    { value: '', label: 'All Products' },
    { value: 'keychain', label: 'Keychains' },
    { value: 'fridge-magnet', label: 'Fridge Magnets' },
    { value: 'hair-clip', label: 'Hair Clips' },
    { value: 'flower-pot', label: 'Flower Pots' },
    { value: 'bouquet', label: 'Bouquets' },
  ];

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let response;

      if (selectedCategory) {
        response = await productAPI.getProductsByCategory(selectedCategory);
      } else {
        response = await productAPI.getAllProducts();
      }

      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="products-page">
      <div className="container">
        {/* Header */}
        <div className="products-header">
          <h1>Our Products</h1>
          <p>Explore our beautiful collection of handmade flowers</p>
        </div>

        <div className="products-container">
          {/* Sidebar - Categories Filter */}
          <aside className="products-sidebar">
            <div className="filter-card">
              <h3>Filter by Category</h3>
              <div className="filter-options">
                {categories.map((category) => (
                  <label key={category.value} className="filter-option">
                    <input
                      type="radio"
                      name="category"
                      value={category.value}
                      checked={selectedCategory === category.value}
                      onChange={() => handleCategoryChange(category.value)}
                    />
                    <span>{category.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content - Products Grid */}
          <main className="products-main">
            {loading ? (
              <LoadingSpinner message="Loading products..." />
            ) : products.length > 0 ? (
              <>
                <div className="products-count">
                  Showing {products.length} product
                  {products.length !== 1 ? 's' : ''}
                </div>
                <div className="grid grid-3">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </>
            ) : (
              <div className="no-products">
                <p>No products found in this category.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;
