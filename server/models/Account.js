const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  accountId: {
    type: String,
    required: [true, 'Account ID is required'],
    trim: true,
    maxlength: [200, 'Account ID cannot exceed 200 characters']
  },
  price: {
    type: String,
    required: [true, 'Price is required'],
    trim: true,
    maxlength: [100, 'Price cannot exceed 100 characters']
  },
  level: {
    type: Number,
    default: 1,
    min: [1, 'Level must be at least 1'],
    max: [100, 'Level cannot exceed 100']
  },
  skins: {
    type: [String],
    default: []
  },
  gunSkins: {
    type: [String],
    default: []
  },
  features: {
    type: [String],
    default: []
  },
  loginMethods: {
    type: [String],
    enum: ['Facebook', 'Google', 'Twitter', 'Guest', 'Any'],
    default: []
  },
  description: {
    type: String,
    default: '',
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  // Video support
  videoType: {
    type: String,
    enum: ['youtube', 'gdrive', 'none'],
    default: 'none'
  },
  videoUrl: {
    type: String,
    default: ''
  },
  thumbnailUrl: {
    type: String,
    default: ''
  },
  // Legacy image support
  images: {
    type: [String],
    default: []
  },
  status: {
    type: String,
    required: true,
    enum: ['available', 'sold'],
    default: 'available'
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
accountSchema.index({ accountId: 'text', description: 'text' });
accountSchema.index({ status: 1 });
accountSchema.index({ featured: 1 });
accountSchema.index({ price: 1 });
accountSchema.index({ category: 1 });

module.exports = mongoose.model('Account', accountSchema);
