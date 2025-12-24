const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminAuth = require('../middlewares/adminAuth');

// Protect all admin routes with admin authentication
router.use(adminAuth);

// Get all users
router.get('/users', adminController.getAllUsers);

// Delete a user
router.delete('/users/:userId', adminController.deleteUser);

module.exports = router;