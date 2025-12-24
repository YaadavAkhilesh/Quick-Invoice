const express = require('express');
const router = express.Router();
const connectUsController = require('../controllers/connectUsController');

router.post('/connect-us', connectUsController.submitFeedback);

module.exports = router;