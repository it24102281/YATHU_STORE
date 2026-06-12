const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const Admin = require('./models/Admin');
const { ensureFeaturedDealsSeedData } = require('./utils/seedFeaturedDeals');
const { hasSmtpConfig, verifySmtpTransporter } = require('./utils/sendEmail');
require('dotenv').config();

const app = express();
app.set('trust proxy', 1);

console.log('[Server Boot] dotenv loaded', {
  hasMongoUri: Boolean(process.env.MONGODB_URI),
  hasJwtSecret: Boolean(process.env.JWT_SECRET),
  jwtExpire: process.env.JWT_EXPIRE || '30d',
  hasAdminEmail: Boolean(process.env.ADMIN_EMAIL),
  hasAdminPassword: Boolean(process.env.ADMIN_PASSWORD),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
});

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

const isAllowedOrigin = (origin) => {
  if (!origin) {
    return true;
  }

  if (allowedOrigins.includes(origin)) {
    return true;
  }

  try {
    const { hostname, protocol } = new URL(origin);
    return protocol === 'https:' && hostname.endsWith('.vercel.app');
  } catch (error) {
    return false;
  }
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (isAllowedOrigin(origin)) {
    if (origin) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Vary', 'Origin');
    }

    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }

  next();
});

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

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

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'YATHU OFFICIAL Backend Running 🚀',
    timestamp: new Date().toISOString(),
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
  const email = process.env.ADMIN_EMAIL || 'yathupubg@gmail.com';
  const password = process.env.ADMIN_PASSWORD || 'Apple@1234';

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

const verifySmtpOnStartup = async () => {
  if (!hasSmtpConfig()) {
    console.warn('[SMTP] Configuration missing. Email features are disabled until SMTP env variables are set.');
    return;
  }

  try {
    console.log('[SMTP] Verifying transport', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE || (Number(process.env.SMTP_PORT) === 465 ? 'true' : 'false'),
      family: 4,
      user: process.env.SMTP_USER,
      from: process.env.EMAIL_FROM,
    });
    const verifiedConfig = await verifySmtpTransporter();
    console.log('[SMTP] Transport verified successfully.', {
      host: verifiedConfig.host,
      port: verifiedConfig.port,
      secure: verifiedConfig.secure,
      family: verifiedConfig.family,
    });
  } catch (error) {
    console.error('[SMTP] Transport verification failed:', error.message);
  }
};

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/yathu-pubg-store')
  .then(async () => {
    await ensureDefaultAdmin();
    await ensureFeaturedDealsSeedData();
    await verifySmtpOnStartup();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log('YATHU PUBG STORE API is ready!');
      console.log('[Server Boot] Admin auth env ready', {
        adminEmail: process.env.ADMIN_EMAIL ? process.env.ADMIN_EMAIL.toLowerCase() : null,
        hasAdminPassword: Boolean(process.env.ADMIN_PASSWORD),
        jwtExpire: process.env.JWT_EXPIRE || '30d',
      });
    });
  })
  .catch((error) => {
    console.error('Database connection error:', error);
    process.exit(1);
  });

module.exports = app;
