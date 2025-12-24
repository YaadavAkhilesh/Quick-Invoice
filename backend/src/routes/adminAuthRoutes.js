const express = require('express');
const router = express.Router();
const adminAuthController = require('../controllers/adminAuthController');
const adminAuth = require('../middlewares/adminAuth');

// Admin authentication routes
router.post('/register', adminAuthController.register);
router.post('/login', adminAuthController.login);
router.get('/profile', adminAuth, adminAuthController.getProfile);

module.exports = router;
