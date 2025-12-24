const History = require('../models/History');
const Invoice = require('../models/Invoice');
const Customer = require('../models/Customer');
const { generateUniqueId } = require('../utils/uniqueIdentifier'); // For generating unique IDs.

const historyController = {
  // Creating a new history entry
  createEntry: async (req, res) => {
    try {
      const { invoice_id, action_type, action_details } = req.body; // Extract data from the request.

      // Checking if the invoice exists
      const invoice = await Invoice.findOne({ i_id: invoice_id });
      if (!invoice) {
        return res.status(404).json({ message: 'Sorry, we could not find that invoice.' });
      }

      // Creating a new history entry
      const history = new History({
        h_id: generateUniqueId('H'),
        i_id: invoice_id,
        v_id: req.vendor.v_id,
        c_id: invoice.c_id,
        action_type,
        action_details
      });

      await history.save();

      res.status(201).json({
        message: 'History entry created successfully! Your action has been recorded.',
        history
      });
    } catch (error) {
      res.status(500).json({
        message: 'Oops! There was an error creating the history entry.',
        error: error.message
      });
    }
  },

  // Retrieving (GET) all history entries for a vendor
  getAll: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;

      // Fetch history entries with pagination
      const history = await History.find({ v_id: req.vendor.v_id }) // Only fetch entries for this vendor.
        .sort({ action_date: -1 })
        .limit(limit * 1) 
        .skip((page - 1) * limit)
        .exec();

      // Counting the total number of history entries for the vendor
      const count = await History.countDocuments({ v_id: req.vendor.v_id });

      res.json({
        history,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      });
    } catch (error) {
      res.status(500).json({
        message: 'Sorry, we encountered an issue while fetching the history.',
        error: error.message 
      });
    }
  },

  search: async (req, res) => {
    try {
      const { name, mobile, email, invoice_id } = req.query;
      const query = { v_id: req.vendor.v_id };

      if (invoice_id) {
        query.i_id = invoice_id;
      }

      // If customer details are provided, find matching customers
      if (name || mobile || email) {
        const customerQuery = {}; // Build a query for customers.
        if (name) customerQuery.c_name = new RegExp(name, 'i');
        if (mobile) customerQuery.c_mobile = mobile;
        if (email) customerQuery.c_mail = email;

        // Find customers matching the query
        const customers = await Customer.find({ ...customerQuery, vendor_id: req.vendor.v_id });
        const customerIds = customers.map(c => c.c_id); // Extract customer IDs.
        query.c_id = { $in: customerIds }; // Filter history by customer IDs.
      }

      // Fetching the history based on the constructed query
      const history = await History.find(query).sort({ action_date: -1 }); // Sort by action date, most recent first.

      const enhancedHistory = await Promise.all(history.map(async (entry) => {
        const customer = await Customer.findOne({ c_id: entry.c_id });
        const invoice = await Invoice.findOne({ i_id: entry.i_id }); 
        return {
          ...entry.toObject(), // Include the original history entry.
          customer: {
            name: customer.c_name,
            email: customer.c_mail,
            mobile: customer.c_mobile
          },
          invoice: {
            id: invoice.i_id,
            total: invoice.i_total_amnt,
            date: invoice.i_date
          }
        };
      }));

      res.json(enhancedHistory);
    } catch (error) {
      res.status(500).json({
        message: 'There was an error searching the history. Please try again.',
        error: error.message
      });
    }
  },

  getInvoiceHistory: async (req, res) => {
    try {
      const { invoice_id } = req.params;

      const history = await History.find({
        i_id: invoice_id,
        v_id: req.vendor.v_id 
      }).sort({ action_date: -1 });

      res.json(history);
    } catch (error) {
      res.status(500).json({
        message: 'Oops! We could not fetch the history for that invoice.',
        error: error.message
      });
    }
  },

  // Getting statistics about history actions (e.g., how many times each action was performed)
  getStats: async (req, res) => {
    try {
      // Aggregate statistics based on action types
      const stats = await History.aggregate([
        {
          $match: { v_id: req.vendor.v_id }
        },
        {
          $group: {
            _id: '$action_type', // Group by action type.
            count: { $sum: 1 }, // Count occurrences of each action type.
            lastAction: { $max: '$action_date' }
          }
        }
      ]);

      // Sending the aggregated statistics as a response
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