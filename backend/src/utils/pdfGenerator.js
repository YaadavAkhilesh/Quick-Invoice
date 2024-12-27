const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generatePDF = (invoice) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50
      });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Set font
      doc.font('Helvetica');

      // Colors
      const darkGreen = '#3c3c2e';
      const yellow = '#ffc000';

      // Header
      doc.fillColor(darkGreen)
         .rect(0, 0, doc.page.width, 150)
         .fill();

      doc.fillColor('white')
         .fontSize(28)
         .font('Helvetica-Bold')
         .text(invoice.v_name.toUpperCase(), 50, 50);

      doc.fontSize(10)
         .font('Helvetica')
         .text(invoice.v_address, 50, 85)
         .text(`Tel: ${invoice.v_telephone} | Email: ${invoice.v_mail}`, 50, 100);

      // Invoice title
      doc.fillColor(yellow)
         .rect(450, 0, 100, 150)
         .fill();

      doc.fillColor(darkGreen)
         .fontSize(28)
         .font('Helvetica-Bold')
         .text('INVOICE', 460, 60, { width: 80, align: 'center' });

      // Reset text color
      doc.fillColor('black');

      // Bill To
      doc.fontSize(12)
         .font('Helvetica-Bold')
         .text('BILL TO:', 50, 170);

      doc.fontSize(10)
         .font('Helvetica')
         .text(invoice.c_name, 50, 190)
         .text(invoice.c_address || 'N/A', 50, 205)
         .text(invoice.c_mail, 50, 220);

      // Invoice details
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .text('Invoice Number:', 350, 170)
         .text('Issue Date:', 350, 185)
         .text('Due Date:', 350, 200);

      doc.fontSize(10)
         .font('Helvetica')
         .text(invoice.i_id, 450, 170)
         .text(invoice.i_date.toLocaleDateString(), 450, 185)
         .text(new Date(invoice.i_date.getTime() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString(), 450, 200);

      // Table header
      const tableTop = 270;
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .text('Item', 50, tableTop)
         .text('Quantity', 250, tableTop)
         .text('Price', 350, tableTop)
         .text('Amount', 450, tableTop);

      // Table content
      let tableRow = tableTop + 20;
      doc.font('Helvetica');
      invoice.i_product_det_obj.forEach(item => {
        doc.text(item.description, 50, tableRow)
           .text(item.qty.toString(), 250, tableRow)
           .text(`$${item.price.toFixed(2)}`, 350, tableRow)
           .text(`$${(item.qty * item.price).toFixed(2)}`, 450, tableRow);
        tableRow += 20;
      });

      // Totals
      const totalsTop = tableRow + 20;
      doc.font('Helvetica-Bold')
         .text('Subtotal:', 350, totalsTop)
         .text(`Tax (${invoice.i_tax}%):`, 350, totalsTop + 20)
         .text('Discount:', 350, totalsTop + 40)
         .text('Total Due:', 350, totalsTop + 60);

      doc.font('Helvetica')
         .text(`$${invoice.i_total_amnt.toFixed(2)}`, 450, totalsTop)
         .text(`$${(invoice.i_total_amnt * invoice.i_tax / 100).toFixed(2)}`, 450, totalsTop + 20)
         .text(`$${invoice.i_discount.toFixed(2)}`, 450, totalsTop + 40)
         .text(`$${invoice.i_amnt_aft_tax.toFixed(2)}`, 450, totalsTop + 60);

      // Payment methods
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .text('Our Payment Methods:', 50, totalsTop)
         .font('Helvetica')
         .text('Bank Transfer, PayPal, Credit Card', 50, totalsTop + 15);

      // Notes
      doc.fontSize(10)
         .font('Helvetica-Bold')
         .text('NOTES:', 50, totalsTop + 60)
         .font('Helvetica')
         .text('Thank you for your business!', 50, totalsTop + 75);

      // Footer
      doc.fontSize(10)
         .text(invoice.v_name, 50, 750)
         .text('Page 1 of 1', 500, 750);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generatePDF };