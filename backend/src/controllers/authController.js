const jwt = require("jsonwebtoken");
const Vendor = require("../models/Vendor");
const { JWT_SECRET, JWT_EXPIRE } = require("../config/keys");
const { generateUniqueId } = require("../utils/uniqueIdentifier");
const { validateUsername, validatePassword, validateGSTNumber, validateEmail } = require("../utils/validation");
const { sendOTP, verifyOTP } = require("../utils/emailService");

const authController = {
  // Send OTP for email verification
  sendEmailOTP: async (req, res) => {
    try {
      const { email } = req.body;

      // Validate email format
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        return res.status(400).json({ message: emailValidation.message });
      }

      // Send OTP
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

  // Verify email OTP
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

  // Register a new vendor
  register: async (req, res) => {
    try {
      const { username, password, email, name, brand_name, telephone, address, business_type, gst_no, mobile } = req.body;

      // Validate Username
      const usernameValidation = validateUsername(username);
      if (!usernameValidation.isValid) {
        console.error(`[${new Date().toISOString()}] Username validation error: ${usernameValidation.message}`);
        return res.status(400).json({ message: usernameValidation.message });
      }

      // Validate Password
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        console.error(`[${new Date().toISOString()}] Password validation error: ${passwordValidation.message}`);
        return res.status(400).json({ message: passwordValidation.message });
      }

      // Validate Email
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        console.error(`[${new Date().toISOString()}] Email validation error: ${emailValidation.message}`);
        return res.status(400).json({ message: emailValidation.message });
      }

      // Validate GST Number
      if (!validateGSTNumber(gst_no)) {
        return res.status(400).json({
          message: "GST number must be exactly 15 characters",
        });
      }

      // Check for existing username, email, and business code
      const [existingUsername, existingEmail, existingBusinessCode] = await Promise.all([
        Vendor.findOne({ v_username: username }),
        Vendor.findOne({ v_mail: email }),
        Vendor.findOne({ v_business_code: gst_no })
      ]);

      const errors = [];
      if (existingUsername) {
        errors.push("Username already taken");
      }
      if (existingEmail) {
        errors.push("Email already exists");
      }
      if (existingBusinessCode) {
        errors.push("Business Code (GSTIN) already exists");
      }

      if (errors.length > 0) {
        return res.status(400).json({
          message: errors.join(", ")
        });
      }

      // Create a new vendor with all required fields
      const vendor = new Vendor({
        v_id: generateUniqueId("V"),
        v_username: username,
        v_password: password,
        v_mail: email,
        v_name: name,
        v_brand_name: brand_name,  // Store brand name
        v_telephone: telephone,
        v_address: address,
        v_business_type: business_type,
        v_business_code: gst_no,  // Using gst_no as business code
        v_gst_no: gst_no,
        v_mobile: mobile,
        v_plan: 'free',
        v_pro_status: false
      });

      console.log('Creating vendor with data:', {
        username,
        email,
        name,
        brand_name,
        business_type,
        gst_no
      });

      // Save the new vendor to the database
      await vendor.save();

      // Generate a token for the new vendor
      const token = jwt.sign({ id: vendor.v_id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRE,
      });

      // Send a success response with the token
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

      // Find the vendor by username
      const vendor = await Vendor.findOne({ v_username: username });
      console.log('Login attempt for username:', username); // Debug log
      
      if (!vendor) {
        console.log('Vendor not found'); // Debug log
        return res.status(401).json({
          success: false,
          message: "Invalid credentials"
        });
      }

      // Check if the password matches
      const isMatch = await vendor.comparePassword(password);
      console.log('Password match:', isMatch); // Debug log
      
      if (!isMatch) {
        console.log('Password mismatch'); // Debug log
        return res.status(401).json({
          success: false,
          message: "Invalid credentials"
        });
      }

      // Generate a token
      const token = jwt.sign({ id: vendor.v_id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRE
      });
      console.log('Generated token:', token); // Debug log

      // Send success response with token
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

  // Verify forgot password
  verifyForgotPassword: async (req, res) => {
    try {
      const { username, email, mobile } = req.body;

      // Find the vendor by username, email, and mobile
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

      // Find the vendor
      const vendor = await Vendor.findOne({
        v_username: username,
        v_mail: email,
        v_mobile: mobile
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
          v_business_type: vendor.v_business_type,
          v_business_code: vendor.v_business_code,
          v_gst_no: vendor.v_gst_no,
          v_mobile: vendor.v_mobile,
          v_profile_image: vendor.v_profile_image || ''
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

      // Update only allowed fields
      const allowedUpdates = [
        'v_name',
        'v_brand_name',
        'v_telephone',
        'v_address',
        'v_business_type',
        'v_mail',
        'v_brand_logo',
        'v_mobile',
        'v_profile_image'
      ];

      // Filter out any fields that aren't in allowedUpdates
      Object.keys(req.body).forEach(key => {
        if (allowedUpdates.includes(key)) {
          vendor[key] = req.body[key];
        }
      });

      await vendor.save();

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        vendor: {
          v_id: vendor.v_id,
          v_name: vendor.v_name,
          v_brand_name: vendor.v_brand_name,
          v_telephone: vendor.v_telephone,
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
      res.status(500).json({
        success: false,
        message: "Error updating profile",
        error: error.message
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

      // Update profile image path
      vendor.v_profile_image = `/uploads/profiles/${req.file.filename}`;
      await vendor.save();

      res.json({ 
        success: true,
        message: 'Profile image uploaded successfully',
        imagePath: vendor.v_profile_image
      });
    } catch (error) {
      console.error('Error uploading profile image:', error);
      res.status(500).json({ 
        success: false,
        message: 'Error uploading profile image' 
      });
    }
  },

  getProfileImage: async (req, res) => {
    try {
      const vendor = await Vendor.findOne({ v_id: req.params.id });
      if (!vendor || !vendor.v_profile_image) {
        return res.status(404).json({ 
          success: false,
          message: 'Profile image not found' 
        });
      }

      // Send the image path
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

module.exports = authController;   // Export the auth controller