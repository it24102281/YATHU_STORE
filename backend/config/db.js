import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in .env file');
    }

    console.log('🔄 Connecting to MongoDB...');
    console.log(`📍 Database URL: ${mongoURI}`);

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB Connected Successfully!');
    console.log(`📊 Database Name: ${mongoose.connection.db.name}`);
    return mongoose.connection;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:');
    console.error(`   Error: ${error.message}`);
    console.error(`   Connection String: ${process.env.MONGODB_URI}`);
    console.error('');
    console.error('Troubleshooting Tips:');
    console.error('1. Make sure MongoDB is running locally or on your server');
    console.error('2. Check MONGODB_URI in .env file is correct');
    console.error('3. Verify MongoDB connection string format');
    console.error('4. For local MongoDB: mongodb://localhost:27017/yathu-pubg');
    console.error('');
    
    // Exit process only in production
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
    
    // In development, log and continue (you can still test other endpoints)
    console.warn('⚠️ Continuing in development mode without database...\n');
    return null;
  }
};

export default connectDB;
