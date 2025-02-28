const Payment = require('../models/Payment');
const Invoice = require('../models/Invoice');
const { generateUniqueId } = require('../utils/uniqueIdentifier');

const paymentController = {

  // Create a new payment
  create: async (req, res) => {
    console.log(`[${new Date().toISOString()}] POST /api/payments - Create payment request received`);

    try {
      // Extracting payment details from the request body
      const { invoice_id, amount, method } = req.body;

      // Finding the matching invoice for the vendor
      const invoice = await Invoice.findOne({ i_id: invoice_id, v_id: req.vendor.v_id });
      if (!invoice) {
        console.error(`[${new Date().toISOString()}] Invoice not found: ${invoice_id}`);
        return res.status(404).json({ message: 'Invoice not found' });
      }

      // Creating a new payment object
      const payment = new Payment({
        p_id: generateUniqueId('P'), 
        i_id: invoice_id,           
        v_id: req.vendor.v_id,      
        amount,                     
        method,                     
        status: 'completed', 
        transaction_id: generateUniqueId('TR')
      });

      // Saving the payment to the database
      await payment.save();

      console.log(`[${new Date().toISOString()}] Payment created successfully: ${payment.p_id}`);
      res.status(201).json({
        message: 'Payment created successfully',
        payment
      });
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error creating payment:`, error);
      res.status(500).json({
        message: 'Error creating payment',
        error: error.message
      });
    }
  },

  // Fetching all payments for the current vendor
  getAll: async (req, res) => {
    console.log(`[${new Date().toISOString()}] GET /api/payments - Fetch all payments request received`);

    try {
      // Finding all payments associated with the vendor
      const payments = await Payment.find({ v_id: req.vendor.v_id });

      console.log(`[${new Date().toISOString()}] Fetched ${payments.length} payments`);
      res.json(payments); // Return the payments
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error fetching payments:`, error);
      res.status(500).json({
        message: 'Error fetching payments',
        error: error.message
      });
    }
  },

  // Fetching a specific payment by its ID
  getById: async (req, res) => {
    console.log(`[${new Date().toISOString()}] GET /api/payments/${req.params.id} - Fetch payment by ID request received`);

    try {
      // Finding the payment by its ID and vendor ID
      const payment = await Payment.findOne({ p_id: req.params.id, v_id: req.vendor.v_id });

      if (!payment) {
        console.error(`[${new Date().toISOString()}] Payment not found: ${req.params.id}`);
        return res.status(404).json({ message: 'Payment not found' });
      }

      console.log(`[${new Date().toISOString()}] Payment fetched successfully: ${payment.p_id}`);
      res.json(payment); // Return the payment details
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error fetching payment:`, error);
      res.status(500).json({
        message: 'Error fetching payment',
        error: error.message
      });
    }
  },

  // Update a specific payment
  update: async (req, res) => {
    console.log(`[${new Date().toISOString()}] PUT /api/payments/${req.params.id} - Update payment request received`);

    try {
      // Find the payment by its ID and vendor ID, then update it
      const payment = await Payment.findOneAndUpdate(
        { p_id: req.params.id, v_id: req.vendor.v_id }, // Match by payment ID and vendor ID
        { ...req.body, updated_at: new Date() },       // Apply updates and set updated_at
        { new: true }                                 // Return the updated document
      );

      if (!payment) {
        console.error(`[${new Date().toISOString()}] Payment not found: ${req.params.id}`);
        return res.status(404).json({ message: 'Payment not found' });
      }

      console.log(`[${new Date().toISOString()}] Payment updated successfully: ${payment.p_id}`);
      res.json({
        message: 'Payment updated successfully',
        payment
      });
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error updating payment:`, error);
      res.status(500).json({
        message: 'Error updating payment',
        error: error.message
      });
    }
  },

  // Deleting a specific payment
  delete: async (req, res) => {
    console.log(`[${new Date().toISOString()}] DELETE /api/payments/${req.params.id} - Delete payment request received`);

    try {
      // Find the payment by its ID and vendor ID, then delete it
      const payment = await Payment.findOneAndDelete({ p_id: req.params.id, v_id: req.vendor.v_id });

      if (!payment) {
        console.error(`[${new Date().toISOString()}] Payment not found: ${req.params.id}`);
        return res.status(404).json({ message: 'Payment not found' });
      }

      console.log(`[${new Date().toISOString()}] Payment deleted successfully: ${payment.p_id}`);
      res.json({ message: 'Payment deleted successfully' });
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error deleting payment:`, error);
      res.status(500).json({
        message: 'Error deleting payment',
        error: error.message
      });
    }
  }
};

module.exports = paymentController;