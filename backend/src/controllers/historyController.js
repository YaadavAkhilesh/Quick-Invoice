const History = require('../models/History');
const Invoice = require('../models/Invoice');
const Customer = require('../models/Customer');
const { generateUniqueId } = require('../utils/uniqueIdentifier');

const historyController = {
  // Create history entry
  createEntry: async (req, res) => {
    try {
      const { invoice_id, action_type, action_details } = req.body;

      const invoice = await Invoice.findOne({ i_id: invoice_id });
      if (!invoice) {
        return res.status(404).json({ message: 'Invoice not found' });
      }

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
        message: 'History entry created successfully',
        history
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error creating history entry',
        error: error.message
      });
    }
  },

  // Get all history entries for a vendor
  getAll: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;

      const history = await History.find({ v_id: req.vendor.v_id })
        .sort({ action_date: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      const count = await History.countDocuments({ v_id: req.vendor.v_id });

      res.json({
        history,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching history',
        error: error.message
      });
    }
  },

  // Search history by various parameters
  search: async (req, res) => {
    try {
      const { name, mobile, email, invoice_id } = req.query;
      const query = { v_id: req.vendor.v_id };

      if (invoice_id) {
        query.i_id = invoice_id;
      }

      if (name || mobile || email) {
        const customerQuery = {};
        if (name) customerQuery.c_name = new RegExp(name, 'i');
        if (mobile) customerQuery.c_mobile = mobile;
        if (email) customerQuery.c_mail = email;

        const customers = await Customer.find({ ...customerQuery, vendor_id: req.vendor.v_id });
        const customerIds = customers.map(c => c.c_id);
        query.c_id = { $in: customerIds };
      }

      const history = await History.find(query).sort({ action_date: -1 });

      const enhancedHistory = await Promise.all(history.map(async (entry) => {
        const customer = await Customer.findOne({ c_id: entry.c_id });
        const invoice = await Invoice.findOne({ i_id: entry.i_id });
        return {
          ...entry.toObject(),
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
        message: 'Error searching history',
        error: error.message
      });
    }
  },

  // Get history for a specific invoice
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
        message: 'Error fetching invoice history',
        error: error.message
      });
    }
  },

  // Get history statistics
  getStats: async (req, res) => {
    try {
      const stats = await History.aggregate([
        {
          $match: { v_id: req.vendor.v_id }
        },
        {
          $group: {
            _id: '$action_type',
            count: { $sum: 1 },
            lastAction: { $max: '$action_date' }
          }
        }
      ]);

      res.json(stats);
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching history statistics',
        error: error.message
      });
    }
  }
};

module.exports = historyController;