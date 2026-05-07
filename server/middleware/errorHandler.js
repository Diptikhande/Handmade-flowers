// Global Error Handler Middleware
const errorHandler = (err, req, res, next) => {
  console.error(`✗ Error:`, err);

  // Multer errors (file uploads)
  if (err && err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'Image is too large. Max size is 5MB.' });
    }
    return res.status(400).json({ message: err.message || 'File upload error' });
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((error) => error.message);
    return res.status(400).json({
      message: 'Validation Error',
      errors: messages,
    });
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      message: `${field} already exists`,
    });
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired' });
  }

  // File Upload Error
  if (err.message && (err.message.includes('Only image') || err.message.includes('Only JPG'))) {
    return res.status(400).json({ message: err.message });
  }

  // Default Error
  res.status(err.statusCode || 500).json({
    message: err.message || 'Server Error',
  });
};

module.exports = errorHandler;
