const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async ({ to, subject, text, html, attachments }) => {
  if (process.env.USE_EMAIL_SERVICE !== 'true') {
    console.log('Email service is disabled. Would have sent:', { to, subject, text });
    return true;
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
      attachments
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

module.exports = { sendEmail };