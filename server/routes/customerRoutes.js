const express = require('express');
const router = express.Router();
const { login, getProfile } = require('../controllers/customerController');
const { requireCustomer } = require('../middleware/auth');

router.post('/login', login);
router.get('/profile', requireCustomer, getProfile);

module.exports = router;
