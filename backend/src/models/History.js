const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  h_id: {
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
  c_id: {
    type: String,
    required: true,
    ref: 'Customer'
  },
  action_type: {
    type: String,
    enum: ['created', 'updated', 'viewed', 'downloaded', 'sent'],
    required: true
  },
  action_details: {
    type: Object,
    default: {}
  },
  action_date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster searches
historySchema.index({ i_id: 1, v_id: 1, c_id: 1 });   // The `1` indicates that the index is sorted in ascending order for each field.

module.exports = mongoose.model('History', historySchema);