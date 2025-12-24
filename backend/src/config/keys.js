module.exports = {
  // Secret key for signing JSON Web Tokens
  JWT_SECRET: process.env.JWT_SECRET,

  // Token expiration time
  JWT_EXPIRE: '24h',

  // Razorpay credentials
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,

  // Email service credentials
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS
};