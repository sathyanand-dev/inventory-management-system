const AppError = require('../utils/AppError');

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.code = err.code || 'INTERNAL_ERROR';

  // Log error only in development
  if (process.env.NODE_ENV !== 'production') {
    console.error('ERROR:', {
      message: err.message,
      code: err.code,
      statusCode: err.statusCode,
      stack: err.stack
    });
  }

  // Send error response
  res.status(err.statusCode).json({
    success: false,
    error: {
      code: err.code,
      message: err.message
    }
  });
};

// Async error wrapper to catch async errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { errorHandler, asyncHandler };
