const mongoose = require('mongoose');

const productDetailSchema = new mongoose.Schema({
  description: { type: String, required: true },
  measurements: { type: String },
  qty: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 }
}, { _id: false }); // Disable automatic _id generation for subdocuments

const paymentDetailsSchema = new mongoose.Schema({
  number: { type: String },
  account: { type: String },
  id: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { _id: false }); // Disable automatic _id generation for subdocuments

const invoiceSchema = new mongoose.Schema({
  i_id: { type: String, unique: true, required: true },
  t_id: { type: String, required: true },
  v_id: { type: String, required: true, ref: 'Vendor' },
  // v_logo: { type: String },
  // v_brand_name: { type: String },
  // v_name: { type: String },
  // v_mail: { type: String },
  // v_telephone: { type: String },
  // v_address: { type: String },
  // v_business_code: { type: String },
  
  v_field_state: {
    type: Object,
    required: true
  },
  i_date: { type: Date, required: true },
  v_website: { type: String },
  c_id: { type: String, ref: 'Customer' },
  c_name: { type: String, required: true },
  c_mail: { type: String, required: true },
  c_mobile: { type: String },
  c_address: { type: String },
  c_tax_id: { type: String },
  shipped_from: { type: String },
  shipping_to: { type: String },
  i_product_det_obj: [productDetailSchema],
  i_total_amnt: { type: Number, required: true, min: 0 },
  i_tax: { type: Number, default: 0 },
  i_amnt_aft_tax: { type: Number, required: true, min: 0 },
  i_discount: { type: Number, default: 0 },
  i_shipping_charge: { type: Number, default: 0 },
  i_cutoff: { type: Number, default: 0 },
  i_notes: { type: String },
  i_terms: { type: String },
  i_payment_method: { type: String },
  i_payment_details: paymentDetailsSchema,
  // v_signature: { type: String },
  i_crt_date: { type: Date, default: Date.now },
  i_updt_date: { type: Date, default: Date.now }
}, {
  // timestamps: true // Automatically manage createdAt and updatedAt fields
});

// Export the Invoice model
module.exports = mongoose.model('Invoice', invoiceSchema);