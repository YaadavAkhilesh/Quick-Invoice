const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticate = require('../middlewares/authenticate');
const { upload } = require('../config/multer');
const { profileRateLimit } = require('../middlewares/rateLimit');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', profileRateLimit, authenticate, authController.getProfile);
router.put('/profile', profileRateLimit, authenticate, authController.updateProfile);
router.post('/profile/image', profileRateLimit, authenticate, upload.single('image'), authController.uploadProfileImage);
router.get('/profile/image', profileRateLimit, authenticate, authController.getProfileImage);

router.post('/send-email-otp', authController.sendEmailOTP);
router.post('/verify-email-otp', authController.verifyEmailOTP);
router.post('/verify-forgot-password', authController.verifyForgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
