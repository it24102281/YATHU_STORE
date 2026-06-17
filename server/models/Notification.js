const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      alias: 'userId'
    },
    type: {
      type: String,
      enum: [
        'order_created',
        'order_processing',
        'order_completed',
        'order_cancelled',
        'refill_submitted',
        'refill_approved',
        'refill_completed',
        'refill_cancelled',
        'wallet_recharge_submitted',
        'wallet_recharge_approved',
        'wallet_recharge_completed',
        'wallet_credited',
        'wallet_deducted',
        'login_alert',
        'password_changed',
        'email_updated',
        'announcement',
        'new_service',
        'maintenance_notice',
        'account_delivered',
        'general'
      ],
      default: 'general',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    refillId: {
      type: String
    },
    amount: {
      type: Number
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
