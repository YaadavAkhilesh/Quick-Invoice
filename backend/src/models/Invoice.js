const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  i_id: {
    type: String,
    unique: true,
    required: true
  },
  t_id: {
    type: String,
    required: true
  },
  v_id: {
    type: String,
    required: true,
    ref: 'Vendor'
  },
  v_logo: String,
  v_name: {
    type: String,
    required: true
  },
  v_mail: {
    type:String,
    required: true
  },
  v_telephone: {
    type: String,
    required: true
  },
  v_address: String,
  v_business_code: String,
  i_date: {
    type: Date,
    required: true
  },
  c_id: {
    type: String,
    required: true,
    ref: 'Customer'
  },
  c_name: {
    type: String,
    required: true
  },
  c_mail: {
    type: String,
    required: true
  },
  i_product_det_obj: [{
    description: String,
    qty: Number,
    price: Number
  }],
  i_total_amnt: {
    type: Number,
    required: true
  },
  i_tax: Number,
  i_amnt_aft_tax: Number,
  i_discount: Number,
  i_warranty_guaranty: String,
  i_crt_date: {
    type: Date,
    default: Date.now
  },
  i_updt_date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Invoice', invoiceSchema);