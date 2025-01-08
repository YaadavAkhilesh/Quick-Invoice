const History = require('../models/History');   // The History model to track actions.
const Invoice = require('../models/Invoice');   // The Invoice model to link history entries.
const Customer = require('../models/Customer'); // The Customer model to fetch customer details.
const { generateUniqueId } = require('../utils/uniqueIdentifier'); // A utility to generate unique IDs.

// The history controller handles all the logic for creating, fetching, and analyzing history entries.
const historyController = {
  // Create a new history entry
  createEntry: async (req, res) => {
    try {
      const { invoice_id, action_type, action_details } = req.body; // Extract data from the request.

      // Check if the invoice exists
      const invoice = await Invoice.findOne({ i_id: invoice_id });
      if (!invoice) {
        return res.status(404).json({ message: 'Sorry, we could not find that invoice.' });
      }

      // Create a new history entry
      const history = new History({
        h_id: generateUniqueId('H'), // Generate a unique history ID (starts with "H").
        i_id: invoice_id, // Link to the invoice.
        v_id: req.vendor.v_id, // Associate with the logged-in vendor.
        c_id: invoice.c_id, // Link to the customer from the invoice.
        action_type, // The type of action (e.g., "created", "updated").
        action_details // Additional details about the action.
      });

      // Save the history entry to the database
      await history.save();

      // Send a success response with the new history entry
      res.status(201).json({
        message: 'History entry created successfully! Your action has been recorded.',
        history     // Send back the history entry.
      });
    } catch (error) {
      // If something goes wrong, send a 500 error
      res.status(500).json({
        message: 'Oops! There was an error creating the history entry.', // Oops, something broke!
        error: error.message // Include the error message for debugging.
      });
    }
  },

  // Retrieve (GET) all history entries for a vendor (with pagination)
  getAll: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query; // Get pagination parameters from the query.

      // Fetch history entries with pagination
      const history = await History.find({ v_id: req.vendor.v_id }) // Only fetch entries for this vendor.
        .sort({ action_date: -1 }) // Sort by action date, most recent first.
        .limit(limit * 1) // Limit the number of results per page.
        .skip((page - 1) * limit) // Skip entries for previous pages.
        .exec();

      // Count the total number of history entries for the vendor
      const count = await History.countDocuments({ v_id: req.vendor.v_id });

      // Send the history entries along with pagination details
      res.json({
        history, // The fetched history entries.
        totalPages: Math.ceil(count / limit), // Total number of pages.
        currentPage: page // The current page number.
      });
    } catch (error) {
      res.status(500).json({
        message: 'Sorry, we encountered an issue while fetching the history.',
        error: error.message 
      });
    }
  },

  // Search history by various parameters (customer name, mobile, email, or invoice ID)
  search: async (req, res) => {
    try {
      const { name, mobile, email, invoice_id } = req.query; // Extract search parameters from the query.
      const query = { v_id: req.vendor.v_id }; // Start with vendor ID.

      // If an invoice ID is provided, add it to the query
      if (invoice_id) {
        query.i_id = invoice_id; // Only fetch history for this invoice.
      }

      // If customer details are provided, find matching customers
      if (name || mobile || email) {
        const customerQuery = {}; // Build a query for customers.
        if (name) customerQuery.c_name = new RegExp(name, 'i'); // Case-insensitive search for name.
        if (mobile) customerQuery.c_mobile = mobile; // Exact match for mobile.
        if (email) customerQuery.c_mail = email; // Exact match for email.

        // Find customers matching the query
        const customers = await Customer.find({ ...customerQuery, vendor_id: req.vendor.v_id });
        const customerIds = customers.map(c => c.c_id); // Extract customer IDs.
        query.c_id = { $in: customerIds }; // Filter history by customer IDs.
      }

      // Fetch the history based on the constructed query
      const history = await History.find(query).sort({ action_date: -1 }); // Sort by action date, most recent first.

      // Enhance history entries with customer and invoice details
      const enhancedHistory = await Promise.all(history.map(async (entry) => {
        const customer = await Customer.findOne({ c_id: entry.c_id }); // Fetch customer details.
        const invoice = await Invoice.findOne({ i_id: entry.i_id }); // Fetch invoice details.
        return {
          ...entry.toObject(), // Include the original history entry.
          customer: {
            name: customer.c_name,
            email: customer.c_mail,
            mobile: customer.c_mobile
          }, // Add customer details.
          invoice: {
            id: invoice.i_id,
            total: invoice.i_total_amnt,
            date: invoice.i_date
          } // Add invoice details.
        };
      }));

      // Send the enhanced history entries as a response
      res.json(enhancedHistory);
    } catch (error) {
      res.status(500).json({
        message: 'There was an error searching the history. Please try again.',
        error: error.message
      });
    }
  },

  // Get history for a specific invoice
  getInvoiceHistory: async (req, res) => {
    try {
      const { invoice_id } = req.params; // Extract invoice ID from the URL.

      // Fetch history entries for the specified invoice
      const history = await History.find({
        i_id: invoice_id,
        v_id: req.vendor.v_id // Ensure the history belongs to the vendor.
      }).sort({ action_date: -1 }); // Sort by action date, most recent first.

      // Send the fetched history entries as a response
      res.json(history);
    } catch (error) {
      res.status(500).json({
        message: 'Oops! We could not fetch the history for that invoice.',
        error: error.message
      });
    }
  },

  // Get statistics about history actions (e.g., how many times each action was performed)
  getStats: async (req, res) => {
    try {
      // Aggregate statistics based on action types
      const stats = await History.aggregate([
        {
          $match: { v_id: req.vendor.v_id } // Filter by vendor ID.
        },
        {
          $group: {
            _id: '$action_type', // Group by action type.
            count: { $sum: 1 }, // Count occurrences of each action type.
            lastAction: { $max: '$action_date' } // Get the most recent action date for each type.
          }
        }
      ]);

      // Send the aggregated statistics as a response
      res.json(stats);
    } catch (error) {
      res.status(500).json({
        message: 'Sorry, we could not retrieve the statistics at this time.',
        error: error.message 
      });
    }
  }
};

module.exports = historyController;