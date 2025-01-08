const Template = require('../models/Template');
const { generateUniqueId } = require('../utils/uniqueIdentifier');

const templateController = {
  // Create a new template
  create: async (req, res) => {
    console.log(`[${new Date().toISOString()}] POST /api/templates - Create template request received`);
    try {
      const { name, content } = req.body; // Get name and content from the request body

      // Create a new template with a unique ID and vendor ID
      const template = new Template({
        t_id: generateUniqueId('T'), // Generate a unique template ID
        v_id: req.vendor.v_id, // Associate the template with the vendor
        name, // Template name
        content // Template content
      });

      await template.save(); // Save the template to the database

      console.log(`[${new Date().toISOString()}] Template created successfully: ${template.t_id}`);
      res.status(201).json({
        message: 'Template created successfully',
        template // Return the created template
      });
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error creating template:`, error);
      res.status(500).json({
        message: 'Error creating template',
        error: error.message // Return the error message
      });
    }
  },

  // Get all templates for the vendor
  getAll: async (req, res) => {
    console.log(`[${new Date().toISOString()}] GET /api/templates - Fetch all templates request received`);
    try {
      // Fetch all templates associated with the vendor
      const templates = await Template.find({ v_id: req.vendor.v_id });
      console.log(`[${new Date().toISOString()}] Fetched ${templates.length} templates`);
      res.json(templates); // Return the list of templates
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error fetching templates:`, error);
      res.status(500).json({
        message: 'Error fetching templates',
        error: error.message // Return the error message
      });
    }
  },

  // Get a specific template by ID
  getById: async (req, res) => {
    console.log(`[${new Date().toISOString()}] GET /api/templates/${req.params.id} - Fetch template by ID request received`);
    try {
      // Find the template by ID and vendor ID
      const template = await Template.findOne({ t_id: req.params.id, v_id: req.vendor.v_id });
      if (!template) {
        console.error(`[${new Date().toISOString()}] Template not found: ${req.params.id}`);
        return res.status(404).json({ message: 'Template not found' }); // Return error if template not found
      }
      console.log(`[${new Date().toISOString()}] Template fetched successfully: ${template.t_id}`);
      res.json(template); // Return the found template
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error fetching template:`, error);
      res.status(500).json({
        message: 'Error fetching template',
        error: error.message // Return the error message
      });
    }
  },

  // Update an existing template
  update: async (req, res) => {
    console.log(`[${new Date().toISOString()}] PUT /api/templates/${req.params.id} - Update template request received`);
    try {
      // Find and update the template by ID and vendor ID
      const template = await Template.findOneAndUpdate(
        { t_id: req.params.id, v_id: req.vendor.v_id },
        { ...req.body, updated_at: new Date() }, // Update template data and set the update timestamp
        { new: true } // Return the updated template
      );

      if (!template) {
        console.error(`[${new Date().toISOString()}] Template not found: ${req.params.id}`);
        return res.status(404).json({ message: 'Template not found' }); // Return error if template not found
      }

      console.log(`[${new Date().toISOString()}] Template updated successfully: ${template.t_id}`);
      res.json({
        message: 'Template updated successfully',
        template // Return the updated template
      });
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error updating template:`, error);
      res.status(500).json({
        message: 'Error updating template',
        error: error.message // Return the error message
      });
    }
  },

  // Delete a template
  delete: async (req, res) => {
    console.log(`[${new Date().toISOString()}] DELETE /api/templates/${req.params.id} - Delete template request received`);
    try {
      // Find and delete the template by ID and vendor ID
      const template = await Template.findOneAndDelete({ t_id: req.params.id, v_id: req.vendor.v_id });
      if (!template) {
        console.error(`[${new Date().toISOString()}] Template not found: ${req.params.id}`);
        return res.status(404).json({ message: 'Template not found' }); // Return error if template not found
      }

      console.log(`[${new Date().toISOString()}] Template deleted successfully: ${template.t_id}`);
      res.json({ message: 'Template deleted successfully' }); // Confirm deletion
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error deleting template:`, error);
      res.status(500).json({
        message: 'Error deleting template',
        error: error.message // Return the error message
      });
    }
  }
};

module.exports = templateController;