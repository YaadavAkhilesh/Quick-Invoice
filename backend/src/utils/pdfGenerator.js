const PDFDocument = require('pdfkit');

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

      // Set colors
      const darkGreen = '#3c3c2e';
      const yellow = '#ffc000';

      // Header
      doc.fillColor(darkGreen)
         .rect(0, 0, doc.page.width, 100)
         .fill();

      doc.fillColor('white')
         .fontSize(24)
         .text(invoice.v_name, 50, 30);

      doc.fontSize(10)
         .text(invoice.v_address, 50, 60)
         .text(`Tel: ${invoice.v_telephone} | Email: ${invoice.v_mail}`, 50, 75);

      // Invoice title
      doc.fillColor(yellow)
         .rect(450, 0, 100, 100)
         .fill();

      doc.fillColor('white')
         .fontSize(24)
         .text('Invoice', 460, 40, { width: 80, align: 'center' });

      // Reset text color
      doc.fillColor('black');

      // Bill To
      doc.fontSize(12)
         .text('BILL TO:', 50, 120);

      doc.fontSize(10)
         .text(invoice.c_name, 50, 140)
         .text(invoice.c_address, 50, 155)
         .text(invoice.c_mail, 50, 170);

      // Invoice details
      doc.fontSize(10)
         .text(`Invoice Number: ${invoice.i_id}`, 350, 120)
         .text(`Issue Date: ${invoice.i_date.toLocaleDateString()}`, 350, 135)
         .text(`Due Date: ${new Date(invoice.i_date.getTime() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString()}`, 350, 150);

      // Table header
      const tableTop = 220;
      doc.fontSize(10)
         .text('Item', 50, tableTop)
         .text('Quantity', 250, tableTop)
         .text('Price', 350, tableTop)
         .text('Amount', 450, tableTop);

      // Table content
      let tableRow = tableTop + 20;
      invoice.i_product_det_obj.forEach(item => {
        doc.text(item.description, 50, tableRow)
           .text(item.qty.toString(), 250, tableRow)
           .text(`$${item.price.toFixed(2)}`, 350, tableRow)
           .text(`$${(item.qty * item.price).toFixed(2)}`, 450, tableRow);
        tableRow += 20;
      });

      // Totals
      const totalsTop = tableRow + 20;
      doc.text('Subtotal:', 350, totalsTop)
         .text(`$${invoice.i_total_amnt.toFixed(2)}`, 450, totalsTop)
         .text(`Tax (${invoice.i_tax}%):`, 350, totalsTop + 20)
         .text(`$${(invoice.i_total_amnt * invoice.i_tax / 100).toFixed(2)}`, 450, totalsTop + 20)
         .text('Discount:', 350, totalsTop + 40)
         .text(`$${invoice.i_discount.toFixed(2)}`, 450, totalsTop + 40)
         .text('Total Due:', 350, totalsTop + 60)
         .text(`$${invoice.i_amnt_aft_tax.toFixed(2)}`, 450, totalsTop + 60);

      // Payment methods
      doc.fontSize(10)
         .text('Our Payment Methods:', 50, totalsTop)
         .text('Bank Transfer, PayPal, Credit Card', 50, totalsTop + 15);

      // Notes
      doc.fontSize(10)
         .text('NOTES:', 50, totalsTop + 60)
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