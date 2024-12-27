const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  t_id: {
    type: String,
    unique: true,
    required: true
  },
  v_id: {
    type: String,
    required: true,
    ref: 'Vendor'
  },
  name: {
    type: String,
    required: true
  },
  content: {
    type: Object,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Template', templateSchema);