// app.js
// Main application file for Quick Invoice backend.

// Load environment variables from .env file
require('dotenv').config({ path: '../.env' });

const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const path = require('path');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const getFormattedTimestamp = require('./utils/formatTimestamp');

// ---------------------------------------------------------------
// 1️⃣  Import the new desktop‑guard middleware
// ---------------------------------------------------------------
const desktopGuard = require('./middlewares/desktopGuard');

// Import route handlers.
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const templateRoutes = require('./routes/templateRoutes');
const historyRoutes = require('./routes/historyRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const connectRoutes = require('./routes/connectRoutes');
const adminRoutes = require('./routes/adminRoutes');
const adminAuthRoutes = require('./routes/adminAuthRoutes');
const { profileRateLimit } = require('./middlewares/rateLimit');

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: ['http://localhost:5173'],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------------------------------------------------------
// 2️⃣  Create uploads directories (unchanged)
// ---------------------------------------------------------------
const uploadsDir = path.join(__dirname, '../uploads');
const profilesDir = path.join(uploadsDir, 'profiles');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
if (!fs.existsSync(profilesDir)) fs.mkdirSync(profilesDir);

// Serve uploaded files statically
app.use(
  '/uploads',
  (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS');
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  },
  express.static(uploadsDir)
);

// ---------------------------------------------------------------
// 3️⃣  Connect to DB (unchanged)
// ---------------------------------------------------------------
connectDB();

// ---------------------------------------------------------------
// 4️⃣  Morgan logger (unchanged)
// ---------------------------------------------------------------
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(
  morgan((tokens, req, res) => {
    if (res.statusCode >= 400) return null;

    if (req.body.password) {
      const copy = { ...req.body };
      copy.password = bcrypt.hashSync(req.body.password, 10);
      return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens['response-time'](req, res),
        'ms',
        '-',
        tokens.res(req, res, 'content-length'),
        '-',
        JSON.stringify(copy),
        '-',
        tokens.req(req, res, 'content-length'),
      ].join(' ');
    }

    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens['response-time'](req, res),
      'ms',
      '-',
      tokens.res(req, res, 'content-length'),
      '-',
      tokens.body(req, res),
      '-',
      tokens.req(req, res, 'content-length'),
    ].join(' ');
  })
);

// ---------------------------------------------------------------
// 5️⃣  Global CORS headers removed (handled by cors middleware above)
// ---------------------------------------------------------------

// ---------------------------------------------------------------
// 6️⃣  **Register the desktop‑guard BEFORE any route that could serve heavy content**
// ---------------------------------------------------------------
app.use(desktopGuard);

// ---------------------------------------------------------------
// 7️⃣  Simple health endpoint (still public)
// ---------------------------------------------------------------
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Quick Invoice API' });
});

// ---------------------------------------------------------------
// 8️⃣  API routes (unchanged)
// ---------------------------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/invoices', fileUpload(), invoiceRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/connect', connectRoutes);
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin', adminRoutes);

// ---------------------------------------------------------------
// 9️⃣  Tiny “desktop‑required” page – shown after redirect
// ---------------------------------------------------------------
app.get('/desktop-required', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en"><head><meta charset="UTF-8"><title>Desktop Required</title></head>
    <body style="font-family:sans-serif; text-align:center; padding:2rem;">
      <h2>Desktop Version Required</h2>
      <p>This part of the application works best on a desktop or laptop with a screen width of at least 1024 px.</p>
      <p><a href="/">Home</a> | <a href="/About">About</a></p>
    </body></html>
  `);
});

// ---------------------------------------------------------------
// 10️⃣  Error handling (unchanged)
// ---------------------------------------------------------------
app.use((err, req, res, next) => {
  console.error(`[${getFormattedTimestamp()}] Error:`, err);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[${getFormattedTimestamp()}] Server running on port ${PORT}`);
});

module.exports = app;
