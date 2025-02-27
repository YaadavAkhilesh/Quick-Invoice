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
      const invoiceData = req.body;
      const vendorId = req.user.id; // Get vendor ID from authenticated user
      
      // Generate a 7-digit unique invoice ID
      const generateUniqueInvoiceId = () => {
        // Generate a random 7-digit number between 1000000 and 9999999
        return `I${Math.floor(1000000 + Math.random() * 9000000)}`;
      };

      // Try to create invoice with unique ID, retry if duplicate
      let invoice = null;
      let retryCount = 0;
      const maxRetries = 5;

      while (!invoice && retryCount < maxRetries) {
        try {
          const i_id = generateUniqueInvoiceId();
          invoice = new Invoice({
            i_id,
            v_id: vendorId, // Use the vendor ID from authenticated user
            ...invoiceData,
            i_crt_date: new Date(),
            i_updt_date: new Date()
          });
          await invoice.save();

          // Create history entry for invoice creation
          await History.create({
            h_id: generateUniqueId('H'),
            i_id: invoice.i_id,
            v_id: vendorId,
            c_id: invoice.c_id,
            action_type: 'created',
            action_details: { created_by: vendorId }
          });

        } catch (err) {
          if (err.code === 11000 && err.keyPattern?.i_id) {
            // Duplicate invoice ID, retry
            retryCount++;
            continue;
          }
          throw err;
        }
      }

      if (!invoice) {
        throw new Error('Failed to generate unique invoice ID after maximum retries');
      }

      console.log(`[${new Date().toISOString()}] Invoice created successfully: ${invoice.i_id}`);
      res.status(201).json({
        message: 'Invoice created successfully!',
        invoice
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
      const invoices = await Invoice.find({ v_id: req.user.id }).sort({ i_crt_date: -1 });    // Fetch invoices for the vendor
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
      const invoice = await Invoice.findOne({ i_id: req.params.id, v_id: req.user.id });    // Find the invoice by ID and vendor ID.
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
        { i_id: req.params.id, v_id: req.user.id },  // Find the invoice by ID and vendor ID.
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
      const invoice = await Invoice.findOneAndDelete({ i_id: req.params.id, v_id: req.user.id });   // Find and delete the invoice.
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