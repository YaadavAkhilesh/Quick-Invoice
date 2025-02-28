require('dotenv').config({ path: '../.env' });

const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors'); // For the frontend interactaction to the backend.
const helmet = require('helmet'); // For securing HTTP headers (makes the app safer).
const morgan = require('morgan');
const connectDB = require('./config/db');
const path = require('path');

// Importing route handlers.
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const templateRoutes = require('./routes/templateRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const historyRoutes = require('./routes/historyRoutes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json()); // Parses incoming JSON data (like from POST requests).
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data (like form submissions).

connectDB();

morgan.token('body', (req) => JSON.stringify(req.body));

// app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));

// Custom Morgan logging format. We skip logging for errors (4xx and 5xx) to keep logs clean.
app.use(morgan((tokens, req, res) => {
  if (res.statusCode >= 400) {
    return null;
  }

  // If the request body contains a password, hashing it before logging
  if (req.body.password) {
    // Creating a copy of the request body and replacing the password with a hashed version.
    const requestBodyWithHashedPassword = { ...req.body };
    requestBodyWithHashedPassword.password = bcrypt.hashSync(req.body.password, 10); // Hashing the password.

    // Logging the request details, including the hashed password.
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
    // If there's no password, log the request body as is.
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens['response-time'](req, res), 'ms',
      '-', tokens.res(req, res, 'content-length'),
      '-', tokens.body(req, res), // Request body.
      '-', tokens.req(req, res, 'content-length')
    ].join(' ');
  }
}));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

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
    error: process.env.NODE_ENV === 'development' ? err.message : undefined   // Include error details in development mode only.
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] Server running on port ${PORT}`); 
});

module.exports = app;