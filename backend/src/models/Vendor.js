const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const vendorSchema = new mongoose.Schema({
  v_id: { 
    type: String, 
    unique: true, 
    required: true 
  },
  v_brand_logo: String,
  v_name: { 
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
    unique: true 
  },
  v_mail: { 
    type: String, 
    unique: true, 
    required: true 
  },
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
  v_username: { 
    type: String, 
    unique: true, 
    required: true 
  },
  v_password: { 
    type: String, 
    required: true 
  }
}, {
  timestamps: true
});

// Hash password before saving
vendorSchema.pre('save', async function(next) {
  if (!this.isModified('v_password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.v_password = await bcrypt.hash(this.v_password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
vendorSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.v_password);
};

module.exports = mongoose.model('Vendor', vendorSchema);