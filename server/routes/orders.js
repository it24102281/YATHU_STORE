const express = require('express');
const Order = require('../models/Order');
const { adminMiddleware } = require('../middleware/auth');
const { getResellerOrderStatus } = require('../services/resellerClient');

const router = express.Router();

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

const getFormattedOrder = (order) => {
  const hasCid = Boolean(order.cidOrderId);
  const displayQuantity = String(order.quantity || 0);
  const displayRemains = order.remains !== undefined && order.remains !== null ? String(order.remains) : (hasCid ? '-' : '0');
  const displayStart = order.startCount !== undefined && order.startCount !== null ? String(order.startCount) : (hasCid ? '-' : '0');
  
  const numericStart = toFiniteNumber(displayStart);
  const numericQuantity = toFiniteNumber(displayQuantity);
  const numericRemains = toFiniteNumber(displayRemains);
  
  const displayEnd = 
    numericStart !== null && numericQuantity !== null && numericRemains !== null
      ? String(numericStart + numericQuantity - numericRemains)
      : '-';

  return {
    ...order.toObject(),
    id: order._id,
    cidQuantity: displayQuantity,
    cidRemains: displayRemains,
    cidStartCount: displayStart,
    cidEndCount: displayEnd,
  };
};

router.get('/', adminMiddleware, async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'fullName email whatsappNumber')
    .sort({ createdAt: -1 });

  const formattedOrders = orders.map(getFormattedOrder);

  return res.json({
    success: true,
    orders: formattedOrders,
  });
});

router.get('/:id/sync', adminMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'fullName email whatsappNumber');
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (order.cidOrderId) {
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
      } catch (error) {
        order.apiError = error.message || order.apiError;
        await order.save();
      }
    }

    return res.json({
      success: true,
      order: getFormattedOrder(order),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to sync order status',
    });
  }
});


router.put('/:id/status', adminMiddleware, async (req, res) => {
  const { orderStatus, paymentStatus } = req.body;
  const order = await Order.findById(req.params.id).populate('user');

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found',
    });
  }

  if (orderStatus) {
    order.orderStatus = orderStatus;
  }

  if (paymentStatus) {
    const nextPaymentStatus = paymentStatus;
    const isWalletOrder = Boolean(order.paidViaWallet);
    const walletAmount = Number(order.walletAmountDeducted || order.price || 0);

    if (isWalletOrder && nextPaymentStatus === 'Refunded' && !order.walletRefunded) {
      order.user.walletBalance = Number((Number(order.user.walletBalance || 0) + walletAmount).toFixed(2));
      order.walletRefunded = true;
      await order.user.save();
    }

    if (isWalletOrder && nextPaymentStatus === 'Paid' && order.walletRefunded) {
      if (Number(order.user.walletBalance || 0) < walletAmount) {
        return res.status(400).json({
          success: false,
          message: 'Customer wallet does not have enough amount to mark this order as paid again.',
        });
      }

      order.user.walletBalance = Number((Number(order.user.walletBalance || 0) - walletAmount).toFixed(2));
      order.walletRefunded = false;
      await order.user.save();
    }

    order.paymentStatus = nextPaymentStatus;
  }

  await order.save();

  return res.json({
    success: true,
    message: 'Order updated successfully',
    order,
  });
});

module.exports = router;
