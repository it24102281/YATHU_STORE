const express = require('express');
const validator = require('validator');
const User = require('../models/User');
const Order = require('../models/Order');
const { userMiddleware } = require('../middleware/auth');

const router = express.Router();

const whatsappRegex = /^[0-9+\-\s()]{8,20}$/;
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const getSafeUser = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  whatsappNumber: user.whatsappNumber,
  role: user.role,
  status: user.isBlocked ? 'Blocked' : 'Active',
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

router.get('/profile', userMiddleware, async (req, res) => {
  return res.json({
    success: true,
    data: getSafeUser(req.user),
  });
});

router.put('/profile', userMiddleware, async (req, res) => {
  try {
    const { fullName, whatsappNumber } = req.body;

    if (!fullName?.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter your full name' });
    }

    if (!whatsappRegex.test(whatsappNumber || '')) {
      return res.status(400).json({ success: false, message: 'Please enter your WhatsApp number' });
    }

    const existingWhatsapp = await User.findOne({
      whatsappNumber: whatsappNumber.trim(),
      _id: { $ne: req.user._id },
    });

    if (existingWhatsapp) {
      return res.status(400).json({ success: false, message: 'WhatsApp number already exists' });
    }

    req.user.fullName = fullName.trim();
    req.user.whatsappNumber = whatsappNumber.trim();
    await req.user.save();

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      data: getSafeUser(req.user),
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message,
    });
  }
});

router.put('/change-password', userMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const freshUser = await User.findById(req.user._id).select('+password');

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all password fields',
      });
    }

    const isValidCurrentPassword = await freshUser.comparePassword(currentPassword);

    if (!isValidCurrentPassword) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    if (!strongPasswordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters and include uppercase, lowercase, and a number',
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password and confirm password do not match',
      });
    }

    freshUser.password = newPassword;
    await freshUser.save();

    return res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Failed to change password',
      error: error.message,
    });
  }
});

router.get('/orders', userMiddleware, async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

  return res.json({
    success: true,
    data: orders.map((order) => ({
      id: order._id,
      orderId: String(order._id).slice(-8).toUpperCase(),
      productName: order.productName,
      category: order.category,
      price: order.price,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      createdAt: order.createdAt,
    })),
  });
});

module.exports = router;
