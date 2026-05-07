import React, { useEffect, useRef, useState } from 'react';
import { productAPI, resolveImageUrl } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './ManageProducts.css';

const initialForm = {
  name: '',
  price: '',
  description: '',
  shortDescription: '',
  category: '',
  stock: 100,
  image: null,
  existingImageUrl: null,
  existingImageUpdatedAt: null,
};

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const fileInputRef = useRef(null);

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await productAPI.getAllProducts();
      setProducts(data.data || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files?.[0] || null }));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setShowForm(false);
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingId && !formData.image) {
      alert('Please upload a product image');
      return;
    }

    try {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('price', formData.price);
      form.append('description', formData.description);
      form.append('shortDescription', formData.shortDescription);
      form.append('category', formData.category);
      form.append('stock', formData.stock);
      if (formData.image) form.append('image', formData.image);

      if (editingId) await productAPI.updateProduct(editingId, form);
      else await productAPI.createProduct(form);

      await fetchProducts();
      resetForm();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      shortDescription: product.shortDescription || '',
      category: product.category,
      stock: product.stock || 0,
      image: null,
      existingImageUrl: product.imageUrl,
      existingImageUpdatedAt: product.updatedAt,
    });
    setEditingId(product._id);
    setShowForm(true);
    if (fileInputRef.current) fileInputRef.current.value = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await productAPI.deleteProduct(id);
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting product');
    }
  };

  return (
    <div className="manage-products-page">
      <div className="container">
        <div className="page-header">
          <h1>Manage Products</h1>
          <button className="btn btn-primary" onClick={() => (showForm ? resetForm() : setShowForm(true))}>
            {showForm ? 'Cancel' : 'Add Product'}
          </button>
        </div>

        {showForm && (
          <div className="product-form-container">
            <form onSubmit={handleSubmit} className="product-form">
              <h2>{editingId ? 'Edit Product' : 'Add New Product'}</h2>
              <div className="form-row">
                <div className="form-group"><label>Product Name *</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} required /></div>
                <div className="form-group"><label>Price (Rs) *</label><input type="number" name="price" value={formData.price} onChange={handleInputChange} min="0" step="0.01" required /></div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} required>
                    <option value="">Select Category</option>
                    <option value="keychain">Keychain</option>
                    <option value="fridge-magnet">Fridge Magnet</option>
                    <option value="hair-clip">Hair Clip</option>
                    <option value="flower-pot">Flower Pot</option>
                    <option value="bouquet">Bouquet</option>
                    <option value="bookmark">Bookmark</option>
                  </select>
                </div>
                <div className="form-group"><label>Stock *</label><input type="number" name="stock" value={formData.stock} onChange={handleInputChange} min="0" required /></div>
              </div>
              <div className="form-group">
                <label>Product Image {!editingId && '*'}</label>
                <input key={editingId || 'new'} ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} required={!editingId} />
                {(formData.image || formData.existingImageUrl) && (
                  <div className="image-preview-container">
                    <img 
                      src={formData.image ? URL.createObjectURL(formData.image) : resolveImageUrl(formData.existingImageUrl, formData.existingImageUpdatedAt)}
                      alt="preview" 
                      style={{ width: '100%', maxWidth: 200, height: 'auto', maxHeight: 200, objectFit: 'cover', marginTop: 12, borderRadius: 8, border: '1px solid #ddd' }}
                      onError={(e) => {
                        e.target.alt = 'Failed to load image';
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="form-group"><label>Short Description</label><input type="text" name="shortDescription" value={formData.shortDescription} onChange={handleInputChange} maxLength="200" /></div>
              <div className="form-group"><label>Full Description *</label><textarea name="description" value={formData.description} onChange={handleInputChange} required></textarea></div>
              <div className="form-buttons"><button type="submit" className="btn btn-primary">{editingId ? 'Update Product' : 'Add Product'}</button><button type="button" className="btn btn-outline" onClick={resetForm}>Cancel</button></div>
            </form>
          </div>
        )}

        {loading ? <LoadingSpinner /> : products.length === 0 ? (
          <div className="empty-state"><h3>No Products Yet</h3><p>Click "Add Product" to get started</p></div>
        ) : (
          <div className="products-list-container">
            <h2 className="products-count">Products ({products.length})</h2>
            <div className="products-grid">
              {products.map((product) => (
                <div key={product._id} className="product-card">
                  <div className="product-image-wrapper">
                    {product.imageUrl ? (
                      <img 
                        src={resolveImageUrl(product.imageUrl, product.updatedAt)}
                        alt={product.name} 
                        className="product-image"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="image-placeholder" style={{ display: product.imageUrl ? 'none' : 'flex' }}>
                      <span>📷</span>
                      <p>No Image</p>
                    </div>
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="description">{product.shortDescription}</p>
                    <div className="product-footer">
                      <span className="price">Rs {product.price}</span>
                      <div className="actions"><button className="btn btn-secondary btn-small" onClick={() => handleEdit(product)}>Edit</button><button className="btn btn-danger btn-small" onClick={() => handleDelete(product._id)}>Delete</button></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProducts;
