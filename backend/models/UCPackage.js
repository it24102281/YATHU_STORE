import mongoose from 'mongoose';

const ucPackageSchema = new mongoose.Schema({
  category:    { type: String, enum: ['regular', 'bonus'], default: 'regular' },
  ucAmounts:   { type: [mongoose.Schema.Types.Mixed], default: [] },
  ucAmount:    { type: Number, default: null },
  price:       { type: String, required: true },
  bonus:       { type: String, default: '' },
  badge:       { type: String, enum: ['none', 'popular', 'best-deal'], default: 'none' },
  status:      { type: String, enum: ['available', 'unavailable'], default: 'available' },
  topupMethod: { type: String, enum: ['login', 'tag', ''], default: '' },
  qrLogin:     { type: String, default: '' },
  description: { type: String, default: '' },
  image:       { type: String, default: '' },
}, { timestamps: true });

ucPackageSchema.pre('validate', function syncAmounts(next) {
  if (Array.isArray(this.ucAmounts) && this.ucAmounts.length > 0) {
    const firstAmount = this.ucAmounts[0];
    const numericAmount = typeof firstAmount === 'number' ? firstAmount : Number(firstAmount);
    this.ucAmount = Number.isFinite(numericAmount) && numericAmount > 0 ? numericAmount : null;
  } else if (this.ucAmount) {
    this.ucAmounts = [this.ucAmount];
  }

  if (typeof this.description === 'string') {
    this.description = this.description.trim();
  }

  next();
});

export default mongoose.model('UCPackage', ucPackageSchema);
