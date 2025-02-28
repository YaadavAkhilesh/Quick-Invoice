const Template = require('../models/Template');
const { generateUniqueId } = require('../utils/uniqueIdentifier');

const templateController = {
  // Creating a new template
  create: async (req, res) => {
    console.log(`[${new Date().toISOString()}] POST /api/templates - Create template request received`);
    try {
      const { name, content } = req.body;

      const template = new Template({
        t_id: generateUniqueId('T'), 
        v_id: req.vendor.v_id,
        name,
        content
      });

      await template.save();

      console.log(`[${new Date().toISOString()}] Template created successfully: ${template.t_id}`);
      res.status(201).json({
        message: 'Template created successfully',
        template // Return the created template
      });
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error creating template:`, error);
      res.status(500).json({
        message: 'Error creating template',
        error: error.message
      });
    }
  },

  // Getting all templates for the vendor
  getAll: async (req, res) => {
    console.log(`[${new Date().toISOString()}] GET /api/templates - Fetch all templates request received`);
    try {
      const templates = await Template.find({ v_id: req.vendor.v_id });
      console.log(`[${new Date().toISOString()}] Fetched ${templates.length} templates`);
      res.json(templates); // Return the list of templates
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error fetching templates:`, error);
      res.status(500).json({
        message: 'Error fetching templates',
        error: error.message
      });
    }
  },

  // Getting a specific template by ID
  getById: async (req, res) => {
    console.log(`[${new Date().toISOString()}] GET /api/templates/${req.params.id} - Fetch template by ID request received`);
    try {
      // Finding the template by ID and vendor ID
      const template = await Template.findOne({ t_id: req.params.id, v_id: req.vendor.v_id });
      if (!template) {
        console.error(`[${new Date().toISOString()}] Template not found: ${req.params.id}`);
        return res.status(404).json({ message: 'Template not found' });
      }
      console.log(`[${new Date().toISOString()}] Template fetched successfully: ${template.t_id}`);
      res.json(template); // Return the found template
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error fetching template:`, error);
      res.status(500).json({
        message: 'Error fetching template',
        error: error.message
      });
    }
  },

  // Updating an existing template
  update: async (req, res) => {
    console.log(`[${new Date().toISOString()}] PUT /api/templates/${req.params.id} - Update template request received`);
    try {
      // Finding and updating the template by ID and vendor ID
      const template = await Template.findOneAndUpdate(
        { t_id: req.params.id, v_id: req.vendor.v_id },
        { ...req.body, updated_at: new Date() }, // Update template data and set the update timestamp
        { new: true } // Return the updated template
      );

      if (!template) {
        console.error(`[${new Date().toISOString()}] Template not found: ${req.params.id}`);
        return res.status(404).json({ message: 'Template not found' });
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
        error: error.message
      });
    }
  },

  // Deleting a template
  delete: async (req, res) => {
    console.log(`[${new Date().toISOString()}] DELETE /api/templates/${req.params.id} - Delete template request received`);
    try {
      // Finding and deleting the template by ID and vendor ID
      const template = await Template.findOneAndDelete({ t_id: req.params.id, v_id: req.vendor.v_id });
      if (!template) {
        console.error(`[${new Date().toISOString()}] Template not found: ${req.params.id}`);
        return res.status(404).json({ message: 'Template not found' });
      }

      console.log(`[${new Date().toISOString()}] Template deleted successfully: ${template.t_id}`);
      res.json({ message: 'Template deleted successfully' });
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error deleting template:`, error);
      res.status(500).json({
        message: 'Error deleting template',
        error: error.message
      });
    }
  }
};

module.exports = templateController;