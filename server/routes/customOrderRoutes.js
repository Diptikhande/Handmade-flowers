// Custom Order Routes
const express = require('express');
const router = express.Router();
const {
  createCustomOrder,
  getAllCustomOrders,
  getCustomOrderById,
  updateCustomOrder,
  deleteCustomOrder,
} = require('../controllers/customOrderController');
const { requireAdmin } = require('../middleware/auth');

// Public Routes
router.post('/', createCustomOrder);

// Protected Routes (Admin Only)
router.get('/', requireAdmin, getAllCustomOrders);
router.get('/:id', requireAdmin, getCustomOrderById);
router.patch('/:id', requireAdmin, updateCustomOrder);
router.delete('/:id', requireAdmin, deleteCustomOrder);

module.exports = router;
