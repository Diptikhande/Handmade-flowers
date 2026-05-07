const express = require('express');
const router = express.Router();
const { createContact, getAllContacts, getContactById, updateContact, deleteContact } = require('../controllers/contactController');
const { requireAdmin } = require('../middleware/auth');

// Public route
router.post('/', createContact);

// Admin routes
router.get('/', requireAdmin, getAllContacts);
router.get('/:id', requireAdmin, getContactById);
router.put('/:id', requireAdmin, updateContact);
router.delete('/:id', requireAdmin, deleteContact);

module.exports = router;
