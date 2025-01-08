const Invoice = require('../models/Invoice');
const Customer = require('../models/Customer');
const Vendor = require('../models/Vendor');
const Template = require('../models/Template');
const Payment = require('../models/Payment');
const History = require('../models/History');
const { generateUniqueId } = require('../utils/uniqueIdentifier'); // Utility to generate unique IDs.
const { generatePDF } = require('../utils/pdfGenerator'); // Utility to generate PDFs.
const { sendEmail } = require('../utils/emailSender'); // Utility to send emails.

const invoiceController = {
  // Create a new invoice
  create: async (req, res) => {
    console.log(`[${new Date().toISOString()}] POST /api/invoices - Create invoice request received`);
    try {
      const { template_id, customer_id, products, tax, discount, warranty, payment_method } = req.body;

      // Fetch vendor, customer, and template details
      const vendor = await Vendor.findOne({ v_id: req.vendor.v_id });
      const customer = await Customer.findOne({ c_id: customer_id, vendor_id: req.vendor.v_id });
      const template = await Template.findOne({ t_id: template_id, v_id: req.vendor.v_id });

      // Check if customer exists
      if (!customer) {
        console.error(`[${new Date().toISOString()}] Customer not found: ${customer_id}`);
        return res.status(404).json({ message: 'Sorry, we could not find that customer.' });
      }

      // Check if template exists
      if (!template) {
        console.error(`[${new Date().toISOString()}] Template not found: ${template_id}`);
        return res.status(404).json({ message: 'Sorry, we could not find that template.' });
      }

      // Calculate totals
      const total = products.reduce((sum, item) => sum + (item.qty * item.price), 0);
      const totalAfterTax = total + (total * (tax / 100));
      const finalAmount = totalAfterTax - discount;

      // Create a new invoice
      const invoice = new Invoice({
        i_id: generateUniqueId('I'), // Generate a unique invoice ID.
        t_id: template_id, // Link to the template.
        v_id: vendor.v_id, // Associate with the vendor.
        v_logo: vendor.v_brand_logo, // Vendor's logo.
        v_name: vendor.v_name, // Vendor's name.
        v_mail: vendor.v_mail, // Vendor's email.
        v_telephone: vendor.v_telephone, // Vendor's phone number.
        v_address: vendor.v_address, // Vendor's address.
        v_business_code: vendor.v_business_code, // Vendor's business code.
        i_date: new Date(), // Invoice date.
        c_id: customer.c_id, // Link to the customer.
        c_name: customer.c_name, // Customer's name.
        c_mail: customer.c_mail, // Customer's email.
        i_product_det_obj: products, // List of products.
        i_total_amnt: total, // Total amount before tax.
        i_tax: tax, // Tax percentage.
        i_amnt_aft_tax: finalAmount, // Final amount after tax and discount.
        i_discount: discount, // Discount amount.
        i_warranty_guaranty: warranty // Warranty details.
      });

      // Save the invoice to the database
      await invoice.save();

      // Create a payment record
      const payment = new Payment({
        p_id: generateUniqueId('P'), // Generate a unique payment ID.
        i_id: invoice.i_id, // Link to the invoice.
        v_id: vendor.v_id, // Associate with the vendor.
        amount: finalAmount, // Payment amount.
        method: payment_method, // Payment method (e.g., credit card, cash).
        status: 'pending' // Payment status.
      });

      await payment.save();

      // Create a history entry for the invoice creation
      await History.create({
        h_id: generateUniqueId('H'), // Generate a unique history ID.
        i_id: invoice.i_id, // Link to the invoice.
        v_id: vendor.v_id, // Associate with the vendor.
        c_id: customer.c_id, // Link to the customer.
        action_type: 'created', // Action type (invoice created).
        action_details: { invoice_total: finalAmount } // Details of the action.
      });

      console.log(`[${new Date().toISOString()}] Invoice created successfully: ${invoice.i_id}`);
      res.status(201).json({
        message: 'Invoice created successfully! Here are the details:',
        invoice: {
          ...invoice.toObject(),    // Send back the invoice details
          c_name: customer.c_name,  // Include customer name
          c_mail: customer.c_mail   // Include customer email
        }
      });
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error creating invoice:`, error);
      res.status(500).json({
        message: 'Oops! There was an error creating the invoice.',
        error: error.message
      });
    }
  },

  // Get all invoices for the vendor
  getAll: async (req, res) => {
    console.log(`[${new Date().toISOString()}] GET /api/invoices - Fetch all invoices request received`);
    try {
      const invoices = await Invoice.find({ v_id: req.vendor.v_id }).sort({ i_crt_date: -1 });    // Fetch invoices for the vendor
      console.log(`[${new Date().toISOString()}] Fetched ${invoices.length} invoices`);
      res.json(invoices);   // Send the list of invoices.
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error fetching invoices:`, error);
      res.status(500).json({
        message: 'Oops! There was an error fetching the invoices.',
        error: error.message
      });
    }
  },

  // Get a specific invoice by ID
  getById: async (req, res) => {
    console.log(`[${new Date().toISOString()}] GET /api/invoices/${req.params.id} - Fetch invoice by ID request received`);
    try {
      const invoice = await Invoice.findOne({ i_id: req.params.id, v_id: req.vendor.v_id });    // Find the invoice by ID and vendor ID.
      if (!invoice) {
        console.error(`[${new Date().toISOString()}] Invoice not found: ${req.params.id}`);
        return res.status(404).json({ message: 'Sorry, we could not find that invoice.' });
      }
      console.log(`[${new Date().toISOString()}] Invoice fetched successfully: ${invoice.i_id}`);
      res.json(invoice);    // Send the invoice details.
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error fetching invoice:`, error);
      res.status(500).json({
        message: 'Oops! There was an error fetching the invoice.',
        error: error.message
      });
    }
  },

  // Update an existing invoice
  update: async (req, res) => {
    console.log(`[${new Date().toISOString()}] PUT /api/invoices/${req.params.id} - Update invoice request received`);
    try {
      const invoice = await Invoice.findOneAndUpdate(
        { i_id: req.params.id, v_id: req.vendor.v_id },  // Find the invoice by ID and vendor ID.
        { ...req.body, i_updt_date: new Date() }, // Update the invoice with new data.
        { new: true } // Return the updated invoice.
      );
      if (!invoice) {
        console.error(`[${new Date().toISOString()}] Invoice not found: ${req.params.id}`);
        return res.status(404).json({ message: 'Sorry, we could not find that invoice to update.' });
      }
      console.log(`[${new Date().toISOString()}] Invoice updated successfully: ${invoice.i_id}`);
      res.json({
        message: 'Invoice updated successfully! Here are the updated details:',
        invoice     // Send the updated invoice details.
      });
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error updating invoice:`, error);
      res.status(500).json({
        message: 'Oops! There was an error updating the invoice.',
        error: error.message
      });
    }
  },

  // Delete an invoice
  delete: async (req, res) => {
    console.log(`[${new Date().toISOString()}] DELETE /api/invoices/${req.params.id} - Delete invoice request received`);
    try {
      const invoice = await Invoice.findOneAndDelete({ i_id: req.params.id, v_id: req.vendor.v_id });   // Find and delete the invoice.
      if (!invoice) {
        console.error(`[${new Date().toISOString()}] Invoice not found: ${req.params.id}`);
        return res.status(404).json({ message: 'Sorry, we could not find that invoice to delete.' });
      }
      console.log(`[${new Date().toISOString()}] Invoice deleted successfully: ${invoice.i_id}`);
      res.json({ message: 'Invoice deleted successfully!' });
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error deleting invoice:`, error);
      res.status(500).json({
        message: 'Oops! There was an error deleting the invoice.',
        error: error.message
      });
    }
  },

  // Send an invoice via email
  sendInvoice: async (req, res) => {
    console.log(`[${new Date().toISOString()}] POST /api/invoices/${req.params.id}/send - Send invoice request received`);
    try {
      const { email, c_mobile, c_address } = req.body; // Extract customer details from the request.
      const invoice = await Invoice.findOne({
        i_id: req.params.id,
        v_id: req.vendor.v_id   // Ensure the invoice belongs to the vendor.
      });

      if (!invoice) {
        console.error(`[${new Date().toISOString()}] Invoice not found: ${req.params.id}`);
        return res.status(404).json({
          message: 'Sorry, we could not find that invoice to send.'
        });
      }

      // Update the invoice with customer's mobile and address (if provided)
      invoice.c_mobile = c_mobile || invoice.c_mobile;
      invoice.c_address = c_address || invoice.c_address;

      // Generate the PDF for the invoice
      const pdfBuffer = await generatePDF(invoice);

      // Send the invoice as an email attachment
      await sendEmail({
        to: email, // Customer's email.
        subject: `Invoice ${invoice.i_id} from ${invoice.v_name}`, // Email subject.
        text: 'Please find the attached invoice.', // Email body.
        attachments: [{
          filename: `invoice-${invoice.i_id}.pdf`, // PDF file name.
          content: pdfBuffer // PDF content.
        }]
      });

      // Create a history entry for the sent invoice
      await History.create({
        h_id: generateUniqueId('H'), // Generate a unique history ID.
        i_id: invoice.i_id, // Link to the invoice.
        v_id: invoice.v_id, // Associate with the vendor.
        c_id: invoice.c_id, // Link to the customer.
        action_type: 'sent', // Action type (invoice sent).
        action_details: { sent_to: email } // Details of the action.
      });

      console.log(`[${new Date().toISOString()}] Invoice sent successfully: ${invoice.i_id}`);
      res.json({
        message: 'Invoice sent successfully! Check your email for the details.'
      });
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error sending invoice:`, error);
      res.status(500).json({
        message: 'Oops! There was an error sending the invoice.',
        error: error.message
      });
    }
  }
};

module.exports = invoiceController;