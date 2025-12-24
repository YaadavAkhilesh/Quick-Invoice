import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const createSubscriptionOrder = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/subscription/create-order`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error creating subscription order' };
  }
};

export const verifyPayment = async (paymentData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/subscription/verify-payment`,
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error verifying payment' };
  }
};

export const getSubscriptionStatus = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `${API_URL}/subscription/status`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error getting subscription status' };
  }
}; 