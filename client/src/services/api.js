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
  timeout: 15000, // 15 second timeout for all requests
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Enhanced error handling with specific error codes
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const hasAdminSession = !!localStorage.getItem('adminToken');
    const isAdminPath = window.location.pathname.startsWith('/admin');

    // Handle 401 - Token expired or invalid
    if (error.response?.status === 401 && hasAdminSession) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      if (isAdminPath && window.location.pathname !== '/admin/login') {
        window.location.assign('/admin/login');
      }
    }

    // Handle 503 - Service Unavailable (Database connection issues)
    if (error.response?.status === 503) {
      const errorData = error.response.data;
      if (errorData?.error === 'DATABASE_UNAVAILABLE') {
        // Create a more user-friendly error message
        error.response.data.userMessage = 
          'The server is temporarily unavailable. Our team is working to reconnect the database. Please try again in a few moments.';
      }
    }

    // Handle network errors (connection refused, timeout, etc.)
    if (!error.response) {
      // Network error or timeout
      if (error.code === 'ECONNABORTED') {
        error.message = 'Request timeout - the server is not responding. Please check your internet connection or try again.';
      } else if (error.message === 'Network Error') {
        error.message = 'Network error - unable to connect to the server. Please check your internet connection.';
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

// Health check function to verify server connectivity before login
export const checkServerHealth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`, {
      timeout: 5000,
      withCredentials: true,
    });
    return {
      isHealthy: response.data.success,
      isDatabaseConnected: response.data.database === 'connected',
      state: response.data.dbState,
    };
  } catch (error) {
    return {
      isHealthy: false,
      isDatabaseConnected: false,
      state: 'disconnected',
      error: error.message,
    };
  }
};
