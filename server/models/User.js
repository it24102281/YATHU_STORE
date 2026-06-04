const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const whatsappRegex = /^[0-9+\-\s()]{8,20}$/;

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [80, 'Full name cannot exceed 80 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value) => validator.isEmail(value || ''),
        message: 'Please enter a valid email address',
      },
    },
    whatsappNumber: {
      type: String,
      required: [true, 'WhatsApp number is required'],
      unique: true,
      trim: true,
      validate: {
        validator: (value) => whatsappRegex.test(value || ''),
        message: 'Please enter your WhatsApp number',
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    signupVerificationCode: {
      type: String,
      select: false,
    },
    signupVerificationExpire: {
      type: Date,
      select: false,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpire: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 });
userSchema.index({ whatsappNumber: 1 });

userSchema.pre('save', async function savePassword(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.createPasswordResetToken = function createPasswordResetToken() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpire = new Date(Date.now() + 1000 * 60 * 30);

  return resetToken;
};

userSchema.methods.createSignupVerificationCode = function createSignupVerificationCode() {
  const code = `${Math.floor(100000 + Math.random() * 900000)}`;

  this.signupVerificationCode = crypto.createHash('sha256').update(code).digest('hex');
  this.signupVerificationExpire = new Date(Date.now() + 1000 * 60 * 10);

  return code;
};

userSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: this._id,
    fullName: this.fullName,
    email: this.email,
    whatsappNumber: this.whatsappNumber,
    role: this.role,
    isEmailVerified: this.isEmailVerified,
    isBlocked: this.isBlocked,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model('User', userSchema);
