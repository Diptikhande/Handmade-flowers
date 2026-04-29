import axios from 'axios';

const resolveApiBaseUrl = () => {
  const envUrl = process.env.REACT_APP_API_URL?.trim();

  if (!envUrl) {
    if (process.env.NODE_ENV === 'production') {
      return '/api';
    }
    return 'http://localhost:5000/api';
  }

  const trimmed = envUrl.replace(/\/$/, '');
  if (trimmed.endsWith('/api')) {
    return trimmed;
  }

  return `${trimmed}/api`;
};

const API_BASE_URL = resolveApiBaseUrl();

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const hasAdminSession = !!localStorage.getItem('adminToken');
    const isAdminPath = window.location.pathname.startsWith('/admin');

    if (error.response?.status === 401 && hasAdminSession) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      if (isAdminPath && window.location.pathname !== '/admin/login') {
        window.location.assign('/admin/login');
      }
    }
    return Promise.reject(error);
  }
);

export const productAPI = {
  getAllProducts: () => apiClient.get('/products'),
  getProductById: (id) => apiClient.get(`/products/${id}`),
  getProductsByCategory: (category) => apiClient.get(`/products/category/${category}`),
  createProduct: (formData) => apiClient.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateProduct: (id, formData) => apiClient.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteProduct: (id) => apiClient.delete(`/products/${id}`),
};

export const orderAPI = {
  createOrder: (formData) => apiClient.post('/orders', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getAllOrders: () => apiClient.get('/orders'),
  getOrderById: (id) => apiClient.get(`/orders/${id}`),
  getOrderByTransactionId: (transactionId) => apiClient.get(`/orders/status/${transactionId}`),
  getOrderStats: () => apiClient.get('/orders/stats/dashboard'),
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

export const settingsAPI = {
  getPublicSettings: () => apiClient.get('/settings'),
  updateSettings: (data) => apiClient.put('/settings', data),
};
