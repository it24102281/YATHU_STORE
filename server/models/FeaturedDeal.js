const mongoose = require('mongoose');

const featuredDealSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['PUBG Services', 'Premium Subscriptions', 'Social Media Boosters'],
    },
    subCategory: {
      type: String,
      default: '',
      trim: true,
      maxlength: [120, 'Sub category cannot exceed 120 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    oldPrice: {
      type: Number,
      default: null,
      min: [0, 'Old price cannot be negative'],
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    image: {
      type: String,
      default: '',
    },
    badge: {
      type: String,
      default: '',
      trim: true,
      maxlength: [40, 'Badge text cannot exceed 40 characters'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    stockStatus: {
      type: String,
      enum: ['in_stock', 'limited_stock', 'out_of_stock'],
      default: 'in_stock',
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

featuredDealSchema.index({ category: 1, isActive: 1, displayOrder: 1 });
featuredDealSchema.index({ displayOrder: 1, createdAt: -1 });

module.exports = mongoose.model('FeaturedDeal', featuredDealSchema);
