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

// ==================== MIDDLEWARE ====================
// CORS Configuration
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ==================== DATABASE CONNECTION ====================
connectDB();

// ==================== BASIC ROUTES ====================
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🟢 Backend server is running',
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
// 404 Not Found
app.use(notFound);

// Global error handler
app.use(errorHandler);

// ==================== SERVER START ====================
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log('🚀 YATHU PUBG BACKEND SERVER');
  console.log('='.repeat(50));
  console.log(`✅ Server running on: http://localhost:${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log('='.repeat(50));
  console.log('\nAvailable API Routes:');
  console.log('  🔐 Auth: /api/auth (register, login, admin-login)');
  console.log('  📦 Products: /api/products (CRUD operations)');
  console.log('  🛒 Orders: /api/orders (create, view, manage)');
  console.log('  👤 Users: /api/users (profile, admin operations)');
  console.log('  💚 Health: /api/health (server status)');
  console.log('='.repeat(50) + '\n');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});

export default app;
