import express from 'express';
import { register, login, adminLogin, verifyToken } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/admin-login', adminLogin);

// Protected routes
router.get('/verify', authenticateToken, verifyToken);

// Temporary: Promote user to admin (dev only)
router.put('/promote-admin', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email required' });
    }
    const user = await User.findOneAndUpdate(
      { email },
      { role: 'admin' },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, message: 'User promoted to admin', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
