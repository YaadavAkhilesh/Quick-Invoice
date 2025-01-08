const jwt = require('jsonwebtoken'); // We're using JWT to handle authentication tokens.
const { JWT_SECRET } = require('../config/keys'); // The secret key for signing and verifying tokens.
const Vendor = require('../models/Vendor'); // The Vendor model to check if the vendor exists.

// Middleware to authenticate a vendor using JWT. This ensures only authorized vendors can access certain routes.
const authenticate = async (req, res, next) => {
  try {
    // Extract the token from the Authorization header. It usually looks like "Bearer <token>".
    const token = req.headers.authorization?.split(' ')[1]; // Get the token after "Bearer"

    // If no token is provided, return an error
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Verify the token using the JWT secret key
    const decoded = jwt.verify(token, JWT_SECRET); // Decode the token to get the vendor's ID

    // Find the vendor in the database using the decoded ID from the token
    const vendor = await Vendor.findOne({ v_id: decoded.id });

    // If the vendor doesn't exist, the token is invalid. Tell the user to log in again.
    if (!vendor) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // If everything checks out, attach the vendor object to the request. This lets other routes know who's making the request.
    req.vendor = vendor;

    // Move to the next middleware or route handler. The vendor is authenticated!
    next();
  } catch (error) {
    // If any error occurs (e.g., the token is invalid or expired), return an error
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authenticate; // Export the middleware for use in other files