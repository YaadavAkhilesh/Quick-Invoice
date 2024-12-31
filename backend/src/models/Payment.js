const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  p_id: {
    type: String,
    unique: true,
    required: true
  },
  i_id: {
    type: String,
    required: true,
    ref: 'Invoice'
  },
  v_id: {
    type: String,
    required: true,
    ref: 'Vendor'
  },
  amount: {
    type: Number,
    required: true
  },
  method: {
    type: String,
    required: true,
    enum: ['bank_transfer', 'upi','debit_card', 'credit_card']
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  transaction_id: String,
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Payment', paymentSchema);