const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const formatDate = (date) => {
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
};

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

      // Colors
      const darkOlive = '#3c3c2e';
      const yellow = '#ffc000';
      const lightGray = '#f5f5f5';

      // Header
      doc.fillColor(darkOlive)
         .rect(0, 0, doc.page.width, 120)
         .fill();

      // Quick Invoice Logo
      doc.image(path.join(__dirname, '../utils/quick_invoice-logo.png'), 20, 33, { width: 60, height: 60 });

      // Company name
      doc.fillColor('white')
         .fontSize(20)
         .font('NotoSans-Bold')
         .text(invoice.v_name.toUpperCase(), 90, 40);

      // Company details with validation
      doc.fontSize(10)
         .font('NotoSans')
         .text(invoice.v_address || 'Address not provided', 90, 70)
         .text(`Tel: ${invoice.v_telephone || 'Not provided'} | Email: ${invoice.v_mail || 'Not provided'}`, 90, 85);

      // Invoice box 
      doc.fillColor(yellow)
         .rect(450, 0, 100, 120)
         .fill();

      // Invoice text
      doc.fillColor(darkOlive)
         .fontSize(20)
         .font('NotoSans-Bold')
         .text('INVOICE', 452, 60, { align: 'center' });

      // Reset text color
      doc.fillColor('black');

      // Bill To section with validation
      doc.fontSize(12)
         .font('NotoSans-Bold')
         .text('BILL TO:', 50, 170);

      // Labels in bold
      doc.fontSize(10)
         .font('NotoSans-Bold')
         .text('Name:', 50, 190)
         .text('Email:', 50, 205)
         .text('Mobile No:', 50, 220)
         .text('Address:', 50, 235);

      // Values in regular font
      doc.font('NotoSans')
         .text(invoice.c_name || 'Not Provided', 110, 190)
         .text(invoice.c_mail || 'Not Provided', 110, 205)
         .text(invoice.c_mobile || 'Not Provided', 110, 220)
         .text(invoice.c_address || 'Not Provided', 110, 235);
         
      // Invoice details
      doc.fontSize(10)
         .font('NotoSans-Bold')
         .text('Invoice Number:', 350, 170)
         .text('Issue Date:', 350, 185)
         .text('Due Date:', 350, 200);

      doc.fontSize(10)
         .font('NotoSans')
         .text(invoice.i_id, 450, 170)
         .text(formatDate(invoice.i_date), 450, 185)
         .text(formatDate(new Date(invoice.i_date.getTime() + 15 * 24 * 60 * 60 * 1000)), 450, 200);

      // Table
      const tableTop = 270;
      const tableWidth = 500;
      const columns = {
        item: { x: 60, width: 200 },
        quantity: { x: 260, width: 100 },
        price: { x: 360, width: 100 },
        amount: { x: 460, width: 100 }
      };

      // Table header
      doc.fillColor(yellow)
         .rect(50, tableTop, tableWidth, 25)
         .fill();

      doc.fillColor(darkOlive)
         .fontSize(10)
         .font('NotoSans-Bold');

      doc.text('PRODUCTS', columns.item.x, tableTop + 8)
         .text('QUANTITY', columns.quantity.x, tableTop + 8)
         .text('PRICE (₹)', columns.price.x, tableTop + 8)
         .text('AMOUNT (₹)', columns.amount.x, tableTop + 8);

      // Table content
      let tableRow = tableTop + 25;
      doc.font('NotoSans');

      invoice.i_product_det_obj.forEach((item, index) => {
        // Add alternating row background
        if (index % 2 === 0) {
          doc.fillColor(lightGray)
             .rect(50, tableRow, tableWidth, 25)
             .fill();
        }

        doc.fillColor('black')
           .text(item.description || 'Product description not provided', columns.item.x, tableRow + 8)
           .text(item.qty.toString(), columns.quantity.x, tableRow + 8)
           .text(`₹${item.price.toFixed(2)}`, columns.price.x, tableRow + 8)
           .text(`₹${(item.qty * item.price).toFixed(2)}`, columns.amount.x, tableRow + 8);

        tableRow += 25;
      });

      // Totals section with gray background
      const totalsTop = tableRow + 20;
      doc.fillColor(lightGray)
         .rect(350, totalsTop, 200, 100)
         .fill();

      doc.fillColor('black')
         .fontSize(10)
         .font('NotoSans-Bold')
         .text('Sub Total', 360, totalsTop + 10)
         .text(`Tax ${invoice.i_tax}%`, 360, totalsTop + 35)
         .text('Total Due', 360, totalsTop + 60);

      doc.font('NotoSans')
         .text(`₹${invoice.i_total_amnt.toFixed(2)}`, 460, totalsTop + 10)
         .text(`₹${(invoice.i_total_amnt * invoice.i_tax / 100).toFixed(2)}`, 460, totalsTop + 35)
         .text(`₹${invoice.i_amnt_aft_tax.toFixed(2)}`, 460, totalsTop + 60);

      // Payment methods
      doc.fontSize(10)
         .font('NotoSans-Bold')
         .text('Our Payment Methods:', 50, totalsTop + 10);

      doc.font('NotoSans')
         .text('Bank Transfer, UPI, Debit Card, Credit Card', 50, totalsTop + 30);

      doc.fontSize(10)
         .font('NotoSans-Bold')
         .text('Payment Done By:', 50, totalsTop + 80);

      doc.font('NotoSans')
         .text(invoice.payment_method || 'Not specified', 150, totalsTop + 80);

      // Notes section
      doc.fontSize(11)
         .font('NotoSans-Bold')
         .fillColor(yellow)
         .text('NOTES', 50, totalsTop + 100);

      doc.fillColor('black')
         .fontSize(10)
         .font('NotoSans')
         .text('Please feel free to contact us!', 50, totalsTop + 120)
         .font('NotoSans-Bold')
         .text('Thank you for your time & business!', 50, totalsTop + 140);

      // Signature
      doc.fontSize(10)
         .font('NotoSans-Italic')
         .text('Authorized Signature', 400, totalsTop + 140);

      // Footer
      doc.fontSize(10)
         .font('NotoSans-Bold')
         .text(invoice.v_name, 50, 750);

      doc.fillColor('gray')
         .fontSize(10)
         .font('NotoSans-Bold')
         .text('Page 1 of 1', 475, 750);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generatePDF };