const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      default: '',
    },
    platform: {
      type: String,
      trim: true,
      default: '',
    },
    serviceId: {
      type: String,
      trim: true,
      default: '',
    },
    cidServiceId: {
      type: String,
      trim: true,
      default: '',
    },
    serviceName: {
      type: String,
      trim: true,
      default: '',
    },
    serviceType: {
      type: String,
      trim: true,
      default: '',
    },
    averageTime: {
      type: String,
      trim: true,
      default: '',
    },
    link: {
      type: String,
      trim: true,
      default: '',
    },
    quantity: {
      type: Number,
      min: 0,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    customerPrice: {
      type: Number,
      min: 0,
      default: 0,
    },
    priceInr: {
      type: Number,
      min: 0,
      default: 0,
    },
    priceLkr: {
      type: Number,
      min: 0,
      default: 0,
    },
    totalLkr: {
      type: Number,
      min: 0,
      default: 0,
    },
    resellerCost: {
      type: Number,
      min: 0,
      default: 0,
    },
    profit: {
      type: Number,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['Unpaid', 'Paid', 'Failed', 'Refunded'],
      default: 'Unpaid',
    },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Processing', 'Inprogress', 'In Progress', 'Completed', 'Partial', 'Cancelled', 'Canceled', 'Failed'],
      default: 'Pending',
    },
    resellerOrderId: {
      type: String,
      trim: true,
      default: '',
    },
    cidOrderId: {
      type: String,
      trim: true,
      default: '',
    },
    startCount: {
      type: Number,
      default: 0,
    },
    remains: {
      type: Number,
      default: 0,
    },
    charge: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      trim: true,
      default: 'USD',
    },
    couponCode: {
      type: String,
      trim: true,
      default: '',
    },
    termsAccepted: {
      type: Boolean,
      default: false,
    },
    paidViaWallet: {
      type: Boolean,
      default: false,
    },
    walletAmountDeducted: {
      type: Number,
      min: 0,
      default: 0,
    },
    walletRefunded: {
      type: Boolean,
      default: false,
    },
    refillId: {
      type: String,
      trim: true,
      default: '',
    },
    refillStatus: {
      type: String,
      trim: true,
      default: '',
    },
    apiError: {
      type: String,
      trim: true,
      default: '',
    },
    refillAvailability: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
