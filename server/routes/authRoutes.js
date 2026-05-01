const express = require('express');
const router = express.Router();
const { login, getProfile, setupFirstAdmin } = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/auth');

router.post('/login', login);
router.post('/setup-admin', setupFirstAdmin);
router.get('/profile', requireAdmin, getProfile);

module.exports = router;
