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
  v_mobile: { 
    type: String 
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
    unique: true 
  },
  v_brand_logo: String,
  v_template: String,
  v_plan: {
    type: String,
    enum: ['free', 'basic', 'premium'],
    default: 'free'
  },
  v_pro_status: {
    type: Boolean,
    default: false
  },
  v_gst_no: { type: String, unique: true },
  v_mobile: { type: String },
  v_profile_image: { 
    type: String,  // Will store the image path
    default: '' 
  }
}, {
  timestamps: true  // Automatically adds `createdAt` and `updatedAt` fields to track when the document was created and updated.
});

// Middleware to hash the password before saving the vendor to the database.
vendorSchema.pre('save', async function(next) {
  // Check if the password was changed or updated
  if (!this.isModified('v_password')){
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
vendorSchema.methods.comparePassword = async function(candidatePassword) {
  // Use bcrypt to compare the candidate password with the stored hashed password
  return await bcrypt.compare(candidatePassword, this.v_password);
};

// Export the Vendor model so it can be used in other parts of the application
module.exports = mongoose.model('Vendor', vendorSchema);