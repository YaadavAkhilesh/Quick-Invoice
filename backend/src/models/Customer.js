const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  c_id: {
    type: String,
    unique: true,
    required: true
  },
  c_name: {
    type: String,
    required: true
  },
  c_mobile: {
    type: String
  },
  c_mail: {
    type: String,
    required: true
  },
  c_address: {
    type: String
  },
  c_tax_id: String,
  vendor_id: {
    type: String,
    required: true,
    ref: 'Vendor'
  }
}, {
  timestamps: true
});

// Create a compound index on vendor_id and c_mail to ensure uniqueness per vendor
customerSchema.index({ vendor_id: 1, c_mail: 1 });

module.exports = mongoose.model('Customer', customerSchema);