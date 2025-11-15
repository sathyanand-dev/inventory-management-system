import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.error?.message || 'An error occurred';
    
    // Handle unauthorized errors (but not for login/register attempts)
    if (error.response?.status === 401 && !error.config.url.includes('/auth/')) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    } else {
      toast.error(errorMessage);
    }
    
    return Promise.reject(error);
  }
);

// Item API endpoints
export const itemAPI = {
  // Get all items with filters
  getAll: async (params = {}) => {
    const response = await apiClient.get('/items', { params });
    return response.data;
  },

  // Get single item
  getById: async (id) => {
    const response = await apiClient.get(`/items/${id}`);
    return response.data;
  },

  // Create item
  create: async (itemData) => {
    const response = await apiClient.post('/items/add', itemData);
    toast.success('Item created successfully!');
    return response.data;
  },

  // Update item
  update: async (id, itemData) => {
    const response = await apiClient.put(`/items/${id}`, itemData);
    toast.success('Item updated successfully!');
    return response.data;
  },

  // Delete item
  delete: async (id) => {
    const response = await apiClient.delete(`/items/${id}`);
    toast.success('Item deleted successfully!');
    return response.data;
  },

  // Get dashboard stats
  getStats: async () => {
    const response = await apiClient.get('/items/stats');
    return response.data;
  },

  // Get low stock items
  getLowStock: async (threshold = 10) => {
    const response = await apiClient.get('/items/low-stock', {
      params: { threshold }
    });
    return response.data;
  },
};

// Auth API endpoints
export const authAPI = {
  // Login
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    toast.success('Login successful!');
    return response.data;
  },

  // Register
  register: async (username, email, password) => {
    const response = await apiClient.post('/auth/register', { username, email, password });
    toast.success('Registration successful!');
    return response.data;
  },

  // Get current user
  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

export default apiClient;
