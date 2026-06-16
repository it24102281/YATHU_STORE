const mongoose = require('mongoose');

const refillSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    refillId: {
      type: String,
      required: true,
      unique: true,
    },
    cidOrderId: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    serviceName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'Pending',
    },
    apiError: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

refillSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Refill', refillSchema);
