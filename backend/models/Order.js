import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'cancelled', 'processing'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['credit-card', 'debit-card', 'paypal', 'crypto', 'bank-transfer'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    deliveryAddress: {
      address: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    notes: String,
    adminNotes: String,
    completedAt: Date,
    cancelledAt: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Generate unique order number before saving
orderSchema.pre('save', async function (next) {
  if (!this.isNew) return next();

  try {
    const count = await mongoose.model('Order').countDocuments();
    const orderNumber = `ORD-${Date.now()}-${count + 1}`;
    this.orderNumber = orderNumber;
    next();
  } catch (error) {
    next(error);
  }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
