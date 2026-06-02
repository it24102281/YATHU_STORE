import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes - Featured must come before /:id
router.get('/featured', async (req, res) => {
  try {
    const Product = (await import('../models/Product.js')).default;
    const products = await Product.find({ isActive: true }).limit(6).sort({ rating: -1 });
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Admin routes
router.post('/', authenticateToken, authorizeAdmin, createProduct);
router.put('/:id', authenticateToken, authorizeAdmin, updateProduct);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteProduct);

export default router;
