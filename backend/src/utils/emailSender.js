const nodemailer = require('nodemailer'); // For sending emails

const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  port: 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Function to send an email
const sendEmail = async ({ to, subject, text, html, attachments }) => {
  // Check if the email service is disabled (for testing or development)
  if (process.env.USE_EMAIL_SERVICE !== 'true') {
    console.log('Email service is disabled. Would have sent:', { to, subject, text });
    return true;
  }

  try {
    // Define the email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
      attachments
    };

    // Sending the email using the transporter
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

module.exports = { sendEmail };