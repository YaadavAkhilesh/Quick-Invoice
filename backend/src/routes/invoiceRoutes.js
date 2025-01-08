const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const authenticate = require('../middlewares/authenticate');

router.use(authenticate);
// Here Vendor Manage all the Invoices like Invoice Creation, Update, Sending Invoice, etc.
router.post('/', invoiceController.create);
router.get('/', invoiceController.getAll);
router.get('/:id', invoiceController.getById);
router.put('/:id', invoiceController.update);
router.delete('/:id', invoiceController.delete);
router.post('/:id/send', invoiceController.sendInvoice);

module.exports = router;