const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error('? MongoDB connection failed: MONGODB_URI is not set');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority',
    });
    console.log('? MongoDB connected');
  } catch (err) {
    console.error('? MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
