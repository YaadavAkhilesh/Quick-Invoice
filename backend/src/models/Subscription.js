const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  vendor_id: {
    type: String,
    required: true,
    ref: 'Vendor'
  },
  plan: {
    type: String,
    enum: ['premium'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  payment_id: {
    type: String
  },
  razorpay_order_id: {
    type: String
  },
  razorpay_payment_id: {
    type: String
  },
  razorpay_signature: {
    type: String
  },
  start_date: {
    type: Date
  },
  end_date: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Subscription', subscriptionSchema); 