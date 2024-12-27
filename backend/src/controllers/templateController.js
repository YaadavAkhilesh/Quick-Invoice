const Template = require('../models/Template');
const { generateUniqueId } = require('../utils/uniqueIdentifier');

const templateController = {
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
        template
      });
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error creating template:`, error);
      res.status(500).json({
        message: 'Error creating template',
        error: error.message
      });
    }
  },

  getAll: async (req, res) => {
    console.log(`[${new Date().toISOString()}] GET /api/templates - Fetch all templates request received`);
    try {
      const templates = await Template.find({ v_id: req.vendor.v_id });
      console.log(`[${new Date().toISOString()}] Fetched ${templates.length} templates`);
      res.json(templates);
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error fetching templates:`, error);
      res.status(500).json({
        message: 'Error fetching templates',
        error: error.message
      });
    }
  },

  getById: async (req, res) => {
    console.log(`[${new Date().toISOString()}] GET /api/templates/${req.params.id} - Fetch template by ID request received`);
    try {
      const template = await Template.findOne({ t_id: req.params.id, v_id: req.vendor.v_id });
      if (!template) {
        console.error(`[${new Date().toISOString()}] Template not found: ${req.params.id}`);
        return res.status(404).json({ message: 'Template not found' });
      }
      console.log(`[${new Date().toISOString()}] Template fetched successfully: ${template.t_id}`);
      res.json(template);
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error fetching template:`, error);
      res.status(500).json({
        message: 'Error fetching template',
        error: error.message
      });
    }
  },

  update: async (req, res) => {
    console.log(`[${new Date().toISOString()}] PUT /api/templates/${req.params.id} - Update template request received`);
    try {
      const template = await Template.findOneAndUpdate(
        { t_id: req.params.id, v_id: req.vendor.v_id },
        { ...req.body, updated_at: new Date() },
        { new: true }
      );
      if (!template) {
        console.error(`[${new Date().toISOString()}] Template not found: ${req.params.id}`);
        return res.status(404).json({ message: 'Template not found' });
      }
      console.log(`[${new Date().toISOString()}] Template updated successfully: ${template.t_id}`);
      res.json({
        message: 'Template updated successfully',
        template
      });
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error updating template:`, error);
      res.status(500).json({
        message: 'Error updating template',
        error: error.message
      });
    }
  },

  delete: async (req, res) => {
    console.log(`[${new Date().toISOString()}] DELETE /api/templates/${req.params.id} - Delete template request received`);
    try {
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