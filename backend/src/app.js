require('dotenv').config({ path: '../.env' });
const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const templateRoutes = require('./routes/templateRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const historyRoutes = require('./routes/historyRoutes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Logging middleware
morgan.token('body', (req) => JSON.stringify(req.body));
// app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));
app.use(morgan((tokens, req, res) => {
  // Skip logging if the response status code is 4xx or 5xx
  if (res.statusCode >= 400) {
    return null; // Skip logging
  }

  // Checking if the request body contains a password
  if (req.body.password) {
    // Create a copy of the request body and replace the password with the hashed password
    const requestBodyWithHashedPassword = { ...req.body };
    requestBodyWithHashedPassword.password = bcrypt.hashSync(req.body.password, 10); // Hash the password

    // Log the request body with the hashed password
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens['response-time'](req, res), 'ms',
      '-', tokens.res(req, res, 'content-length'),
      '-', JSON.stringify(requestBodyWithHashedPassword),
      '-', tokens.req(req, res, 'content-length')
    ].join(' ');
  } else {
    // Log the request body as is
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens['response-time'](req, res), 'ms',
      '-', tokens.res(req, res, 'content-length'),
      '-', tokens.body(req, res),
      '-', tokens.req(req, res, 'content-length')
    ].join(' ');
  }
}));

// Basic route handler
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Quick Invoice API' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/history', historyRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error:`, err);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] Server running on port ${PORT}`);
});

module.exports = app;