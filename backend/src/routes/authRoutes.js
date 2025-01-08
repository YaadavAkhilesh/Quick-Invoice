const express = require('express'); // Express is used to create web servers and APIs
const router = express.Router();    // Router is used to define API routes
const authController = require('../controllers/authController');
const authenticate = require('../middlewares/authenticate');

// This route is called when Vendor wants to sign up or register. `register` function in `authController` handles the registration logic.
router.post('/register', authController.register);

// This route is called when Vendor wants to signin or login. `login` function in `authController` handles the login logic.
router.post('/login', authController.login);

// Route for getting the user's profile
// This route is protected, meaning the user must be logged in to access it.
// The `authenticate` middleware checks the user's login status, and if they are logged in, the `getProfile` function in `authController` is called to return the user's profile.
router.get('/profile', authenticate, authController.getProfile);

module.exports = router;