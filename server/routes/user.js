const express = require('express');
const validator = require('validator');
const User = require('../models/User');
const Order = require('../models/Order');
const { userMiddleware } = require('../middleware/auth');
const { getResellerOrderStatus } = require('../services/resellerClient');

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
  walletBalance: Number(user.walletBalance || 0),
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const firstPresent = (...values) => {
  const value = values.find((item) => item !== undefined && item !== null && item !== '');
  return value === undefined ? '' : value;
};

const toDisplayValue = (value, fallback = '-') => {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  return String(value);
};

const toFiniteNumber = (value) => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
};

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
  const syncedOrders = await Promise.all(
    orders.map(async (order) => {
      if (!order.cidOrderId) {
        return { order, resellerStatus: null };
      }

      try {
        const resellerStatus = await getResellerOrderStatus(order.cidOrderId);
        const resellerStatusText = resellerStatus.status || order.orderStatus;
        const nextCharge = toFiniteNumber(resellerStatus.charge);
        const nextStartCount = toFiniteNumber(firstPresent(resellerStatus.start_count, resellerStatus.startCount));
        const nextRemains = toFiniteNumber(resellerStatus.remains);

        order.orderStatus = resellerStatusText;
        if (nextCharge !== null) order.charge = nextCharge;
        if (nextStartCount !== null) order.startCount = nextStartCount;
        if (nextRemains !== null) order.remains = nextRemains;
        order.apiError = '';
        await order.save();

        return { order, resellerStatus };
      } catch (error) {
        order.apiError = error.message || order.apiError;
      }

      return { order, resellerStatus: null };
    })
  );

  return res.json({
    success: true,
    data: syncedOrders.map(({ order, resellerStatus }) => {
      const cidQuantity = firstPresent(resellerStatus?.quantity, resellerStatus?.qty, resellerStatus?.amount);
      const cidStartCount = firstPresent(resellerStatus?.start_count, resellerStatus?.startCount);
      const cidRemains = firstPresent(resellerStatus?.remains);
      const displayQuantity = toDisplayValue(cidQuantity, String(order.quantity || 0));
      const displayRemains = toDisplayValue(cidRemains, order.cidOrderId ? '-' : String(order.remains || 0));
      const displayStart = toDisplayValue(cidStartCount, order.startCount ? String(order.startCount) : '-');
      const numericStart = toFiniteNumber(displayStart);
      const numericQuantity = toFiniteNumber(displayQuantity);
      const numericRemains = toFiniteNumber(displayRemains);
      const displayEnd =
        numericStart !== null && numericQuantity !== null && numericRemains !== null
          ? String(numericStart + numericQuantity - numericRemains)
          : toDisplayValue(firstPresent(resellerStatus?.end, resellerStatus?.end_count, resellerStatus?.endCount), '-');

      return {
      id: order._id,
      orderId: order.cidOrderId || String(order._id).slice(-8).toUpperCase(),
      localOrderId: String(order._id).slice(-8).toUpperCase(),
      productName: order.productName,
      serviceName: order.serviceName,
      cidServiceId: order.cidServiceId,
      category: order.category,
      platform: order.platform,
      quantity: order.quantity,
      cidQuantity: displayQuantity,
      cidRemains: displayRemains,
      cidStartCount: displayStart,
      cidEndCount: displayEnd,
      link: order.link,
      price: order.price,
      customerPrice: order.customerPrice,
      priceLkr: order.priceLkr,
      totalLkr: order.totalLkr,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      cidOrderId: order.cidOrderId,
      charge: order.charge,
      startCount: order.startCount,
      remains: order.remains,
      createdAt: order.createdAt,
      };
    }),
  });
});

module.exports = router;
