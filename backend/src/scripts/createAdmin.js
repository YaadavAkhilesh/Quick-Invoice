// require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config({ path: '../../.env' });

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        
        const adminData = {
            username: process.env.ADMIN_USERNAME,
            password: process.env.ADMIN_PASSWORD,
            email: process.env.ADMIN_EMAIL,
            role: 'admin'
        };

        const admin = new Admin(adminData);
        await admin.save();
        
        console.log('Admin created successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
