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
    type: String,
    required: true
  },
  c_mail: {
    type: String,
    unique: true,
    required: true
  },
  c_payment_info: {
    type: String,
    required: false
  },
  c_address: {
    type: String,
    required: true
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