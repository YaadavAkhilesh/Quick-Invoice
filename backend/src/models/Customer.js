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
  vendor_id: {
    type: String,
    required: true,
    ref: 'Vendor'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Customer', customerSchema);