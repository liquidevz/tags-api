const app = require('./app');
const config = require('./config/config');
const logger = require('./utils/logger');
const connectDB = require('./config/database');
const { connectRedis } = require('./config/redis');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...', err);
  process.exit(1);
});

// Connect to database
connectDB();

// Connect to Redis
connectRedis();

// Start server
const server = app.listen(config.port, () => {
  logger.info(`🚀 Server running on port ${config.port} in ${config.env} mode`);
  logger.info(`📚 API Documentation available at http://localhost:${config.port}/api/v1/docs`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...', err);
  server.close(() => {
    process.exit(1);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    logger.info('💥 Process terminated!');
  });
});

module.exports = server;
