const nodemailer = require('nodemailer'); // Require nodemailer for sending emails

// Create a transporter object using Gmail as the email service
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use Gmail as the email service
  secure: true, // Use a secure connection
  port: 465, // Port for secure SMTP (SSL)
  auth: {
    user: process.env.EMAIL_USER, // Email address (from environment variables)
    pass: process.env.EMAIL_PASS // Email password (from environment variables)
  }
});

// Function to send an email
const sendEmail = async ({ to, subject, text, html, attachments }) => {
  // Check if the email service is disabled (for testing or development)
  if (process.env.USE_EMAIL_SERVICE !== 'true') {
    console.log('Email service is disabled. Would have sent:', { to, subject, text });
    return true; // Simulate a successful email send
  }

  try {
    // Define the email options
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender's email address
      to, // Recipient's email address
      subject, // Email subject
      text, // Plain text version of the email
      html, // HTML version of the email
      attachments // Attachments (if any)
    };

    // Send the email using the transporter
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response); // Log the success message
    return true; // Return true to indicate the email was sent successfully
  } catch (error) {
    console.error('Email sending error:', error); // Log any errors
    throw error; // Re-throw the error to handle it elsewhere
  }
};

// Export the sendEmail function so it can be used in other parts of the application
module.exports = { sendEmail };