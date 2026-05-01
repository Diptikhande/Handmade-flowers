const express = require('express');
const router = express.Router();
const { register, login, getProfile, setupFirstAdmin } = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/auth');

router.post('/setup', setupFirstAdmin);
router.post('/login', login);
router.post('/register', register);
router.get('/profile', requireAdmin, getProfile);

module.exports = router;
