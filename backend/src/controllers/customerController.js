const Customer = require('../models/Customer');
const { generateUniqueId } = require('../utils/uniqueIdentifier');

const customerController = {
  create: async (req, res) => {
    try {
      const {
        name,
        mobile,
        email,
        address,
        payment_info
      } = req.body;

      // Check if all required fields are provided
      if (!name || !mobile || !email || !address) {
        return res.status(400).json({
          message: 'Name, mobile, email, and address are required fields'
        });
      }

      const customer = new Customer({
        c_id: generateUniqueId('C'),
        c_name: name,
        c_mobile: mobile,
        c_mail: email,
        c_address: address,
        c_payment_info: payment_info,
        vendor_id: req.vendor.v_id
      });

      await customer.save();

      res.status(201).json({
        message: 'Customer created successfully',
        customer
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error creating customer',
        error: error.message
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const customers = await Customer.find({
        vendor_id: req.vendor.v_id
      });

      res.json(customers);
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching customers',
        error: error.message
      });
    }
  },

  getById: async (req, res) => {
    try {
      const customer = await Customer.findOne({
        c_id: req.params.id,
        vendor_id: req.vendor.v_id
      });

      if (!customer) {
        return res.status(404).json({
          message: 'Customer not found'
        });
      }

      res.json(customer);
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching customer',
        error: error.message
      });
    }
  },

  update: async (req, res) => {
    try {
      const customer = await Customer.findOneAndUpdate(
        {
          c_id: req.params.id,
          vendor_id: req.vendor.v_id
        },
        req.body,
        { new: true }
      );

      if (!customer) {
        return res.status(404).json({
          message: 'Customer not found'
        });
      }

      res.json({
        message: 'Customer updated successfully',
        customer
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error updating customer',
        error: error.message
      });
    }
  },

  delete: async (req, res) => {
    try {
      const customer = await Customer.findOneAndDelete({
        c_id: req.params.id,
        vendor_id: req.vendor.v_id
      });

      if (!customer) {
        return res.status(404).json({
          message: 'Customer not found'
        });
      }

      res.json({
        message: 'Customer deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error deleting customer',
        error: error.message
      });
    }
  }
};

module.exports = customerController;