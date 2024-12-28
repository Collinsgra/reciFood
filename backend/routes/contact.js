const express = require('express');
const { submitContactForm } = require('../controllers/contact');

const router = express.Router();

router.post('/', submitContactForm);

module.exports = router;