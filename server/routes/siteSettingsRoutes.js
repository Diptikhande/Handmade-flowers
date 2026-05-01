const express = require('express');
const router = express.Router();
const { getPublicSettings, updateSettings } = require('../controllers/siteSettingsController');
const { requireAdmin } = require('../middleware/auth');

router.get('/', getPublicSettings);
router.put('/', requireAdmin, updateSettings);

module.exports = router;
