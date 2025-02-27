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
  v_name: String,
  v_mail: String,
  v_telephone: String,
  v_address: String,
  v_business_code: String,
  i_date: Date,
  c_id: {
    type: String,
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
    measurements: String,
    qty: Number,
    price: Number,
    tax: Number,
    discount: Number
  }],
  i_total_amnt: Number,
  i_tax: Number,
  i_amnt_aft_tax: Number,
  i_discount: Number,
  i_shipping_charge: Number,
  i_cutoff: Number,
  i_notes: String,
  i_terms: String,
  i_payment_method: String,
  i_payment_details: {
    number: String,
    account: String,
    id: String
  },
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