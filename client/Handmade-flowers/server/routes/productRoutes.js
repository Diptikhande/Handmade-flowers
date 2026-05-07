const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
} = require('../controllers/productController');
const { upload } = require('../config/cloudinary');
const { requireAdmin } = require('../middleware/auth');

router.get('/', getAllProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);

router.post('/', requireAdmin, upload.single('image'), createProduct);
router.put('/:id', requireAdmin, upload.single('image'), updateProduct);
router.delete('/:id', requireAdmin, deleteProduct);

module.exports = router;
