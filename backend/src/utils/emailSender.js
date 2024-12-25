const sgMail = require('@sendgrid/mail');
const { SENDGRID_API_KEY, EMAIL_FROM } = require('../config/keys');

if (process.env.USE_EMAIL_SERVICE === 'true') {
  if (!SENDGRID_API_KEY) {
    console.warn('Warning: SENDGRID_API_KEY is not configured. Email functionality will not work.');
  } else {
    sgMail.setApiKey(SENDGRID_API_KEY);
  }
}

const sendEmail = async ({ to, subject, text, html, attachments }) => {
  if (process.env.USE_EMAIL_SERVICE !== 'true') {
    console.log('Email service is disabled. Would have sent:', { to, subject, text });
    return true;
  }

  if (!SENDGRID_API_KEY) {
    throw new Error('SendGrid API key is not configured');
  }

  if (!EMAIL_FROM) {
    throw new Error('Sender email address is not configured');
  }

  const msg = {
    to,
    from: EMAIL_FROM,
    subject,
    text,
    html,
    attachments
  };

  try {
    await sgMail.send(msg);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};

module.exports = { sendEmail };