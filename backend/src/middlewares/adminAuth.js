const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const adminAuth = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No authentication token, access denied'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if it's an admin token
        if (decoded.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized as admin'
            });
        }

        // Find admin by id
        const admin = await Admin.findById(decoded.id);
        
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Admin not found'
            });
        }

        // Add admin to request object
        req.user = decoded;
        req.token = token;
        
        next();
    } catch (error) {
        console.error('Error in admin authentication:', error);
        res.status(401).json({
            success: false,
            message: 'Token is not valid'
        });
    }
};

module.exports = adminAuth;
