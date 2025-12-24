const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const authenticate = require('../middlewares/authenticate');

// All routes require authentication
router.use(authenticate);

// Create a new subscription order
router.post('/create-order', subscriptionController.createOrder);

// Verify payment and activate subscription
router.post('/verify-payment', subscriptionController.verifyPayment);

// Get subscription status
router.get('/status', subscriptionController.getStatus);

// New secure admin key activation endpoint
router.post('/activate-with-admin-key', subscriptionController.activateSubscriptionWithAdminKey);

module.exports = router; 