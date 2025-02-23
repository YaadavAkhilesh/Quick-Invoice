const express = require('express'); 
const router = express.Router();    
const authController = require('../controllers/authController');
const authenticate = require('../middlewares/authenticate');
const upload = require('../config/multer');

// This route is called when Vendor wants to sign up or register. `register` function in `authController` handles the registration logic.
router.post('/register', authController.register);

// This route is called when Vendor wants to signin or login. `login` function in `authController` handles the login logic.
router.post('/login', authController.login);

// Route for getting the user's profile
// This route is protected, meaning the user must be logged in to access it.
// The `authenticate` middleware checks the user's login status, and if they are logged in, the `getProfile` function in `authController` is called to return the user's profile.
router.get('/profile', authenticate, authController.getProfile);

// This route is called when Vendor wants to update their profile.
// This route is protected, meaning the user must be logged in to access it.
// The `authenticate` middleware checks the user's login status, and if they are logged in, the `updateProfile` function in `authController` is called to update the user's profile.
router.put('/profile', authenticate, authController.updateProfile);

// This route is called when Vendor wants to verify forgot password. `verifyForgotPassword` function in `authController` handles the verification logic.
router.post('/verify-forgot-password', authController.verifyForgotPassword);

// This route is called when Vendor wants to reset password. `resetPassword` function in `authController` handles the reset logic.
router.post('/reset-password', authController.resetPassword);

// This route is called when Vendor wants to upload their profile image.
// This route is protected, meaning the user must be logged in to access it.
// The `authenticate` middleware checks the user's login status, and if they are logged in, the `uploadProfileImage` function in `authController` is called to upload the user's profile image.
router.post('/profile/image', authenticate, upload.single('image'), authController.uploadProfileImage);

// This route is called when Vendor wants to fetch their profile image.
// The `getProfileImage` function in `authController` is called to return the user's profile image.
router.get('/profile/image/:id', authController.getProfileImage);

router.post('/send-email-otp', authController.sendEmailOTP);
router.post('/verify-email-otp', authController.verifyEmailOTP);

module.exports = router;