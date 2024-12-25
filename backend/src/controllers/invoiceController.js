const Invoice = require('../models/Invoice');
const History = require('../models/History');
const { generateUniqueId } = require('../utils/uniqueIdentifier');
const { generatePDF } = require('../utils/pdfGenerator');
const { sendEmail } = require('../utils/emailSender');

const invoiceController = {
  create: async (req, res) => {
    try {
      const {
        template_id,
        customer_id,
        products,
        tax,
        discount,
        warranty
      } = req.body;

      // Calculate totals
      const total = products.reduce((sum, item) => 
        sum + (item.qty * item.price), 0);
      const totalAfterTax = total + (total * (tax / 100));
      const finalAmount = totalAfterTax - discount;

      const invoice = new Invoice({
        i_id: generateUniqueId('I'),
        t_id: template_id,
        v_id: req.vendor.v_id,
        v_logo: req.vendor.v_brand_logo,
        v_name: req.vendor.v_name,
        v_telephone: req.vendor.v_telephone,
        v_address: req.vendor.v_address,
        v_business_code: req.vendor.v_business_code,
        i_date: new Date(),
        c_id: customer_id,
        i_product_det_obj: products,
        i_total_amnt: total,
        i_tax: tax,
        i_amnt_aft_tax: finalAmount,
        i_discount: discount,
        i_warranty_guaranty: warranty
      });

      await invoice.save();

      await new History({
        h_id: generateUniqueId('H'),
        i_id: invoice.i_id,
        v_id: req.vendor.v_id,
        c_id: invoice.c_id,
        action_type: 'created',
        action_details: {
          total_amount: invoice.i_total_amnt,
          products_count: invoice.i_product_det_obj.length
        }
      }).save();

      res.status(201).json({
        message: 'Invoice created successfully',
        invoice
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error creating invoice',
        error: error.message
      });
    }
  },

  getAll: async (req, res) => {
    try {
      const invoices = await Invoice.find({
        v_id: req.vendor.v_id
      }).sort({ i_crt_date: -1 });

      res.json(invoices);
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching invoices',
        error: error.message
      });
    }
  },

  getById: async (req, res) => {
    try {
      const invoice = await Invoice.findOne({
        i_id: req.params.id,
        v_id: req.vendor.v_id
      });

      if (!invoice) {
        return res.status(404).json({
          message: 'Invoice not found'
        });
      }

      res.json(invoice);
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching invoice',
        error: error.message
      });
    }
  },

  update: async (req, res) => {
    try {
      const invoice = await Invoice.findOneAndUpdate(
        {
          i_id: req.params.id,
          v_id: req.vendor.v_id
        },
        {
          ...req.body,
          i_updt_date: new Date()
        },
        { new: true }
      );

      if (!invoice) {
        return res.status(404).json({
          message: 'Invoice not found'
        });
      }

      await new History({
        h_id: generateUniqueId('H'),
        i_id: req.params.id,
        v_id: req.vendor.v_id,
        c_id: invoice.c_id,
        action_type: 'updated',
        action_details: {
          updated_fields: Object.keys(req.body)
        }
      }).save();

      res.json({
        message: 'Invoice updated successfully',
        invoice
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error updating invoice',
        error: error.message
      });
    }
  },

  delete: async (req, res) => {
    try {
      const invoice = await Invoice.findOneAndDelete({
        i_id: req.params.id,
        v_id: req.vendor.v_id
      });

      if (!invoice) {
        return res.status(404).json({
          message: 'Invoice not found'
        });
      }

      res.json({
        message: 'Invoice deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error deleting invoice',
        error: error.message
      });
    }
  },

  generatePDF: async (req, res) => {
    try {
      const invoice = await Invoice.findOne({
        i_id: req.params.id,
        v_id: req.vendor.v_id
      });

      if (!invoice) {
        return res.status(404).json({
          message: 'Invoice not found'
        });
      }

      const pdfBuffer = await generatePDF(invoice);

      await new History({
        h_id: generateUniqueId('H'),
        i_id: req.params.id,
        v_id: req.vendor.v_id,
        c_id: invoice.c_id,
        action_type: 'downloaded',
        action_details: {
          format: 'PDF'
        }
      }).save();

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.i_id}.pdf`);
      res.send(pdfBuffer);
    } catch (error) {
      res.status(500).json({
        message: 'Error generating PDF',
        error: error.message
      });
    }
  },

  sendInvoice: async (req, res) => {
    try {
      const { email } = req.body;
      const invoice = await Invoice.findOne({
        i_id: req.params.id,
        v_id: req.vendor.v_id
      });

      if (!invoice) {
        return res.status(404).json({
          message: 'Invoice not found'
        });
      }

      const pdfBuffer = await generatePDF(invoice);
      await sendEmail({
        to: email,
        subject: `Invoice ${invoice.i_id} from ${invoice.v_name}`,
        text: 'Please find attached invoice.',
        attachments: [{
          filename: `invoice-${invoice.i_id}.pdf`,
          content: pdfBuffer
        }]
      });

      await new History({
        h_id: generateUniqueId('H'),
        i_id: req.params.id,
        v_id: req.vendor.v_id,
        c_id: invoice.c_id,
        action_type: 'sent',
        action_details: {
          sent_to: email
        }
      }).save();

      res.json({
        message: 'Invoice sent successfully'
      });
    } catch (error) {
      res.status(500).json({
        message: 'Error sending invoice',
        error: error.message
      });
    }
  }
};

module.exports = invoiceController;