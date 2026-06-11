import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import 'express-async-errors';

// Import routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import ucPackageRoutes from './routes/ucPackageRoutes.js';
import accountRoutes from './routes/accountRoutes.js';

// Import middleware
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

// Import config
import connectDB from './config/db.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const API_VERSION = process.env.npm_package_version || '1.0.0';
const configuredFrontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

// ==================== MIDDLEWARE ====================
// CORS Configuration
const allowedOrigins = configuredFrontendUrl
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

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
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ==================== DATABASE CONNECTION ====================
connectDB();

// ==================== BASIC ROUTES ====================
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'YATHU OFFICIAL API Running',
    version: API_VERSION,
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'YATHU OFFICIAL Backend Running',
    version: API_VERSION,
    timestamp: new Date().toISOString(),
  });
});

// ==================== API ROUTES ====================
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/uc-packages', ucPackageRoutes);
app.use('/api/accounts', accountRoutes);

// ==================== ERROR HANDLING ====================
app.use(notFound);
app.use(errorHandler);

// ==================== SERVER START ====================
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`FRONTEND_URL: ${configuredFrontendUrl}`);
  console.log(`Allowed frontend origins: ${allowedOrigins.join(', ') || 'none configured'}`);
  console.log('Registered API routes: /, /api/health, /api/auth, /api/products, /api/orders, /api/users, /api/uc-packages, /api/accounts');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});

export default app;
