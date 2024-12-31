const Invoice = require('../models/Invoice');
const Customer = require('../models/Customer');
const Vendor = require('../models/Vendor');
const Template = require('../models/Template');
const Payment = require('../models/Payment');
const History = require('../models/History');
const { generateUniqueId } = require('../utils/uniqueIdentifier');
const { generatePDF } = require('../utils/pdfGenerator');
const { sendEmail } = require('../utils/emailSender');

const invoiceController = {
  create: async (req, res) => {
    console.log(`[${new Date().toISOString()}] POST /api/invoices - Create invoice request received`);
    try {
      const {
        template_id,
        customer_id,
        products,
        tax,
        discount,
        warranty,
        payment_method
      } = req.body;

      const vendor = await Vendor.findOne({ v_id: req.vendor.v_id });
      const customer = await Customer.findOne({ c_id: customer_id, vendor_id: req.vendor.v_id });
      const template = await Template.findOne({ t_id: template_id, v_id: req.vendor.v_id });

      if (!customer) {
        console.error(`[${new Date().toISOString()}] Customer not found: ${customer_id}`);
        return res.status(404).json({ message: 'Customer not found' });
      }

      if (!template) {
        console.error(`[${new Date().toISOString()}] Template not found: ${template_id}`);
        return res.status(404).json({ message: 'Template not found' });
      }

      // Calculate totals
      const total = products.reduce((sum, item) => sum + (item.qty * item.price), 0);
      const totalAfterTax = total + (total * (tax / 100));
      const finalAmount = totalAfterTax - discount;

      const invoice = new Invoice({
        i_id: generateUniqueId('I'),
        t_id: template_id,
        v_id: vendor.v_id,
        v_logo: vendor.v_brand_logo,
        v_name: vendor.v_name,
        v_mail: vendor.v_mail, // Added New Line
        v_telephone: vendor.v_telephone,
        v_address: vendor.v_address,
        v_business_code: vendor.v_business_code,
        i_date: new Date(),
        c_id: customer.c_id,
        c_name: customer.c_name,
        c_mail: customer.c_mail,
        i_product_det_obj: products,
        i_total_amnt: total,
        i_tax: tax,
        i_amnt_aft_tax: finalAmount,
        i_discount: discount,
        i_warranty_guaranty: warranty
      });

      await invoice.save();

      // Create payment record
      const payment = new Payment({
        p_id: generateUniqueId('P'),
        i_id: invoice.i_id,
        v_id: vendor.v_id,
        amount: finalAmount,
        method: payment_method,
        status: 'pending'
      });

      await payment.save();

      // Create history entry
      await History.create({
        h_id: generateUniqueId('H'),
        i_id: invoice.i_id,
        v_id: vendor.v_id,
        c_id: customer.c_id,
        action_type: 'created',
        action_details: { invoice_total: finalAmount }
      });

      console.log(`[${new Date().toISOString()}] Invoice created successfully: ${invoice.i_id}`);
      res.status(201).json({
        message: 'Invoice created successfully',
        invoice: {
          ...invoice.toObject(),
          c_name: customer.c_name,
          c_mail: customer.c_mail
        }
      });
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error creating invoice:`, error);
      res.status(500).json({
        message: 'Error creating invoice',
        error: error.message
      });
    }
  },

  getAll: async (req, res) => {
    console.log(`[${new Date().toISOString()}] GET /api/invoices - Fetch all invoices request received`);
    try {
      const invoices = await Invoice.find({ v_id: req.vendor.v_id }).sort({ i_crt_date: -1 });
      console.log(`[${new Date().toISOString()}] Fetched ${invoices.length} invoices`);
      res.json(invoices);
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error fetching invoices:`, error);
      res.status(500).json({
        message: 'Error fetching invoices',
        error: error.message
      });
    }
  },

  getById: async (req, res) => {
    console.log(`[${new Date().toISOString()}] GET /api/invoices/${req.params.id} - Fetch invoice by ID request received`);
    try {
      const invoice = await Invoice.findOne({ i_id: req.params.id, v_id: req.vendor.v_id });
      if (!invoice) {
        console.error(`[${new Date().toISOString()}] Invoice not found: ${req.params.id}`);
        return res.status(404).json({ message: 'Invoice not found' });
      }
      console.log(`[${new Date().toISOString()}] Invoice fetched successfully: ${invoice.i_id}`);
      res.json(invoice);
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error fetching invoice:`, error);
      res.status(500).json({
        message: 'Error fetching invoice',
        error: error.message
      });
    }
  },

  update: async (req, res) => {
    console.log(`[${new Date().toISOString()}] PUT /api/invoices/${req.params.id} - Update invoice request received`);
    try {
      const invoice = await Invoice.findOneAndUpdate(
        { i_id: req.params.id, v_id: req.vendor.v_id },
        { ...req.body, i_updt_date: new Date() },
        { new: true }
      );
      if (!invoice) {
        console.error(`[${new Date().toISOString()}] Invoice not found: ${req.params.id}`);
        return res.status(404).json({ message: 'Invoice not found' });
      }
      console.log(`[${new Date().toISOString()}] Invoice updated successfully: ${invoice.i_id}`);
      res.json({
        message: 'Invoice updated successfully',
        invoice
      });
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error updating invoice:`, error);
      res.status(500).json({
        message: 'Error updating invoice',
        error: error.message
      });
    }
  },

  delete: async (req, res) => {
    console.log(`[${new Date().toISOString()}] DELETE /api/invoices/${req.params.id} - Delete invoice request received`);
    try {
      const invoice = await Invoice.findOneAndDelete({ i_id: req.params.id, v_id: req.vendor.v_id });
      if (!invoice) {
        console.error(`[${new Date().toISOString()}] Invoice not found: ${req.params.id}`);
        return res.status(404).json({ message: 'Invoice not found' });
      }
      console.log(`[${new Date().toISOString()}] Invoice deleted successfully: ${invoice.i_id}`);
      res.json({ message: 'Invoice deleted successfully' });
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error deleting invoice:`, error);
      res.status(500).json({
        message: 'Error deleting invoice',
        error: error.message
      });
    }
  },

  sendInvoice: async (req, res) => {
    console.log(`[${new Date().toISOString()}] POST /api/invoices/${req.params.id}/send - Send invoice request received`);
    try {
      const { email, c_mobile, c_address } = req.body;  // Extracting the customer's email, mobile, and address
      const invoice = await Invoice.findOne({
        i_id: req.params.id,
        v_id: req.vendor.v_id
      });

      if (!invoice) {
        console.error(`[${new Date().toISOString()}] Invoice not found: ${req.params.id}`);
        return res.status(404).json({
          message: 'Invoice not found'
        });
      }

    // Update the invoice with customer's mobile and address (if not already included)
    invoice.c_mobile = c_mobile || invoice.c_mobile;
    invoice.c_address = c_address || invoice.c_address;

      const pdfBuffer = await generatePDF(invoice);
      await sendEmail({
        to: email,
        subject: `Invoice ${invoice.i_id} from ${invoice.v_name}`,
        text: 'Please find attached invoice.',
        attachments: [{
          filename: `invoice-${invoice.i_id}.pdf`,
          content: pdfBuffer
        }]
      });

      // Create history entry for sent invoice
      await History.create({
        h_id: generateUniqueId('H'),
        i_id: invoice.i_id,
        v_id: invoice.v_id,
        c_id: invoice.c_id,
        action_type: 'sent',
        action_details: { sent_to: email }
      });

      console.log(`[${new Date().toISOString()}] Invoice sent successfully: ${invoice.i_id}`);
      res.json({
        message: 'Invoice sent successfully'
      });
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error sending invoice:`, error);
      res.status(500).json({
        message: 'Error sending invoice',
        error: error.message
      });
    }
  }
};

module.exports = invoiceController;