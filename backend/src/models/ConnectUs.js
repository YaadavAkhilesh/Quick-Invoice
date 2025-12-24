// models/ConnectUs.js
const mongoose = require('mongoose');

const connectUsSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true
  },
  problem: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  contactInfo: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  vendorId:{
    type: String,
    ref: 'Vendor'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ConnectUs', connectUsSchema);
