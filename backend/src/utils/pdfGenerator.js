const PDFDocument = require('pdfkit');

const generatePDF = async (invoice) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const chunks = [];

      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // Add company logo
      if (invoice.v_logo) {
        doc.image(invoice.v_logo, 50, 45, { width: 50 });
      }

      // Add company info
      doc.fontSize(20)
         .text('INVOICE', 50, 50)
         .fontSize(10)
         .text(invoice.v_name, 50, 100)
         .text(invoice.v_address)
         .text(`Tel: ${invoice.v_telephone}`)
         .text(`Business Code: ${invoice.v_business_code}`);

      // Add invoice details
      doc.text(`Invoice Number: ${invoice.i_id}`, 50, 200)
         .text(`Date: ${invoice.i_date.toLocaleDateString()}`);

      // Add customer details
      doc.text(`Bill To:`, 50, 250)
         .text(invoice.c_name)
         .text(invoice.c_mail);

      // Add items table
      let y = 350;
      doc.text('Description', 50, y)
         .text('Quantity', 200, y)
         .text('Price', 300, y)
         .text('Amount', 400, y);

      y += 20;
      invoice.i_product_det_obj.forEach(item => {
        doc.text(item.description, 50, y)
           .text(item.qty.toString(), 200, y)
           .text(item.price.toString(), 300, y)
           .text((item.qty * item.price).toString(), 400, y);
        y += 20;
      });

      // Add totals
      y += 20;
      doc.text(`Subtotal: ${invoice.i_total_amnt}`, 300, y)
         .text(`Tax (${invoice.i_tax}%): ${invoice.i_total_amnt * (invoice.i_tax/100)}`, 300, y + 20)
         .text(`Discount: ${invoice.i_discount}`, 300, y + 40)
         .text(`Total: ${invoice.i_amnt_aft_tax}`, 300, y + 60);

      // Add warranty/guarantee info if exists
      if (invoice.i_warranty_guaranty) {
        doc.text(`Warranty/Guarantee: ${invoice.i_warranty_guaranty}`, 50, y + 100);
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generatePDF };