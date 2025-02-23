const jwt = require('jsonwebtoken'); 
const { JWT_SECRET } = require('../config/keys'); 

// Middleware to authenticate a vendor using JWT. This ensures only authorized vendors can access certain routes.
const authenticate = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        console.log('Token:', token);
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Decoded token:', decoded);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ message: 'Authentication failed' });
    }
};

module.exports = authenticate; 