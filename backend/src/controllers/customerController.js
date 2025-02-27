const Customer = require('../models/Customer');
const { generateUniqueId } = require('../utils/uniqueIdentifier');

// The customer controller handles all the logic for creating, reading, updating, and deleting customers.
const customerController = {
  // Create a new customer
  create: async (req, res) => {
    try {
      const { name, mobile, email, address, vendor_id } = req.body;

      // Check only required fields: name and email
      if (!name || !email || !vendor_id) {
        return res.status(400).json({
          message: 'Please provide required fields: name, email, and vendor_id'
        });
      }

      // Create a new customer instance with optional fields
      const customer = new Customer({
        c_id: generateUniqueId('C'),
        c_name: name,
        c_mobile: mobile || '',  // Optional field
        c_mail: email,
        c_address: address || '', // Optional field
        vendor_id: vendor_id
      });

      await customer.save();

      res.status(201).json({
        message: 'Customer created successfully!',
        customer
      });
    } catch (error) {
      console.error('Error creating customer:', error);
      res.status(500).json({
        message: 'Error creating customer',
        error: error.message
      });
    }
  },

  // Retrieve all customers for a vendor
  getAll: async (req, res) => {
    try {
      const customers = await Customer.find({
        vendor_id: req.vendor.v_id      // Only fetch customers for this vendor
      });
      // Send the list of customers as a response
      res.json(customers);
    } catch (error) {
      res.status(500).json({
        message: 'Sorry, we encountered an issue while fetching the customers.',
        error: error.message
      });
    }
  },

  // Get a specific customer by ID
  getById: async (req, res) => {
    try {
      // Find the customer by ID and ensure they belong to the logged-in vendor
      const customer = await Customer.findOne({
        c_id: req.params.id,      // Customer ID from the URL.
        vendor_id: req.vendor.v_id // Only fetch if they belong to this vendor.
      });

      // If the customer doesn't exist, send a 404 error
      if (!customer) {
        return res.status(404).json({
          message: 'We could not find a customer with that ID. Please check and try again.'
        });
      }
      // Send the customer details as a response
      res.json(customer);
    } catch (error) {
      res.status(500).json({
        message: 'There was an error fetching the customer details.',
        error: error.message
      });
    }
  },

  // Update an existing customer
  update: async (req, res) => {
    try {
      // Find and update the customer by ID, ensuring they belong to the logged-in vendor
      const customer = await Customer.findOneAndUpdate(
        {
          c_id: req.params.id, // Customer ID from the URL.
          vendor_id: req.vendor.v_id // Only update if they belong to this vendor.
        },
        req.body,     // New data to update the customer with.
        { new: true } // Return the updated customer
      );

      // If the customer doesn't exist, send a 404 error
      if (!customer) {
        return res.status(404).json({
          message: 'We could not find a customer with that ID to update.'
        });
      }
      // Send a success response with the updated customer details
      res.json({
        message: 'Customer updated successfully! Here are the new details:',
        customer      // Send back the updated customer details.
      });
    } catch (error) {
      res.status(500).json({
        message: 'Oops! There was an issue updating the customer.',
        error: error.message
      });
    }
  },

  // Delete a customer
  delete: async (req, res) => {
    try {
      // Find and delete the customer by ID, ensuring they belong to the logged-in vendor
      const customer = await Customer.findOneAndDelete({
        c_id: req.params.id, // Customer ID from the URL.
        vendor_id: req.vendor.v_id // Only delete if they belong to this vendor.
      });

      // If the customer doesn't exist, send a 404 error
      if (!customer) {
        return res.status(404).json({
          message: 'We could not find a customer with that ID to delete.'
        });
      }
      // Send a success response
      res.json({
        message: 'Customer deleted successfully!.'
      });
    } catch (error) {
      res.status(500).json({
        message: 'There was an error deleting the customer. Please try again.',
        error: error.message
      });
    }
  }
};

module.exports = customerController;