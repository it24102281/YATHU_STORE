const express = require('express');
const Order = require('../models/Order');
const { adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', adminMiddleware, async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'fullName email whatsappNumber')
    .sort({ createdAt: -1 });

  return res.json({
    success: true,
    orders,
  });
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
