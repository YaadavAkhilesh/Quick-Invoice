const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // We're using bcrypt to hash passwords for security.

const vendorSchema = new mongoose.Schema({
  v_id: {
    type: String,
    unique: true,
    required: true
  },
  v_username: {
    type: String,
    unique: true,
    required: true
  },
  v_password: {
    type: String,
    required: true
  },
  v_mail: {
    type: String,
    unique: true,
    required: true
  },
  v_name: {
    type: String,
    required: true
  },
  v_brand_name: {
    type: String,
    required: true
  },
  v_telephone: {
    type: String,
    required: true
  },
  v_address: {
    type: String,
    required: true
  },
  v_business_type: {
    type: String,
    required: true
  },
  v_business_code: {
    type: String,
    required: true,
    unique: true,
    description: 'Either GST number or business registration code'
  },
  v_brand_logo: String,
  v_website: {
    type: String,
  },
  v_template: String,
  v_plan: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free'
  },
  v_subscription_status: {
    type: String,
    enum: ['active', 'expired', 'none'],
    default: 'none'
  },
  v_subscription_end_date: {
    type: Date
  },
  v_template_count: {
    type: Number,
    default: 0
  },
  v_templates_created: {
    type: Number,
    default: 0  // This tracks total templates ever created, even if deleted
  },
  v_invoice_count: {
    type: Number,
    default: 0  // Track number of invoices created by the vendor
  },
  v_profile_image: {
    type: String,  // Storing the image path
    default: ''
  },
}, {
  timestamps: true  // Automatically adds `createdAt` and `updatedAt`
});

// Middleware to hashing the password before saving the vendor to the database.
vendorSchema.pre('save', async function (next) {
  // Checking if the password was changed or updated
  if (!this.isModified('v_password')) {
    // If the password is the same as before, skip hashing it and continue saving
    return next();
  }

  try {
    // Generate a salt (random data) to make the hash more secure
    const salt = await bcrypt.genSalt(10);
    // Hash the password using the salt
    this.v_password = await bcrypt.hash(this.v_password, salt);
    // Move to the next middleware or save the document
    next();
  } catch (error) {
    // Pass any errors to the next middleware
    next(error);
  }
});

// Method to compare a candidate password with the hashed password in the database
vendorSchema.methods.comparePassword = async function (candidatePassword) {
  // Use bcrypt to compare the candidate password with the stored hashed password
  return await bcrypt.compare(candidatePassword, this.v_password);
};

module.exports = mongoose.model('Vendor', vendorSchema);