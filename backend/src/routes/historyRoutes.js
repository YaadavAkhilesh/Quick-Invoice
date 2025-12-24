const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');
const authenticate = require('../middlewares/authenticate');

router.use(authenticate);

router.post('/', historyController.createEntry);
router.get('/', historyController.getAll);
router.get('/search', historyController.search);
router.get('/invoice/:invoice_id', historyController.getInvoiceHistory);
router.get('/stats', historyController.getStats);

module.exports = router;