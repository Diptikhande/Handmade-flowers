const mongoose = require('mongoose');

// Set strictQuery to false before connecting
mongoose.set('strictQuery', false);

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.warn('⚠️  MongoDB URI not set - running in demo mode without database');
    return;
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority',
    });
    console.log('✓ MongoDB connected');
  } catch (err) {
    console.warn('⚠️  MongoDB connection failed:', err.message);
    console.warn('⚠️  Running in demo mode without database');
  }
};

module.exports = connectDB;
