const PDFDocument = require('pdfkit');

const generatePDF = (invoice) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Add content to the PDF
      doc.fontSize(20).text('Invoice', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Invoice Number: ${invoice.i_id}`);
      doc.text(`Date: ${invoice.i_date.toLocaleDateString()}`);
      doc.moveDown();
      doc.text(`Customer: ${invoice.c_name}`);
      doc.text(`Email: ${invoice.c_mail}`);
      doc.moveDown();
      doc.text('Items:');
      invoice.i_product_det_obj.forEach(item => {
        doc.text(`${item.description} - Quantity: ${item.qty} - Price: $${item.price}`);
      });
      doc.moveDown();
      doc.text(`Subtotal: $${invoice.i_total_amnt}`);
      doc.text(`Tax: $${invoice.i_tax}`);
      doc.text(`Discount: $${invoice.i_discount}`);
      doc.text(`Total: $${invoice.i_amnt_aft_tax}`);
      doc.moveDown();
      doc.text(`Warranty: ${invoice.i_warranty_guaranty}`);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generatePDF };