// Load environment variables from a .env file. This keeps sensitive info like API keys safe.
require('dotenv').config({ path: '../.env' });

// Import necessary libraries. These are the tools we need to build the app.
const express = require('express'); // For creating the server.
const bcrypt = require('bcrypt'); // For hashing passwords (used in logging middleware).
const cors = require('cors'); // To allow cross-origin requests (so the frontend can talk to the backend).
const helmet = require('helmet'); // For securing HTTP headers (makes the app safer).
const morgan = require('morgan'); // For logging HTTP requests (helps with debugging).
const connectDB = require('./config/db'); // To connect to the MongoDB database.
const path = require('path');

// Import route handlers.
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const templateRoutes = require('./routes/templateRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const historyRoutes = require('./routes/historyRoutes');

// Create the Express app. This is the heart of our backend.
const app = express();

// Middleware setup. These are like "plugins" that add functionality to the app.
app.use(helmet()); // Adds security headers to protect the app.
app.use(cors()); // Allows the frontend to communicate with the backend.
app.use(express.json()); // Parses incoming JSON data (like from POST requests).
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data (like form submissions).

// Connect to MongoDB database
connectDB();

// Custom Logging Middleware using Morgan. This logs all incoming requests for debugging.
morgan.token('body', (req) => JSON.stringify(req.body));   // Adds the request body to the logs.

// app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));

// Custom Morgan logging format. We skip logging for errors (4xx and 5xx) to keep logs clean.
app.use(morgan((tokens, req, res) => {
  // Skip logging if the response status code is 4xx or 5xx.
  if (res.statusCode >= 400) {
    return null; // Skip logging for errors.
  }

  // If the request body contains a password, hash it before logging (for security).
  if (req.body.password) {
    // Create a copy of the request body and replace the password with a hashed version.
    const requestBodyWithHashedPassword = { ...req.body };
    requestBodyWithHashedPassword.password = bcrypt.hashSync(req.body.password, 10); // Hash the password.

    // Log the request details, including the hashed password.
    return [
      tokens.method(req, res), // HTTP method (GET, POST, etc.).
      tokens.url(req, res), // Request URL.
      tokens.status(req, res), // Response status code.
      tokens['response-time'](req, res), 'ms', // Response time in milliseconds.
      '-', tokens.res(req, res, 'content-length'), // Response content length.
      '-', JSON.stringify(requestBodyWithHashedPassword), // Request body with hashed password.
      '-', tokens.req(req, res, 'content-length') // Request content length.
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

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Basic route handler for the root URL. Just a welcome message.
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Quick Invoice API' });
});

// Routes
app.use('/api/auth', authRoutes);   // Authentication routes (login, signup, etc.).
app.use('/api/customers', customerRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/history', historyRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error:`, err);   // Log the error for debugging.
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined   // Include error details in development mode only.
  });
});

// Start the server. This makes the app "live" and ready to handle requests.
const PORT = process.env.PORT || 5000;    // Use the port from the environment variables, or default to 5000.
app.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] Server running on port ${PORT}`);    // Log when the server starts.
});

module.exports = app;