const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const Admin = require('./models/Admin');
const { ensureFeaturedDealsSeedData } = require('./utils/seedFeaturedDeals');
require('dotenv').config();

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://yathupubgstore.vercel.app',
  process.env.CLIENT_URL,
  ...(process.env.CLIENT_URLS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
].filter(Boolean);

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

const isDevelopment = process.env.NODE_ENV !== 'production';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDevelopment ? 1000 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please wait a moment and try again.',
  },
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));

app.use('/api/accounts', require('./routes/accounts'));
app.use('/api/uc-packages', require('./routes/ucPackages'));
app.use('/api/featured-deals', require('./routes/featuredDeals'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/admin', require('./routes/adminUsers'));
app.use('/api/auth/user', require('./routes/authUser'));
app.use('/api/user', require('./routes/user'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/social-booster', require('./routes/socialBooster'));
app.use('/api/social', require('./routes/socialBooster'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'YATHU PUBG STORE API is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

const PORT = process.env.PORT || 5001;

const ensureDefaultAdmin = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    return;
  }

  const normalizedEmail = email.toLowerCase();
  const existingAdmin = await Admin.findOne({ email: normalizedEmail });

  if (existingAdmin) {
    return;
  }

  const admin = new Admin({
    name: 'Admin',
    email: normalizedEmail,
    password,
    role: 'admin',
    isActive: true,
  });

  await admin.save();
  console.log(`Default admin created for ${normalizedEmail}`);
};

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/yathu-pubg-store')
  .then(async () => {
    await ensureDefaultAdmin();
    await ensureFeaturedDealsSeedData();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log('YATHU PUBG STORE API is ready!');
    });
  })
  .catch((error) => {
    console.error('Database connection error:', error);
    process.exit(1);
  });

module.exports = app;
