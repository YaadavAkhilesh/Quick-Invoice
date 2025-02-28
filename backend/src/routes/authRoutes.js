const express = require('express'); 
const router = express.Router();    
const authController = require('../controllers/authController');
const authenticate = require('../middlewares/authenticate');
const upload = require('../config/multer');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, authController.updateProfile);
router.post('/verify-forgot-password', authController.verifyForgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/profile/image', authenticate, upload.single('image'), authController.uploadProfileImage);
router.get('/profile/image/:id', authController.getProfileImage);

router.post('/send-email-otp', authController.sendEmailOTP);
router.post('/verify-email-otp', authController.verifyEmailOTP);

module.exports = router;