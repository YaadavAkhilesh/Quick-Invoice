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
  template_type: {
    type: String,
    enum: ['simple', 'taxInvoice', 'deliveryInvoice', 'professionalInvoice', 'elegantInvoice', 'custom'],
    required: true,
    default: 'custom'
  },
  content: {
    type: Object,
    required: true
  },
  // values: {
  //   type: Object,
  //   default: {}
  // },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  // timestamps: true
});

module.exports = mongoose.model('Template', templateSchema);