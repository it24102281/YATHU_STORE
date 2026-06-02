import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  accountId:    { type: String, required: true },
  price:        { type: mongoose.Schema.Types.Mixed },
  level:        { type: Number, default: 1 },
  loginMethods: { type: [String], default: [] },
  description:  { type: String, default: '' },
  videoType:    { type: String, default: 'none' },
  videoUrl:     { type: String, default: '' },
  thumbnailUrl: { type: String, default: '' },
  features:     { type: [String], default: [] },
  skins:        { type: [String], default: [] },
  gunSkins:     { type: [String], default: [] },
  status:       { type: String, enum: ['available', 'sold'], default: 'available' },
  featured:     { type: Boolean, default: false },
  views:        { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Account', accountSchema);
