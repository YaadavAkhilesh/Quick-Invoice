const jwt = require("jsonwebtoken");
const Vendor = require("../models/Vendor");
const { JWT_SECRET, JWT_EXPIRE } = require("../config/keys");
const { generateUniqueId } = require("../utils/uniqueIdentifier");
const { validateUsername, validatePassword, validateGSTNumber } = require("../utils/validation");

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
        mobile,
      } = req.body;

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

      // Validate GST No
      if (!validateGSTNumber(gst_no)) {
        return res.status(400).json({
          message: "GST number must be exactly 15 characters",
        });
      }

      // Check if vendor already exists
      const existingVendor = await Vendor.findOne({
        $or: [{ v_username: username }, { v_mail: email }],
      });

      if (existingVendor) {
        console.error(`[${new Date().toISOString()}] Vendor already exists: ${username}`);
        return res.status(400).json({
          message: "Username or email already exists",
        });
      }

      // Create new vendor
      const vendor = new Vendor({
        v_id: generateUniqueId("V"),
        v_username: username,
        v_password: password,
        v_mail: email,
        v_name: name,
        v_telephone: telephone,
        v_address: address,
        v_business_type: business_type,
        v_business_code: generateUniqueId("B"),
        v_gst_no: gst_no,
        v_mobile: mobile,
      });

      await vendor.save();

      // Generate token
      const token = jwt.sign({ id: vendor.v_id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRE,
      });

      res.status(201).json({
        message: "Vendor registered successfully",
        token,
      });
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error registering vendor:`, error.message);
      res.status(500).json({
        message: "Error registering vendor",
        error: error.message,
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
          message: "Invalid credentials",
        });
      }

      // Check password
      const isMatch = await vendor.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          message: "Invalid credentials",
        });
      }

      // Generate token
      const token = jwt.sign({ id: vendor.v_id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRE,
      });

      res.json({
        message: "Login successful",
        token,
        vendor: {
          id: vendor.v_id,
          username: vendor.v_username,
          name: vendor.v_name,
          email: vendor.v_mail,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: "Error logging in",
        error: error.message,
      });
    }
  },

  getProfile: async (req, res) => {
    try {
      const vendor = await Vendor.findOne({ v_id: req.vendor.v_id }).select(
        "-v_password"
      );

      res.json(vendor);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching profile",
        error: error.message,
      });
    }
  },
};

module.exports = authController;