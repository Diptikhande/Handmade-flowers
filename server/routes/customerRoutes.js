const express = require('express');
const router = express.Router();
const { login, register, loginWithPassword, googleLogin, getProfile, updateProfile, getMyOrders } = require('../controllers/customerController');
const { requireCustomer } = require('../middleware/auth');

router.post('/login', login);
router.post('/register', register);
router.post('/login-password', loginWithPassword);
router.post('/google-login', googleLogin);

router.get('/profile', requireCustomer, getProfile);
router.put('/profile', requireCustomer, updateProfile);
router.get('/orders', requireCustomer, getMyOrders);

module.exports = router;
