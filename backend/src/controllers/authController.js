const jwt = require("jsonwebtoken");
const Vendor = require("../models/Vendor");
const { JWT_SECRET, JWT_EXPIRE } = require("../config/keys");
const { generateUniqueId } = require("../utils/uniqueIdentifier");
const { validateUsername, validatePassword, validateGSTNumber } = require("../utils/validation");

const authController = {
  // Register a new vendor
  register: async (req, res) => {
    try {
      const { username, password, email, name, telephone, address, business_type, gst_no, mobile } = req.body;

      // Validate Username
      const usernameValidation = validateUsername(username);
      if (!usernameValidation.isValid) {
        console.error(`[${new Date().toISOString()}] Username validation error: ${usernameValidation.message}`);
        return res.status(400).json({ message: usernameValidation.message });   // Message from validation.js file
      }

      // Validate Password
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        console.error(`[${new Date().toISOString()}] Password validation error: ${passwordValidation.message}`);
        return res.status(400).json({ message: passwordValidation.message });   // Message from validation.js file
      }

      // Validate GST Number
      if (!validateGSTNumber(gst_no)) {
        return res.status(400).json({
          message: "GST number must be exactly 15 characters",
        });
      }

      // Check if the vendor already exists (by username or email)
      const existingVendor = await Vendor.findOne({
        $or: [{ v_username: username }, { v_mail: email }],
      });

      if (existingVendor) {
        console.error(`[${new Date().toISOString()}] Vendor already exists: ${username}`);
        return res.status(400).json({
          message: "Username or email already exists",
        });
      }

      // Create a new vendor
      const vendor = new Vendor({
        v_id: generateUniqueId("V"),    // Generate a unique vendor ID.
        v_username: username,
        v_password: password,     // Password will be hashed by the pre-save middleware in the Vendor model.
        v_mail: email,
        v_name: name,
        v_telephone: telephone,
        v_address: address,
        v_business_type: business_type,
        v_business_code: generateUniqueId("B"),   // Generate a unique business code.
        v_gst_no: gst_no,
        v_mobile: mobile,
      });
      // Save the new vendor to the database
      await vendor.save();

      // Generate a token for the new vendor
      const token = jwt.sign({ id: vendor.v_id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRE,    // Token expires after the specified time.
      });

      // Send a success response with the token
      res.status(201).json({
        message: "Vendor registered successfully",
        token,  // Send the token so the vendor can log in immediately.
      });
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error registering vendor:`, error.message);
      res.status(500).json({
        message: "Error registering vendor",
        error: error.message,     // Include the error message for debugging.
      });
    }
  },

  // Log in an existing vendor
  login: async (req, res) => {
    try {
      const { username, password } = req.body;      // Extract username and password from the request.

      // Find the vendor by username
      const vendor = await Vendor.findOne({ v_username: username });
      if (!vendor) {
        return res.status(401).json({
          message: "Invalid credentials",     // Vendor not found!
        });
      }

      // Check if the password matches the hashed password in the database
      const isMatch = await vendor.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          message: "Invalid credentials",     // wrong password!
        });
      }

      // Generate a token for the logged-in vendor
      const token = jwt.sign({ id: vendor.v_id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRE,    // Token expires after the specified time.
      });

      // Send a success response with the token and vendor details
      res.json({
        message: "Login successful",
        token,    // Send the token for future authenticated requests.
        vendor: {
          id: vendor.v_id,
          username: vendor.v_username,
          name: vendor.v_name,
          email: vendor.v_mail,
        },    // Send some vendor details for the frontend.
      });
    } catch (error) {
      res.status(500).json({
        message: "Error logging in",
        error: error.message,
      });
    }
  },

  // Get the profile of the logged-in vendor
  getProfile: async (req, res) => {
    try {
      // Find the vendor by their ID (from the JWT token) and exclude the password field
      const vendor = await Vendor.findOne({ v_id: req.vendor.v_id }).select("-v_password");
      res.json(vendor);   // Send the vendor's profile data.
    } catch (error) {
      res.status(500).json({
        message: "Error fetching profile",
        error: error.message,
      });
    }
  },
};

module.exports = authController;   // Export the auth controller