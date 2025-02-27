import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const BASE_URL = 'http://localhost:5000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
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

// Add a response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // If unauthorized, clear token and redirect to login
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Authentication service
export const authService = {
    login: async (username, password) => {
        try {
            const response = await api.post('/auth/login', { username, password });
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                throw error.response.data;
            }
            throw { message: "Network error occurred" };
        }
    },

    sendEmailOTP: async (email) => {
        try {
            const response = await api.post('/auth/send-email-otp', { email });
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                throw error.response.data;
            }
            throw { message: "Failed to send OTP" };
        }
    },

    verifyEmailOTP: async (email, otp) => {
        try {
            const response = await api.post('/auth/verify-email-otp', { email, otp });
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                throw error.response.data;
            }
            throw { message: "Failed to verify OTP" };
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
            if (error.response && error.response.data) {
                throw error.response.data;
            }
            throw { message: "Network error occurred" };
        }
    },

    verifyForgotPassword: async (formData) => {
        try {
            const response = await api.post('/auth/verify-forgot-password', {
                username: formData.username,
                email: formData.email,
                mobile: formData.mobile
            });
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                throw error.response.data;
            }
            throw { message: "Network error occurred" };
        }
    },

    resetPassword: async (formData) => {
        try {
            const response = await api.post('/auth/reset-password', {
                username: formData.username,
                email: formData.email,
                mobile: formData.mobile,
                password: formData.password
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

            const response = await api.post('/auth/profile/image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Profile image upload error:', error);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
    }
};

// Add profile service
export const profileService = {
    getProfile: async () => {
        try {
            const response = await api.get('/auth/profile');
            // console.log('Profile API Response:', response.data); 

            if (!response.data?.vendor) {
                throw new Error('No vendor data found in response');
            }

            return response.data;
        } catch (error) {
            console.error('Profile error:', error);
            throw error;
        }
    },

    getProfileImage: async (vendorId) => {
        try {
            const response = await api.get(`/auth/profile/image/${vendorId}`);
            // console.log('Profile image response:', response.data); // Debug log
            if (response.data.success && response.data.imagePath) {
                const fullUrl = `${BASE_URL}${response.data.imagePath}`;
                // console.log('Constructed image URL:', fullUrl); // Debug log
                return fullUrl;
            }
            return null;
        } catch (error) {
            console.error('Error fetching profile image:', error);
            return null;
        }
    },

    updateProfile: async (formData) => {
        try {
            if (!formData) {
                throw new Error('No profile data provided');
            }

            // Map the form data to match API field names
            const apiData = {
                v_brand_name: formData.brandName,
                v_name: formData.ownerName,
                v_telephone: formData.telephone,
                v_mail: formData.email,
                v_address: formData.address,
                v_business_code: formData.businessCode,
                v_business_type: formData.businessType,
            };

            // console.log('Updating profile with:', apiData); // Debug log

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
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Profile image upload error:', error);
            throw error;
        }
    }
};

export default api;
