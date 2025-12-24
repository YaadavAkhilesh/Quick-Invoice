const Customer = require('../models/Customer');
const { generateUniqueId } = require('../utils/uniqueIdentifier');

const customerController = {
  // Creating a new customer
  create: async (req, res) => {
    try {
      const { name, mobile, email, address, vendor_id } = req.body;

      // Checking only required fields: name and email
      if (!name || !email || !vendor_id) {
        return res.status(400).json({
          message: 'Please provide required fields: name, email, and vendor_id'
        });
      }

      // Creating a new customer with optional fields
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

  // Retrieving all customers for a vendor
  getAll: async (req, res) => {
    try {
      const customers = await Customer.find({
        vendor_id: req.vendor.v_id      // Only fetching customers for this vendor
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

  // Geting a specific customer by ID
  getById: async (req, res) => {
    try {
      // Find the customer by ID and ensuring that they belong to the logged-in vendor
      const customer = await Customer.findOne({
        c_id: req.params.id,      // Customer ID from the URL.
        vendor_id: req.vendor.v_id // Only fetch if they belong to this vendor.
      });

      // If the customer doesn't exist
      if (!customer) {
        return res.status(404).json({
          message: 'We could not find a customer with that ID. Please check and try again.'
        });
      }
      // Sending the customer details as a response
      res.json(customer);
    } catch (error) {
      res.status(500).json({
        message: 'There was an error fetching the customer details.',
        error: error.message
      });
    }
  },

  // Updating an existing customer
  update: async (req, res) => {
    try {
      // Finding and updating the customer by ID, ensuring that they belong to the logged-in vendor
      const customer = await Customer.findOneAndUpdate(
        {
          c_id: req.params.id, // Customer ID from the URL.
          vendor_id: req.vendor.v_id // Only updating if they belong to this vendor.
        },
        req.body,     // New data to update the customer with.
        { new: true } // Return the updated customer
      );

      // If the customer doesn't exist
      if (!customer) {
        return res.status(404).json({
          message: 'We could not find a customer with that ID to update.'
        });
      }
      // Sending a success response with the updated customer details
      res.json({
        message: 'Customer updated successfully! Here are the new details:',
        customer      // Sending back the updated customer details.
      });
    } catch (error) {
      res.status(500).json({
        message: 'Oops! There was an issue updating the customer.',
        error: error.message
      });
    }
  },

  // Deleting a customer
  delete: async (req, res) => {
    try {
      // Find and deleting the customer by ID, ensuring that they belong to the logged-in vendor
      const customer = await Customer.findOneAndDelete({
        c_id: req.params.id, // Customer ID from the URL.
        vendor_id: req.vendor.v_id // Only deleting if they belong to this vendor.
      });

      // If the customer doesn't exist
      if (!customer) {
        return res.status(404).json({
          message: 'We could not find a customer with that ID to delete.'
        });
      }
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