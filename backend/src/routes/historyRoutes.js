const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');
const authenticate = require('../middlewares/authenticate');

router.use(authenticate);

// Create history entry
router.post('/', historyController.createEntry);

// Get all history entries
router.get('/', historyController.getAll);

// Search history
router.get('/search', historyController.search);

// Get history for specific invoice
router.get('/invoice/:invoice_id', historyController.getInvoiceHistory);

// Get history statistics
router.get('/stats', historyController.getStats);

module.exports = router;