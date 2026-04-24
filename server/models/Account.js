const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Account title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  rank: {
    type: String,
    required: [true, 'Rank is required'],
    enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Ace', 'Master']
  },
  level: {
    type: Number,
    required: [true, 'Level is required'],
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
  server: {
    type: String,
    required: [true, 'Server is required'],
    enum: ['Asia', 'Europe', 'America', 'Korea', 'Taiwan/Hong Kong/Macau']
  },
  loginMethod: {
    type: String,
    required: [true, 'Login method is required'],
    enum: ['Facebook', 'Google', 'Twitter', 'Guest']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  images: {
    type: [String],
    required: [true, 'At least one image is required'],
    validate: {
      validator: function(images) {
        return images.length > 0;
      },
      message: 'At least one image is required'
    }
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
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for search functionality
accountSchema.index({ title: 'text', description: 'text' });
accountSchema.index({ status: 1 });
accountSchema.index({ featured: 1 });
accountSchema.index({ price: 1 });
accountSchema.index({ rank: 1 });
accountSchema.index({ level: 1 });

// Update the updatedAt field on save
accountSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Account', accountSchema);
