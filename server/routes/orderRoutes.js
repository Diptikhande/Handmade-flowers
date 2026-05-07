// Order Routes
const express = require('express');
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrderByTransactionId,
  approveOrder,
  rejectOrder,
  updateOrderStatus,
  getOrderStats,
} = require('../controllers/orderController');
const { upload } = require('../config/cloudinary');
const { requireAdmin } = require('../middleware/auth');

// Public Routes
router.post('/', upload.single('paymentScreenshot'), createOrder);
router.get('/status/:transactionId', getOrderByTransactionId);

// Protected Routes (Admin Only)
router.get('/', requireAdmin, getAllOrders);
router.get('/stats/dashboard', requireAdmin, getOrderStats);
router.get('/:id', requireAdmin, getOrderById);
router.patch('/:id/status', requireAdmin, updateOrderStatus);
router.patch('/:id/approve', requireAdmin, approveOrder);
router.patch('/:id/reject', requireAdmin, rejectOrder);

module.exports = router;
