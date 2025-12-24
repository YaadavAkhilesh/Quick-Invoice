const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

const adminAuthController = {
    // Register a new admin (this should be used internally or by super admin)
    register: async (req, res) => {
        try {
            const { username, password, email } = req.body;

            // Check if admin already exists
            const existingAdmin = await Admin.findOne({ 
                $or: [{ username }, { email }] 
            });

            if (existingAdmin) {
                return res.status(400).json({
                    success: false,
                    message: 'Admin with this username or email already exists'
                });
            }

            // Create new admin
            const admin = new Admin({
                username,
                password,
                email
            });

            await admin.save();

            res.status(201).json({
                success: true,
                message: 'Admin registered successfully'
            });
        } catch (error) {
            console.error('Error in admin registration:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    },

    // Admin login
    login: async (req, res) => {
        try {
            const { username, password } = req.body;

            // Find admin by username
            const admin = await Admin.findOne({ username });
            
            if (!admin) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            // Check password
            const isMatch = await admin.comparePassword(password);
            
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }

            // Generate JWT token
            const token = jwt.sign(
                { id: admin._id, role: 'admin' },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                success: true,
                token,
                admin: {
                    id: admin._id,
                    username: admin.username,
                    email: admin.email,
                    role: admin.role
                }
            });
        } catch (error) {
            console.error('Error in admin login:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    },

    // Get admin profile
    getProfile: async (req, res) => {
        try {
            const admin = await Admin.findById(req.user.id).select('-password');
            
            if (!admin) {
                return res.status(404).json({
                    success: false,
                    message: 'Admin not found'
                });
            }

            res.json({
                success: true,
                admin
            });
        } catch (error) {
            console.error('Error in getting admin profile:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
};

module.exports = adminAuthController;
