import axios from 'axios';

const resolveApiBaseUrl = () => {
  const envUrl = process.env.REACT_APP_API_URL?.trim();

  if (!envUrl) {
    if (process.env.NODE_ENV === 'production') {
      return '/api';
    }
    // Use relative path in development to work with proxy
    return '/api';
  }

  const trimmed = envUrl.replace(/\/$/, '');
  if (trimmed.endsWith('/api')) {
    return trimmed;
  }

  return `${trimmed}/api`;
};

const API_BASE_URL = resolveApiBaseUrl();

const resolveBackendBaseUrl = () => {
  if (API_BASE_URL.endsWith('/api')) {
    // If it's a relative path like '/api', return empty string to use relative URLs
    if (API_BASE_URL === '/api') {
      return '';
    }
    return API_BASE_URL.slice(0, -4);
  }
  return API_BASE_URL;
};

export const BACKEND_BASE_URL = resolveBackendBaseUrl();

const appendCacheKey = (url, cacheKey) => {
  if (!cacheKey) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}v=${encodeURIComponent(cacheKey)}`;
};

export const resolveImageUrl = (imageUrl, cacheKey) => {
  if (!imageUrl) return '';
  
  // If it's already a full Cloudinary URL, return it with cache key
  if (/^https?:\/\/res\.cloudinary\.com/i.test(imageUrl)) {
    return appendCacheKey(imageUrl, cacheKey);
  }
  
  // If it's any other full HTTP(S) URL, extract the path or keep as-is
  if (/^https?:\/\//i.test(imageUrl)) {
    // Try to extract just the /uploads/ part
    const match = imageUrl.match(/\/uploads\/.+/);
    if (match) {
      return appendCacheKey(match[0], cacheKey);
    }
    // If we can't extract, just return with cache key (might be Cloudinary or other)
    return appendCacheKey(imageUrl, cacheKey);
  }

  // For relative paths, normalize to /uploads/filename format
  const normalizedPath = imageUrl.startsWith('/')
    ? imageUrl
    : `/uploads/${imageUrl.split(/[\\/]/).pop()}`;

  // Always use relative paths - the proxy will handle routing
  return appendCacheKey(normalizedPath, cacheKey);
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  // Try admin token first, then customer token
  const adminToken = localStorage.getItem('adminToken');
  const customerToken = localStorage.getItem('customerToken');
  const token = adminToken || customerToken;
  
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // Let the browser/axios set the correct multipart boundary for FormData.
  if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
    if (config.headers?.delete) {
      config.headers.delete('Content-Type');
      config.headers.delete('content-type');
    } else {
      delete config.headers?.['Content-Type'];
      delete config.headers?.['content-type'];
    }
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const hasAdminSession = !!localStorage.getItem('adminToken');
    const hasCustomerSession = !!localStorage.getItem('customerToken');
    const isAdminPath = window.location.pathname.startsWith('/admin');

    if (error.response?.status === 401 && hasAdminSession) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      if (isAdminPath && window.location.pathname !== '/admin/login') {
        window.location.assign('/admin/login');
      }
    }

    if (error.response?.status === 401 && hasCustomerSession && isAdminPath) {
      localStorage.removeItem('customerToken');
      localStorage.removeItem('customerUser');
    }

    return Promise.reject(error);
  }
);

export const productAPI = {
  getAllProducts: () => apiClient.get('/products'),
  getProductById: (id) => apiClient.get(`/products/${id}`),
  getProductsByCategory: (category) => apiClient.get(`/products/category/${category}`),
  createProduct: (formData) => apiClient.post('/products', formData),
  updateProduct: (id, formData) => apiClient.put(`/products/${id}`, formData),
  deleteProduct: (id) => apiClient.delete(`/products/${id}`),
};

export const orderAPI = {
  createOrder: (formData) => apiClient.post('/orders', formData),
  getAllOrders: () => apiClient.get('/orders'),
  getOrderById: (id) => apiClient.get(`/orders/${id}`),
  getOrderByTransactionId: (transactionId) => apiClient.get(`/orders/status/${transactionId}`),
  getOrderStats: () => apiClient.get('/orders/stats/dashboard'),
  updateOrderStatus: (id, data) => apiClient.patch(`/orders/${id}/status`, data),
  approveOrder: (id) => apiClient.patch(`/orders/${id}/approve`),
  rejectOrder: (id, data) => apiClient.patch(`/orders/${id}/reject`, data),
};

export const customOrderAPI = {
  createCustomOrder: (data) => apiClient.post('/custom-orders', data),
  getAllCustomOrders: () => apiClient.get('/custom-orders'),
  getCustomOrderById: (id) => apiClient.get(`/custom-orders/${id}`),
  updateCustomOrder: (id, data) => apiClient.patch(`/custom-orders/${id}`, data),
  deleteCustomOrder: (id) => apiClient.delete(`/custom-orders/${id}`),
};

export const adminAPI = {
  setup: (data) => apiClient.post('/auth/setup-admin', data),
  login: (data) => apiClient.post('/auth/login', data),
  getProfile: () => apiClient.get('/auth/profile'),
};

export const customerAPI = {
  login: (data) => apiClient.post('/customers/login', data),
  register: (data) => apiClient.post('/customers/register', data),
  loginWithPassword: (data) => apiClient.post('/customers/login-password', data),
  googleLogin: (data) => apiClient.post('/customers/google-login', data),
  getProfile: () => apiClient.get('/customers/profile'),
  updateProfile: (data) => apiClient.put('/customers/profile', data),
  getOrders: () => apiClient.get('/customers/orders'),
};

export const contactAPI = {
  sendMessage: (data) => apiClient.post('/contacts', data),
  getAllContacts: () => apiClient.get('/contacts'),
  getContactById: (id) => apiClient.get(`/contacts/${id}`),
  updateContact: (id, data) => apiClient.put(`/contacts/${id}`, data),
  deleteContact: (id) => apiClient.delete(`/contacts/${id}`),
};

export const settingsAPI = {
  getPublicSettings: () => apiClient.get('/settings'),
  updateSettings: (data) => apiClient.put('/settings', data),
};
