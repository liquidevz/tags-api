const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { catchAsync } = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const config = require('../config/config');

/**
 * Authenticate user via JWT or API key
 */
exports.authenticate = catchAsync(async (req, res, next) => {
  let token;
  let apiKey;

  // Check for JWT token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check for API key
  if (req.headers[config.apiKey.headerName.toLowerCase()]) {
    apiKey = req.headers[config.apiKey.headerName.toLowerCase()];
  }

  // If neither token nor API key is provided
  if (!token && !apiKey) {
    return next(new AppError('Authentication required. Please provide a valid token or API key.', 401));
  }

  // Authenticate with API key
  if (apiKey) {
    const user = await User.findByApiKey(apiKey);
    
    if (!user) {
      return next(new AppError('Invalid or expired API key', 401));
    }

    const keyData = user.validateApiKey(apiKey);
    
    if (!keyData) {
      return next(new AppError('Invalid or expired API key', 401));
    }

    // Update usage statistics
    const keyIndex = user.apiKeys.findIndex(k => k.key === apiKey);
    if (keyIndex !== -1) {
      user.apiKeys[keyIndex].usage.totalRequests += 1;
      user.apiKeys[keyIndex].usage.lastUsed = new Date();
      await user.save();
    }

    req.user = user;
    req.apiKey = keyData;
    return next();
  }

  // Authenticate with JWT
  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    
    const user = await User.findById(decoded.id);
    
    if (!user || !user.isActive) {
      return next(new AppError('User no longer exists or is inactive', 401));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new AppError('Invalid or expired token', 401));
  }
});

/**
 * Authorize user based on roles
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }

    next();
  };
};

/**
 * Optional authentication - doesn't fail if no token provided
 */
exports.optionalAuth = catchAsync(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    const user = await User.findById(decoded.id);
    
    if (user && user.isActive) {
      req.user = user;
    }
  } catch (error) {
    // Silently fail - authentication is optional
  }

  next();
});
