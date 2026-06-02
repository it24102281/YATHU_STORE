import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  getAllUsers,
  getUserById,
  toggleUserStatus,
  deleteUser,
} from '../controllers/userController.js';
import { authenticateToken, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes for users
router.get('/profile', authenticateToken, getUserProfile);
router.put('/profile', authenticateToken, updateUserProfile);
router.put('/change-password', authenticateToken, changePassword);

// Admin routes
router.get('/', authenticateToken, authorizeAdmin, getAllUsers);
router.get('/:id', authenticateToken, authorizeAdmin, getUserById);
router.put('/:id/toggle-status', authenticateToken, authorizeAdmin, toggleUserStatus);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteUser);

export default router;
