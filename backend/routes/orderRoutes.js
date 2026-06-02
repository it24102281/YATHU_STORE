import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} from '../controllers/orderController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes for users
router.post('/', authenticateToken, createOrder);

// Named route BEFORE parameter route
router.get('/my-orders', authenticateToken, getUserOrders);
router.put('/:id/cancel', authenticateToken, cancelOrder);

// Specific ID route
router.get('/:id', authenticateToken, getOrderById);

// Admin routes
router.get('/', authenticateToken, authorizeAdmin, getAllOrders);
router.put('/:id/status', authenticateToken, authorizeAdmin, updateOrderStatus);

export default router;
