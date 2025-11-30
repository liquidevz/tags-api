const Redis = require('ioredis');
const config = require('./config');
const logger = require('../utils/logger');

let redisClient = null;

const connectRedis = () => {
  try {
    redisClient = new Redis(config.redis);

    redisClient.on('connect', () => {
      logger.info('✅ Redis connected successfully');
    });

    redisClient.on('ready', () => {
      logger.info('✅ Redis is ready to accept commands');
    });

    redisClient.on('error', (err) => {
      logger.error('Redis connection error:', err);
    });

    redisClient.on('close', () => {
      logger.warn('Redis connection closed');
    });

    redisClient.on('reconnecting', () => {
      logger.info('Redis reconnecting...');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await redisClient.quit();
      logger.info('Redis connection closed through app termination');
    });

    return redisClient;
  } catch (error) {
    logger.error('Error connecting to Redis:', error);
    // Don't exit process - API can work without Redis (just slower)
    return null;
  }
};

const getRedisClient = () => {
  if (!redisClient) {
    logger.warn('Redis client not initialized, creating new connection');
    return connectRedis();
  }
  return redisClient;
};

module.exports = {
  connectRedis,
  getRedisClient
};
