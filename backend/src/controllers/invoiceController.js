const Invoice = require('../models/Invoice');
const Customer = require('../models/Customer');
const Vendor = require('../models/Vendor');
const Template = require('../models/Template');
const History = require('../models/History');
const { generateUniqueId } = require('../utils/uniqueIdentifier');
const { sendEmail } = require('../utils/emailSender');

const invoiceController = {

  create: async (req, res) => {
    console.log(`[${new Date().toISOString()}] POST /api/invoices - Create invoice request received`);
    try {
      const invoiceData = req.body;
      const vendorId = req.user.id;

      // Log the incoming invoice data for debugging
      console.log("Received Invoice Data:", invoiceData);

      // Ensure required fields are present
      if (!invoiceData.c_mail || !invoiceData.c_name) {
        return res.status(400).json({ message: 'Customer email and name are required.' });
      }

      invoiceData.c_tax_id = req.body.c_tax_id;
      invoiceData.pymntNumber = req.body.pymntNumber;
      invoiceData.pymntAcdetails = req.body.pymntAcdetails;
      invoiceData.pymntid = req.body.pymntid;
      // invoiceData.signature = req.body.signature;
      invoiceData.notes = req.body.notes;
      invoiceData.termscon = req.body.termscon;
      invoiceData.shipped_from = req.body.shipped_from; // Ensure this is included
      invoiceData.shipping_to = req.body.shipping_to; // Ensure this is included

      // First check if customer already exists
      let customerId;
      try {
        const existingCustomer = await Customer.findOne({
          c_mail: invoiceData.c_mail,
          vendor_id: vendorId
        });

        if (existingCustomer) {
          customerId = existingCustomer.c_id;
          await Customer.findOneAndUpdate(
            { c_id: customerId },
            {
              name: invoiceData.c_name,
              mobile: invoiceData.c_mobile || '0000000000',
              address: invoiceData.c_address || 'Not provided'
            }
          );
        } else {
          const customerData = {
            name: invoiceData.c_name,
            email: invoiceData.c_mail,
            mobile: invoiceData.c_mobile || '0000000000',
            address: invoiceData.c_address || 'Not provided',
            vendor_id: vendorId
          };
          const customerResponse = await Customer.create(customerData);
          customerId = customerResponse.c_id;
        }
      } catch (error) {
        console.error('Error handling customer:', error);
        return res.status(500).json({ message: 'Failed to process customer information', error: error.message });
      }

      // Generating a 7-digit unique invoice ID
      const generateUniqueInvoiceId = () => {
        return `I${Math.floor(1000000 + Math.random() * 9000000)}`;
      };

      let invoice = null;
      let retryCount = 0;
      const maxRetries = 5;

      while (!invoice && retryCount < maxRetries) {
        try {
          const i_id = generateUniqueInvoiceId();
          invoice = new Invoice({
            i_id,
            v_id: vendorId,
            ...invoiceData,
            c_id: customerId,
            i_crt_date: new Date(),
            i_updt_date: new Date(),
          });
          await invoice.save();

          // Increment vendor's invoice count

          await Vendor.findOneAndUpdate(
            { v_id: vendorId },
            { $inc: { v_invoice_count: 1 } },
            { new: true }
          );

          // Creating history entry for invoice creation
          await History.create({
            h_id: generateUniqueId('H'),
            i_id: invoice.i_id,
            v_id: vendorId,
            c_id: customerId,
            action_type: 'created',
            action_details: { created_by: vendorId }
          });

        } catch (err) {
          if (err.code === 11000 && err.keyPattern?.i_id) {
            retryCount++;
            continue;
          }
          console.error('Error saving invoice:', err);
          return res.status(500).json({ message: 'Failed to save invoice', error: err.message });
        }
      }

      if (!invoice) {
        return res.status(500).json({ message: 'Failed to generate unique invoice ID after maximum retries' });
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

  // Getting all invoices for the vendor
  getAll: async (req, res) => {
    console.log(`[${new Date().toISOString()}] GET /api/invoices - Fetch all invoices request received`);
    try {
      const invoices = await Invoice.find({ v_id: req.user.id }).sort({ i_crt_date: -1 });    // Fetching invoices for the vendor
      console.log(`[${new Date().toISOString()}] Fetched ${invoices.length} invoices`);
      res.json(invoices);   // Sending the list of invoices.
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error fetching invoices:`, error);
      res.status(500).json({
        message: 'Oops! There was an error fetching the invoices.',
        error: error.message
      });
    }
  },

  // Getting a specific invoice by ID
  getById: async (req, res) => {
    console.log(`[${new Date().toISOString()}] GET /api/invoices/${req.params.id} - Fetch invoice by ID request received`);
    try {
      const invoice = await Invoice.findOne({ i_id: req.params.id, v_id: req.user.id });    // Finding the invoice by ID and vendor ID.
      if (!invoice) {
        console.error(`[${new Date().toISOString()}] Invoice not found: ${req.params.id}`);
        return res.status(404).json({ message: 'Sorry, we could not find that invoice.' });
      }
      console.log(`[${new Date().toISOString()}] Invoice fetched successfully: ${invoice.i_id}`);
      res.json(invoice);    // Sending the invoice details.
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error fetching invoice:`, error);
      res.status(500).json({
        message: 'Oops! There was an error fetching the invoice.',
        error: error.message
      });
    }
  },

  // Updating an existing invoice
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

  // Deleting an invoice

  delete: async (req, res) => {
    console.log(`[${new Date().toISOString()}] DELETE /api/invoices/${req.params.id} - Delete invoice request received`);
    try {

      // Find the invoice first to ensure it exists
      const invoice = await Invoice.findOne({ i_id: req.params.id, v_id: req.user.id });
      
      if (!invoice) {
        console.error(`[${new Date().toISOString()}] Invoice not found: ${req.params.id}`);
        return res.status(404).json({ message: 'Sorry, we could not find that invoice to delete.' });
      }

      try {

        // Delete invoice and update vendor count atomically
        const [deletedInvoice, updatedVendor] = await Promise.all([
          Invoice.findOneAndDelete({ i_id: req.params.id, v_id: req.user.id }),
          Vendor.findOneAndUpdate(
            { v_id: invoice.v_id },
            { $inc: { v_invoice_count: -1 } },
            { new: true }
          )

        ]);

        if (!deletedInvoice) {
          throw new Error('Invoice was not deleted');
        }
        
        console.log(`[${new Date().toISOString()}] Updated vendor invoice count for ${updatedVendor.v_brand_name} to ${updatedVendor.v_invoice_count}`);

      } catch (error) {
        console.error(`[${new Date().toISOString()}] Error deleting invoice and updating count:`, error);
        throw error;
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
      const { email } = req.body;
      const pdfFile = req.files?.pdf;

      console.log('Received request:', { email, files: req.files });

      if (!pdfFile) {
        return res.status(400).json({
          message: 'PDF file is required'
        });
      }

      const invoice = await Invoice.findOne({
        i_id: req.params.id,
        v_id: req.user.id
      });

      if (!invoice) {
        console.error(`[${new Date().toISOString()}] Invoice not found: ${req.params.id}`);
        return res.status(404).json({
          message: 'Sorry, we could not find that invoice to send.'
        });
      }

      // Send the invoice as an email attachment
      await sendEmail({
        to: email,
        subject: `Invoice ${invoice.i_id} from ${invoice.v_name}`,
        text: 'Please find the attached invoice.',
        attachments: [{
          filename: `invoice-${invoice.i_id}.pdf`,
          content: pdfFile.data
        }]
      });

      // Create history entry for the sent invoice
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
        message: 'Invoice sent successfully!'
      });
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error sending invoice:`, error);
      res.status(500).json({
        message: 'Oops! There was an error sending the invoice.',
        error: error.message
      });
    }
  }

  // Other methods (getAll, getById, update, delete, sendInvoice) remain unchanged...
};

module.exports = invoiceController;