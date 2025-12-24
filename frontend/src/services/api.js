// src/api.js   (or src/api/api.js – wherever you keep it)
import axios from 'axios';

export const API_URL = 'http://localhost:5000/api';
export const BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
});

// -----------------------------------------------------------------
// 1️⃣  Request interceptor – auth token + viewport headers
// -----------------------------------------------------------------
api.interceptors.request.use(
  (config) => {
    // ---- auth token ------------------------------------------------
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ---- viewport size --------------------------------------------
    // These headers are read by the server‑side desktopGuard middleware.
    config.headers['X-Viewport-Width'] = window.innerWidth.toString();
    config.headers['X-Viewport-Height'] = window.innerHeight.toString();

    // ---- Content‑Type handling ------------------------------------
    // Don't set Content-Type for FormData (file uploads)
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// -----------------------------------------------------------------
// 2️⃣  Response interceptor – error handling
// -----------------------------------------------------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Skip redirect for auth-related endpoints (login, register, forgot-password)
    const url = error.config?.url || '';
    const isAuthEndpoint = /\/(login|register|send-email-otp|verify-email-otp|verify-forgot-password|reset-password)$/.test(url);

    if (error.response && error.response.status === 401 && !isAuthEndpoint) {
      // If unauthorized (and NOT on auth endpoints), clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/* -----------------------------------------------------------------
   The rest of the file (authService, profileService, etc.) is
   exactly the same as you posted – no changes needed there.
----------------------------------------------------------------- */

export const authService = {
  login: async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) throw error.response.data;
      throw { message: 'Network error occurred' };
    }
  },

  sendEmailOTP: async (email) => {
    try {
      const response = await api.post('/auth/send-email-otp', { email });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) throw error.response.data;
      throw { message: 'Failed to send OTP' };
    }
  },

  verifyEmailOTP: async (email, otp) => {
    try {
      const response = await api.post('/auth/verify-email-otp', { email, otp });
      console.log('Verify OTP response:', response);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) throw error.response.data;
      throw { message: 'Failed to verify OTP' };
    }
  },

  register: async (formData) => {
    try {
      console.log('Registration data:', formData);
      const response = await api.post('/auth/register', formData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) throw error.response.data;
      throw { message: 'Network error occurred' };
    }
  },

  verifyForgotPassword: async (formData) => {
    try {
      const response = await api.post('/auth/verify-forgot-password', {
        username: formData.username,
        email: formData.email,
        mobile: formData.mobile,
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) throw error.response.data;
      throw { message: 'Network error occurred' };
    }
  },

  resetPassword: async (formData) => {
    try {
      const response = await api.post('/auth/reset-password', {
        username: formData.username,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  uploadProfileImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await api.post('/auth/profile/image', formData);
      if (response.data.success) {
        return `${BASE_URL}${response.data.imagePath}`;
      }
      throw new Error(response.data.message || 'Failed to upload image');
    } catch (error) {
      console.error('Profile image upload error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};

export const profileService = {
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      if (!response.data?.vendor) {
        throw new Error('No vendor data found in response');
      }
      return response.data;
    } catch (error) {
      console.error('Profile error:', error);
      throw error;
    }
  },

  getProfileImage: async () => {
    try {
      const response = await api.get('/auth/profile/image');
      if (response.data.success && response.data.imagePath) {
        return `${BASE_URL}${response.data.imagePath}`;
      }
      return null;
    } catch (error) {
      console.error('Error fetching profile image:', error);
      return null;
    }
  },

  getVendorData: async () => {
    try {
      const response = await api.get('/auth/vendor');
      if (!response.data?.vendor) {
        throw new Error('No vendor data found in response');
      }
      return response.data;
    } catch (error) {
      console.error('Error fetching vendor data:', error);
      throw error;
    }
  },

  updateProfile: async (formData) => {
    try {
      if (!formData) throw new Error('No profile data provided');

      const apiData = {
        v_brand_name: formData.brandName,
        v_name: formData.ownerName,
        v_telephone: formData.telephone,
        v_mail: formData.email,
        v_address: formData.address,
        v_business_code: formData.businessCode,
        v_business_type: formData.businessType,
      };

      const response = await api.put('/auth/profile', apiData);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  uploadProfileImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await api.post('/auth/profile/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Profile image upload error:', error);
      throw error;
    }
  },
};

export default api;