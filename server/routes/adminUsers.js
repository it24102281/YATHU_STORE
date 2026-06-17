const express = require('express');
const validator = require('validator');
const User = require('../models/User');
const Order = require('../models/Order');
const { adminMiddleware } = require('../middleware/auth');
const { sendNotificationToUser } = require('../services/notificationService');

const router = express.Router();

const formatUser = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  whatsappNumber: user.whatsappNumber,
  role: user.role,
  status: user.isBlocked ? 'Blocked' : 'Active',
  walletBalance: Number(user.walletBalance || 0),
  walletHistory: Array.isArray(user.walletHistory)
    ? user.walletHistory
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map((entry) => ({
          id: entry._id,
          amount: Number(entry.amount || 0),
          type: entry.type,
          paymentMethod: entry.paymentMethod,
          details: entry.details,
          addedBy: entry.addedBy,
          createdAt: entry.createdAt,
        }))
    : [],
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

router.get('/users', adminMiddleware, async (req, res) => {
  const { search = '' } = req.query;
  const query = {};

  if (search.trim()) {
    query.$or = [
      { fullName: { $regex: search.trim(), $options: 'i' } },
      { email: { $regex: search.trim(), $options: 'i' } },
      { whatsappNumber: { $regex: search.trim(), $options: 'i' } },
    ];
  }

  const users = await User.find(query).sort({ createdAt: -1 });

  return res.json({
    success: true,
    data: users.map(formatUser),
  });
});

router.get('/users/:id', adminMiddleware, async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  return res.json({
    success: true,
    data: formatUser(user),
  });
});

router.put('/users/:id', adminMiddleware, async (req, res) => {
  try {
    const { fullName, email, whatsappNumber, role, isBlocked } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!fullName?.trim()) {
      return res.status(400).json({ success: false, message: 'Please enter your full name' });
    }

    if (!validator.isEmail(email || '')) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
    }

    const emailExists = await User.findOne({
      email: email.toLowerCase().trim(),
      _id: { $ne: user._id },
    });

    if (emailExists) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const whatsappExists = await User.findOne({
      whatsappNumber: whatsappNumber?.trim(),
      _id: { $ne: user._id },
    });

    if (whatsappExists) {
      return res.status(400).json({ success: false, message: 'WhatsApp number already exists' });
    }

    user.fullName = fullName.trim();
    user.email = email.toLowerCase().trim();
    user.whatsappNumber = whatsappNumber.trim();
    user.role = ['customer', 'admin'].includes(role) ? role : 'customer';
    user.isBlocked = Boolean(isBlocked);
    await user.save();

    return res.json({
      success: true,
      message: 'User updated successfully',
      data: formatUser(user),
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Failed to update user',
      error: error.message,
    });
  }
});

router.delete('/users/:id', adminMiddleware, async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  await Order.deleteMany({ user: user._id });

  return res.json({
    success: true,
    message: 'User deleted successfully',
  });
});

router.put('/users/:id/block', adminMiddleware, async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: true }, { new: true });

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  return res.json({
    success: true,
    message: 'User blocked successfully',
    data: formatUser(user),
  });
});

router.put('/users/:id/unblock', adminMiddleware, async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: false }, { new: true });

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  return res.json({
    success: true,
    message: 'User unblocked successfully',
    data: formatUser(user),
  });
});

router.get('/users/:id/orders', adminMiddleware, async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  const orders = await Order.find({ user: user._id }).sort({ createdAt: -1 });

  return res.json({
    success: true,
    data: orders,
  });
});

router.put('/users/:id/wallet', adminMiddleware, async (req, res) => {
  try {
    const { amount, paymentMethod, details } = req.body;
    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid wallet amount',
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.walletBalance = Number((Number(user.walletBalance || 0) + numericAmount).toFixed(2));
    user.walletHistory.push({
      amount: numericAmount,
      type: 'credit',
      paymentMethod: paymentMethod?.trim() || 'Manual Wallet Credit',
      details: details?.trim() || 'Fund added to wallet',
      addedBy: req.user?._id || null,
      createdAt: new Date(),
    });
    await user.save();

    sendNotificationToUser(
      user._id,
      'wallet_credited',
      'Wallet Balance Added',
      `Rs. ${numericAmount.toLocaleString()} LKR has been added to your wallet. New Balance: Rs. ${user.walletBalance.toLocaleString()} LKR.`
    );

    return res.json({
      success: true,
      message: 'Wallet funded successfully',
      data: formatUser(user),
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Failed to fund wallet',
      error: error.message,
    });
  }
});

module.exports = router;
