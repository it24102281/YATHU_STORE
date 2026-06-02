const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/accounts', require('./routes/accounts'));
app.use('/api/uc-packages', require('./routes/ucPackages'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/contact', require('./routes/contact'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'YATHU PUBG STORE API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

const PORT = process.env.PORT || 5001;

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/yathu-pubg-store', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🎮 YATHU PUBG STORE API is ready!`);
  });
})
.catch((error) => {
  console.error('❌ Database connection error:', error);
  process.exit(1);
});

module.exports = app;
