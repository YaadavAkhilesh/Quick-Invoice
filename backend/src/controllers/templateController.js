const Template = require('../models/Template');
const Vendor = require('../models/Vendor');
const { generateUniqueId } = require('../utils/uniqueIdentifier');

const templateController = {
  // Creating a new template
  create: async (req, res) => {
    console.log(`[${new Date().toISOString()}] POST /api/templates - Create template request received`);
    try {
      const { name, content, template_type } = req.body;

      // Check if user is authenticated and has a vendor ID
      if (!req.user) {
        throw new Error('User not authenticated');
      }

      const vendorId = req.user.v_id || req.user.id;
      if (!vendorId) {
        throw new Error('Vendor ID not found');
      }

      // Get vendor and check template limits
      const vendor = await Vendor.findOne({ v_id: vendorId });
      if (!vendor) {
        throw new Error('Vendor not found');
      }

      // Define template categories
      const templateCategories = {
        basic: ['simple', 'taxInvoice', 'deliveryInvoice'],
        premium: ['professionalInvoice', 'elegantInvoice', 'custom']
      };

      // Check if free plan user is trying to create a premium template
      if (vendor.v_plan === 'free' && templateCategories.premium.includes(template_type)) {
        return res.status(403).json({
          message: 'Premium templates are only available for premium plan users. Please upgrade your plan.',
          upgrade_required: true
        });
      }

      // Check template limits for free plan
      if (vendor.v_plan === 'free') {
        if (vendor.v_templates_created >= 10) {
          return res.status(403).json({
            message: 'Free plan limit reached. Please upgrade to premium for unlimited templates.',
            upgrade_required: true
          });
        }
      }

      const template = new Template({
        t_id: generateUniqueId('T'),
        v_id: vendorId,
        name,
        content,
        template_type
      });

      await template.save();

      // Update vendor template counts

      const updatedVendor = await Vendor.findOneAndUpdate(
        { v_id: vendorId },
        {
          $inc: {
            v_template_count: 1,
            v_templates_created: 1
          }
        },

        { new: true }
      );

      console.log(`[${new Date().toISOString()}] Template created successfully: ${template.t_id}`);
      res.status(201).json({
        message: 'Template created successfully',
        template,
        template_count: updatedVendor.v_template_count,
        templates_created: updatedVendor.v_templates_created
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
      // Check if user is authenticated and has a vendor ID
      if (!req.user) {
        throw new Error('User not authenticated');
      }

      const vendorId = req.user.v_id || req.user.id;
      if (!vendorId) {
        throw new Error('Vendor ID not found');
      }

      const templates = await Template.find({ v_id: vendorId });
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

  // Getting a specific template by ID
  getById: async (req, res) => {
    console.log(`[${new Date().toISOString()}] GET /api/templates/${req.params.id} - Fetch template by ID request received`);
    try {
      if (!req.user || !req.user.v_id) {
        throw new Error('User not authenticated or vendor ID not found');
      }

      const template = await Template.findOne({ t_id: req.params.id, v_id: req.user.v_id });
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

  // Updating an existing template
  update: async (req, res) => {
    console.log(`[${new Date().toISOString()}] PUT /api/templates/${req.params.id} - Update template request received`);
    try {
      if (!req.user || !req.user.v_id) {
        throw new Error('User not authenticated or vendor ID not found');
      }

      const template = await Template.findOneAndUpdate(
        { t_id: req.params.id, v_id: req.user.v_id },
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

  // Deleting a template
  delete: async (req, res) => {
    console.log(`[${new Date().toISOString()}] DELETE /api/templates/${req.params.id} - Delete template request received`);
    try {
      if (!req.user || !req.user.v_id) {
        throw new Error('User not authenticated or vendor ID not found');
      }

      const template = await Template.findOneAndDelete({ t_id: req.params.id, v_id: req.user.v_id });
      if (!template) {
        console.error(`[${new Date().toISOString()}] Template not found: ${req.params.id}`);
        return res.status(404).json({ message: 'Template not found' });
      }

      // Update vendor template count
      await Vendor.findOneAndUpdate(
        { v_id: req.user.v_id },
        { $inc: { v_template_count: -1 } }
      );

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