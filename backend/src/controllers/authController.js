import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Vendor } from '../models/Vendor';
import { validateRegistration } from '../utils/validation';

const authController = {
  register: async (req, res) => {
    try {
      const {
        username,
        password,
        email,
        name,
        telephone,
        address,
        business_type,
        gst_no,
        mobile
      } = req.body;

      // Validate input
      const validationErrors = validateRegistration(req.body);
      if (validationErrors.length > 0) {
        return res.status(400).json({ errors: validationErrors });
      }

      // Check if vendor already exists
      const existingVendor = await Vendor.findOne({
        $or: [{ v_username: username }, { v_mail: email }]
      });

      if (existingVendor) {
        return res.status(400).json({
          message: 'Username or email already exists'
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new vendor
      const vendor = new Vendor({
        v_username: username,
        v_password: hashedPassword,
        v_mail: email,
        v_name: name,
        v_telephone: telephone,
        v_address: address,
        v_business_type: business_type,
        v_business_code: generateUniqueId('B'),
        v_gst_no: gst_no,
        v_mobile: mobile
      });

      await vendor.save();

      // Generate token
      const token = jwt.sign(
        { id: vendor.v_id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      // Log registration without sensitive information
      console.log(`POST /api/auth/register 201 - User registered: ${username}`);

      res.status(201).json({
        message: 'Vendor registered successfully',
        token
      });
    } catch (error) {
      console.error('Error registering vendor:', error);
      res.status(500).json({
        message: 'Error registering vendor',
        error: error.message
      });
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      // Find vendor
      const vendor = await Vendor.findOne({ v_username: username });
      if (!vendor) {
        return res.status(401).json({
          message: 'Invalid credentials'
        });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, vendor.v_password);
      if (!isMatch) {
        return res.status(401).json({
          message: 'Invalid credentials'
        });
      }

      // Generate token
      const token = jwt.sign(
        { id: vendor.v_id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      res.json({
        message: 'Login successful',
        token,
        vendor: {
          id: vendor.v_id,
          username: vendor.v_username,
          name: vendor.v_name,
          email: vendor.v_mail
        }
      });
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({
        message: 'Error logging in',
        error: error.message
      });
    }
  },

  getProfile: async (req, res) => {
    try {
      const vendor = await Vendor.findOne({ v_id: req.vendor.v_id })
        .select('-v_password');
      
      res.json(vendor);
    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({
        message: 'Error fetching profile',
        error: error.message
      });
    }
  }
};

export default authController;