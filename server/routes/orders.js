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
  const update = {};

  if (orderStatus) {
    update.orderStatus = orderStatus;
  }

  if (paymentStatus) {
    update.paymentStatus = paymentStatus;
  }

  const order = await Order.findByIdAndUpdate(req.params.id, update, {
    new: true,
    runValidators: true,
  }).populate('user', 'fullName email whatsappNumber');

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found',
    });
  }

  return res.json({
    success: true,
    message: 'Order updated successfully',
    order,
  });
});

module.exports = router;
