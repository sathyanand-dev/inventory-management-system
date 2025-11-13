const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const AppError = require('../utils/AppError');

exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Not authorized to access this route', 401, 'UNAUTHORIZED'));
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');

      // Get user from token
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        return next(new AppError('User not found', 404, 'USER_NOT_FOUND'));
      }

      next();
    } catch (error) {
      return next(new AppError('Not authorized to access this route', 401, 'UNAUTHORIZED'));
    }
  } catch (error) {
    next(error);
  }
};
