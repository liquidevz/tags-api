const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  // Log request
  logger.info(`${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });

  next();
};

module.exports = requestLogger;
