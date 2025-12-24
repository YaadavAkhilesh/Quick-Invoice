const jwt = require("jsonwebtoken");
const Vendor = require("../models/Vendor");
const { JWT_SECRET, JWT_EXPIRE } = require("../config/keys");
const { generateUniqueId } = require("../utils/uniqueIdentifier");
const {
  validateUsername,
  validatePassword,
  validateEmail,
  validateBrandName,
  validateOwnerName,
  validateTelephone,
  validateBusinessCode,
  validateGSTNumber
} = require("../utils/validation");
const { sendOTP, verifyOTP } = require("../utils/emailService");
const fs = require('fs');
const path = require('path');
const validator = require('validator');
const { processAndSaveImage } = require('../config/multer');

const authController = {
  // Sending OTP for email verification
  sendEmailOTP: async (req, res) => {
    try {
      const { email } = req.body;

      // Validating email format
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        return res.status(400).json({ message: emailValidation.message });
      }

      // Sending OTP
      const sent = await sendOTP(email);
      if (!sent) {
        return res.status(500).json({ message: "Failed to send OTP" });
      }

      res.json({ message: "OTP sent successfully" });
    } catch (error) {
      console.error('Error sending OTP:', error);
      res.status(500).json({ message: "Error sending OTP" });
    }
  },

  // Verifying email OTP
  verifyEmailOTP: async (req, res) => {
    try {
      const { email, otp } = req.body;
      const result = verifyOTP(email, otp);

      if (!result.isValid) {
        return res.status(400).json({ message: result.message });
      }

      res.json({ message: "OTP verified successfully" });
    } catch (error) {
      console.error('Error verifying OTP:', error);
      res.status(500).json({ message: "Error verifying OTP" });
    }
  },

  // Registering a new vendor
  register: async (req, res) => {
    try {
      const { 
        username, 
        password, 
        email, 
        name, 
        brand_name, 
        telephone, 
        address, 
        business_type, 
        gst_no, 
        mobile,
        v_website = ''
      } = req.body;

      // Required field validation
      if (!username || !password || !email || !name || !brand_name || !telephone || 
          !address || !business_type || !gst_no || !mobile) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Validate Username
      const usernameValidation = validateUsername(username);
      if (!usernameValidation.isValid) {
        return res.status(400).json({ message: usernameValidation.message });
      }

      // Validate Password
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        return res.status(400).json({ message: passwordValidation.message });
      }

      // Validate Email
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        return res.status(400).json({ message: emailValidation.message });
      }

      // Validate Brand Name
      const brandNameValidation = validateBrandName(brand_name);
      if (!brandNameValidation.isValid) {
        return res.status(400).json({ message: brandNameValidation.message });
      }

      // Validate Owner Name
      const ownerNameValidation = validateOwnerName(name);
      if (!ownerNameValidation.isValid) {
        return res.status(400).json({ message: ownerNameValidation.message });
      }

      // Validate Telephone
      const telephoneValidation = validateTelephone(telephone);
      if (!telephoneValidation.isValid) {
        return res.status(400).json({ message: telephoneValidation.message });
      }

      // Validate Business Code (GST)
      const gstValidation = validateGSTNumber(gst_no);
      if (!gstValidation.isValid) {
        return res.status(400).json({ message: gstValidation.message });
      }

      // Check for existing username, email, and business code
      const [existingUsername, existingEmail, existingBusinessCode] = await Promise.all([
        Vendor.findOne({ v_username: username }),
        Vendor.findOne({ v_mail: email }),
        Vendor.findOne({ v_business_code: gst_no })
      ]);

      const errors = [];
      if (existingUsername) errors.push("Username already taken");
      if (existingEmail) errors.push("Email already exists");
      if (existingBusinessCode) errors.push("Business Code (GSTIN) already exists");

      if (errors.length > 0) {
        return res.status(400).json({ message: errors.join(", ") });
      }

      // Creating a new vendor with all required fields
      const vendor = new Vendor({
        v_id: generateUniqueId("V"),
        v_username: username,
        v_password: password,
        v_mail: email,
        v_name: name,
        v_brand_name: brand_name,
        v_telephone: telephone,
        v_address: address,
        v_business_type: business_type,
        v_business_code: gst_no,
        v_mobile: mobile,
        v_website,
        v_plan: 'free',
        v_subscription_status: 'none'
      });

      await vendor.save();

      // Generating a token for the new vendor
      const token = jwt.sign({ 
        id: vendor.v_id,
        v_id: vendor.v_id,
        username: vendor.v_username 
      }, JWT_SECRET, {
        expiresIn: JWT_EXPIRE,
      });

      res.status(201).json({
        message: "Vendor registered successfully",
        token,
      });
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error registering vendor:`, error);
      res.status(500).json({
        message: "Error registering vendor",
        error: error.message,
      });
    }
  },

  // Log in an existing vendor
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      // Finding the vendor by username
      const vendor = await Vendor.findOne({ v_username: username });
      console.log('Login attempt for username:', username);
      
      if (!vendor) {
        console.log('Vendor not found');
        return res.status(401).json({
          success: false,
          message: "Invalid credentials"
        });
      }

      // Check if the password matches
      const isMatch = await vendor.comparePassword(password);
      console.log('Password match:', isMatch);
      
      if (!isMatch) {
        console.log('Password mismatch');
        return res.status(401).json({
          success: false,
          message: "Invalid credentials"
        });
      }

      // Generating a token
      const token = jwt.sign({ 
        id: vendor.v_id,
        v_id: vendor.v_id,
        username: vendor.v_username 
      }, JWT_SECRET, {
        expiresIn: JWT_EXPIRE
      });
      console.log('Generated token:', token);

      // Sending success response with token
      res.status(200).json({
        success: true,
        message: "Login successful",
        token
      });
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Login error:`, error);
      res.status(500).json({
        success: false,
        message: "Error during login",
        error: error.message
      });
    }
  },

  // Verifying forgot password
  verifyForgotPassword: async (req, res) => {
    try {
      const { username, email, mobile } = req.body;

      // Finding the vendor by username, email, and mobile
      const vendor = await Vendor.findOne({
        v_username: username,
        v_mail: email,
        v_mobile: mobile
      });

      if (!vendor) {
        return res.status(404).json({
          success: false,
          message: "No account found with these details"
        });
      }

      // If found, return success
      res.status(200).json({
        success: true,
        message: "Account verified successfully"
      });
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error verifying account:`, error.message);
      res.status(500).json({
        success: false,
        message: "Error verifying account",
        error: error.message
      });
    }
  },

  // Reset password
  resetPassword: async (req, res) => {
    try {
      const { username, email, mobile, password } = req.body;

      console.log(username, email, password)

      // Find the vendor
      const vendor = await Vendor.findOne({
        v_username: username,
        v_mail: email,
        // v_mobile: mobile
      });

      if (!vendor) {
        return res.status(404).json({
          message: "No account found with these details"
        });
      }

      // Update password
      vendor.v_password = password; // Password will be hashed by the pre-save middleware
      await vendor.save();

      res.status(200).json({
        message: "Password updated successfully"
      });
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error resetting password:`, error.message);
      res.status(500).json({
        message: "Error resetting password",
        error: error.message
      });
    }
  },

  // Get the profile of the logged-in vendor
  getProfile: async (req, res) => {
    try {
      const vendor = await Vendor.findOne({ v_id: req.user.id });
      if (!vendor) {
        return res.status(404).json({
          message: "Vendor not found",
        });
      }

      res.json({
        success: true,
        vendor: {
          v_id: vendor.v_id,
          v_username: vendor.v_username,
          v_name: vendor.v_name,
          v_brand_name: vendor.v_brand_name,
          v_telephone: vendor.v_telephone,
          v_mail: vendor.v_mail,
          v_address: vendor.v_address,
          v_website: vendor.v_website,
          v_business_type: vendor.v_business_type,
          v_business_code: vendor.v_business_code,
          v_mobile: vendor.v_mobile,
          v_profile_image: vendor.v_profile_image || '',
          v_plan: vendor.v_plan || 'free',
          v_subscription_status: vendor.v_subscription_status || 'none'
        },
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({
        message: "Error fetching profile",
        error: error.message,
      });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const vendor = await Vendor.findOne({ v_id: req.user.id });

      if (!vendor) {
        return res.status(404).json({
          success: false,
          message: "Vendor not found"
        });
      }

      // Update only allowed fields with sanitization
      const allowedUpdates = [
        'v_name',
        'v_brand_name',
        'v_telephone',
        'v_address',
        'v_business_type',
        'v_mail',
        'v_brand_logo',
        'v_mobile',
        'v_profile_image',
        'v_website'
      ];

      // Sanitize and validate inputs
      const sanitizedBody = {};
      Object.keys(req.body).forEach(key => {
        if (allowedUpdates.includes(key)) {
          let value = req.body[key];
          if (typeof value === 'string') {
            value = validator.trim(value); // Trim whitespace
            if (key === 'v_mail') {
              if (!validator.isEmail(value) || value.length > 254) {
                throw new Error('Invalid email format or length');
              }
            } else if (key === 'v_address' || key === 'v_name' || key === 'v_brand_name') {
              value = validator.escape(value); // Escape HTML to prevent XSS
              if (value.length > 255) {
                throw new Error(`${key} too long`);
              }
            } else if (key === 'v_telephone' || key === 'v_mobile') {
              if (!validator.isMobilePhone(value, 'any') || value.length > 15) {
                throw new Error('Invalid phone number');
              }
            } else if (key === 'v_website') {
              if (value && !validator.isURL(value)) {
                throw new Error('Invalid website URL');
              }
            }
          }
          sanitizedBody[key] = value;
        }
      });

      // Apply sanitized updates
      Object.assign(vendor, sanitizedBody);

      await vendor.save();

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        vendor: {
          v_id: vendor.v_id,
          v_name: vendor.v_name,
          v_brand_name: vendor.v_brand_name,
          v_telephone: vendor.v_telephone,
          v_website: vendor.v_website,
          v_address: vendor.v_address,
          v_business_type: vendor.v_business_type,
          v_business_code: vendor.v_business_code,
          v_mail: vendor.v_mail,
          v_brand_logo: vendor.v_brand_logo,
          v_username: vendor.v_username,
          v_gst_no: vendor.v_gst_no,
          v_mobile: vendor.v_mobile,
          v_profile_image: vendor.v_profile_image
        }
      });
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error updating profile:`, error.message);
      const message = process.env.NODE_ENV === 'production' ? 'Error updating profile' : error.message;
      res.status(500).json({
        success: false,
        message: message
      });
    }
  },

  uploadProfileImage: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No image file provided'
        });
      }

      const vendor = await Vendor.findOne({ v_id: req.user.id });
      if (!vendor) {
        return res.status(404).json({
          success: false,
          message: 'Vendor not found'
        });
      }

      // Process and save image
      const originalExt = path.extname(req.file.originalname).toLowerCase();
      const filename = await processAndSaveImage(req.file.buffer, req.user.id, originalExt);

      // Update profile image path
      const imagePath = `/uploads/profiles/${filename}`;
      vendor.v_profile_image = imagePath;
      await vendor.save();

      res.json({
        success: true,
        message: 'Profile image uploaded successfully',
        imagePath: imagePath
      });
    } catch (error) {
      console.error('Error uploading profile image:', error);
      const message = process.env.NODE_ENV === 'production' ? 'Error uploading profile image' : error.message;
      res.status(500).json({
        success: false,
        message: message
      });
    }
  },

  getProfileImage: async (req, res) => {
    try {
      const vendor = await Vendor.findOne({ v_id: req.user.id });
      if (!vendor || !vendor.v_profile_image) {
        return res.json({
          success: false,
          imagePath: null
        });
      }

      res.json({
        success: true,
        imagePath: vendor.v_profile_image
      });
    } catch (error) {
      console.error('Error fetching profile image:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching profile image'
      });
    }
  }
};

module.exports = authController;