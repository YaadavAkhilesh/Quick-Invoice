const PDFDocument = require('pdfkit'); // We're using PDFKit to create PDFs. It's awesome!
const fs = require('fs'); // For checking if files exist (like fonts).
const path = require('path'); // To handle file paths easily.

// A quick helper function to format dates as DD/MM/YYYY. Dates can be messy, so this keeps it clean.
const formatDate = (date) => {
  const day = date.getDate().toString().padStart(2, '0');   // Make sure the day is always 2 digit
  const month = (date.getMonth() + 1).toString().padStart(2, '0');  // Months are 0-indexed, so +1 and pad.
  const year = date.getFullYear(); // Just grab the full year.
  return `${day}/${month}/${year}`; // Combine it all into a neat string.
};

// The main function to generate a PDF invoice. It returns a promise because PDF generation can take time.
const generatePDF = (invoice) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
      });

      // We'll store the PDF data in chunks (buffers) and combine them later.
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers)); // Collect chunks of data.
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers); // Combine all chunks into one buffer.
        resolve(pdfData); // Send the final PDF data back.
      });

      // Colors
      const darkOlive = '#3c3c2e'; // A dark olive for headers.
      const yellow = '#ffc000'; // A bright yellow for highlights.
      const lightGray = '#f5f5f5'; // A light gray for alternating table rows.

      // Font paths - Paths to our custom fonts. We're using Noto Sans because of Rupee Symbol
      const fontDir = path.join(__dirname, 'fonts', 'static'); // Where the fonts live.
      const fontPaths = {
        regular: path.join(fontDir, 'NotoSans-Regular.ttf'), // Regular font for most text.
        bold: path.join(fontDir, 'NotoSans-Bold.ttf'), // Bold font for headings.
        italic: path.join(fontDir, 'NotoSans-Italic.ttf'), // Italic for signatures.
      };

      // Check if the font files exist. If not, throw an error.
      for (const [type, fontPath] of Object.entries(fontPaths)) {
        if (!fs.existsSync(fontPath)) {
          throw new Error(`Font file not found: ${fontPath}`);  // Oops, someone forgot to add the fonts!
        }
      }

      // Register the fonts so we can use them in the PDF.
      doc.registerFont('NotoSans', fontPaths.regular); // Regular font.
      doc.registerFont('NotoSans-Bold', fontPaths.bold); // Bold font.
      doc.registerFont('NotoSans-Italic', fontPaths.italic); // Italic font.

      // Start building the PDF! First, the header section.
      // --- Header ---
      // Syntax :- doc.fillColor(color).rect(x, y, width, height).fill();
      doc.fillColor(darkOlive).rect(0, 0, doc.page.width, 120).fill();      // A dark olive rectangle at the top.

      // Quick Invoice Logo
      // Syntax :- doc.image(imagePath, x, y, options);
      doc.image(
        path.join(__dirname, '../utils/quick_invoice-logo.png'), 20, 36, { width: 60, height: 60 });

      // Company Name
      // Syntax :- doc.fillColor(color).fontSize(size).font(fontName).text(text, x, y);
      doc.fillColor('white')
        .fontSize(20)
        .font('NotoSans-Bold')
        .text(invoice.v_name.toUpperCase(), 90, 36);

      // Company details with validation
      doc.fontSize(10)
         .font('NotoSans')
         .text(invoice.v_address || 'Address not provided', 90, 65)
         .text(`Tel: ${invoice.v_telephone || 'Not provided'} | Email: ${invoice.v_mail || 'Not provided'}`, 90, 80);

      // Add a yellow BOX for the "INVOICE" text.
      doc.fillColor(yellow)
         .rect(450, 0, 100, 120)
         .fill();

      // Add the "INVOICE" text inside the yellow box. Centered and bold.
      doc.fillColor(darkOlive)
         .fontSize(20)
         .font("NotoSans-Bold")
         .text("INVOICE", 453, 50, { align: "center" });

      // Reset the text color to black for the rest of the document.
      doc.fillColor("black");

      // Add the "BILL TO" section. This is where the customer's details go.
      doc.fontSize(12)
         .font("NotoSans-Bold")
         .text("BILL TO:", 50, 170);

      // Labels for customer details in bold (Name, Email, Mobile, Address).
      doc.fontSize(10)
         .font("NotoSans-Bold")
         .text("Name:", 50, 190)
         .text("Email:", 50, 205)
         .text("Mobile No:", 50, 220)
         .text("Address:", 50, 235);

      // Values - Actual customer details in regular fonts. If any are missing, we show "Not Provided".
      doc.font("NotoSans")
         .text(invoice.c_name || "Not Provided", 110, 190)
         .text(invoice.c_mail || "Not Provided", 110, 205)
         .text(invoice.c_mobile || "Not Provided", 110, 220)
         .text(invoice.c_address || "Not Provided", 110, 235);

      // Add "INVOICE DETAILS" (Invoice Number, Issue Date, Due Date).
      doc.fontSize(10)
        .font("NotoSans-Bold")
        .text("Invoice Number:", 345, 170)
        .text("Issue Date:", 345, 185)
        .text("Due Date:", 345, 200);

      // Values - Actual "INVOICE DETAILS". Due date is 15 days after the issue date.
      doc.fontSize(10)
         .font("NotoSans")
         .text(invoice.i_id, 443, 170)
         .text(formatDate(invoice.i_date), 443, 185)
         .text(formatDate(new Date(invoice.i_date.getTime() + 15 * 24 * 60 * 60 * 1000)), 443, 200);

      // Table for products
      const tableTop = 270; // Top position of the table.
      const tableWidth = 500; // Width of the table.
      const columns = {
        item: { x: 60, width: 200 }, // Column for product descriptions.
        quantity: { x: 260, width: 100 }, // Column for quantities.
        price: { x: 360, width: 100 }, // Column for prices.
        amount: { x: 460, width: 100 }, // Column for total amounts.
      };

      // Table header with a yellow background.
      doc.fillColor(yellow)
         .rect(50, tableTop, tableWidth, 25)
         .fill();

      doc.fillColor(darkOlive)
         .fontSize(10)
         .font("NotoSans-Bold");

      // Add column headers.
      doc
        .text("PRODUCTS", columns.item.x, tableTop + 8)
        .text("QUANTITY", columns.quantity.x, tableTop + 8)
        .text("PRICE (₹)", columns.price.x, tableTop + 8)
        .text("AMOUNT (₹)", columns.amount.x, tableTop + 8);

      // Table content - Add rows for each product in the invoice.
      let tableRow = tableTop + 25; // Start position for the first row.
      doc.font("NotoSans");

      invoice.i_product_det_obj.forEach((item, index) => {
        // Add a light gray background to every other row for better readability.
        if (index % 2 === 0) {
          doc.fillColor(lightGray).rect(50, tableRow, tableWidth, 25).fill();
        }

        // Add product details to the table.
        doc.fillColor("black")
          .text(item.description || "Product description not provided",columns.item.x,tableRow + 8)
          .text(item.qty.toString(), columns.quantity.x, tableRow + 8)
          .text(`₹${item.price.toFixed(2)}`, columns.price.x, tableRow + 8)
          .text(`₹${(item.qty * item.price).toFixed(2)}`,columns.amount.x,tableRow + 8);
        tableRow += 25;
      });

      // Add the totals section at the bottom of the table.
      const totalsTop = tableRow + 20;  // Position for the totals.
      doc.fillColor(lightGray).rect(350, totalsTop, 200, 100).fill();   // Gray background for totals.

      // Labels for subtotal, tax, and total due.
      doc.fillColor("black")
        .fontSize(10)
        .font("NotoSans-Bold")
        .text("Sub Total", 360, totalsTop + 10)
        .text(`Tax ${invoice.i_tax}%`, 360, totalsTop + 35)
        .text("Total Due", 360, totalsTop + 60);

      // Actual values for subtotal, tax, and total due.
      doc.font("NotoSans")
        .text(`₹${invoice.i_total_amnt.toFixed(2)}`, 460, totalsTop + 10)
        .text(`₹${((invoice.i_total_amnt * invoice.i_tax) / 100).toFixed(2)}`,460,totalsTop + 35)
        .text(`₹${invoice.i_amnt_aft_tax.toFixed(2)}`, 460, totalsTop + 60);

      // Payment methods
      doc.fontSize(10)
        .font("NotoSans-Bold")
        .text("Our Payment Methods:", 50, totalsTop + 10);

      doc.font("NotoSans")
        .text("Bank Transfer, UPI, Debit Card, Credit Card", 50, totalsTop + 30);

      // Add the payment method used by the customer.
      doc.fontSize(10)
        .font("NotoSans-Bold")
        .text("Payment Done By:", 50, totalsTop + 80);

      doc.font("NotoSans")
        .text(invoice.payment_method || "Not specified", 150, totalsTop + 80);

      // Notes section
      doc.fontSize(11)
        .font("NotoSans-Bold")
        .fillColor(yellow)
        .text("NOTES", 50, totalsTop + 100);

      doc.fillColor("black")
        .fontSize(10)
        .font("NotoSans")
        .text("Please feel free to contact us!", 50, totalsTop + 120)
        .font("NotoSans-Bold")
        .text("Thank you for your time & business!", 50, totalsTop + 140);

      // Signature
      doc.fontSize(10)
        .font("NotoSans-Italic")
        .text("Authorized Signature", 400, totalsTop + 140);

      // Footer
      doc.fontSize(10).font("NotoSans-Bold").text(invoice.v_name, 50, 750);

      doc.fillColor("gray")
        .fontSize(10)
        .font("NotoSans-Bold")
        .text("Page 1 of 1", 475, 750);

      // End the PDF.
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generatePDF };