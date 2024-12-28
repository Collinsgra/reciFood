const express = require('express');
const { getUsers } = require('../controllers/users');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, admin, getUsers);

module.exports = router;