const { getRedisClient } = require('../config/redis');
const logger = require('../utils/logger');

/**
 * Cache middleware for GET requests
 * @param {number} duration - Cache duration in seconds
 */
const cache = (duration = 300) => {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const redis = getRedisClient();
    
    // If Redis is not available, skip caching
    if (!redis) {
      return next();
    }

    // Generate cache key from URL and query params
    const cacheKey = `cache:${req.originalUrl || req.url}`;

    try {
      // Try to get cached response
      const cachedResponse = await redis.get(cacheKey);

      if (cachedResponse) {
        logger.debug(`Cache hit: ${cacheKey}`);
        const data = JSON.parse(cachedResponse);
        
        // Add cache header
        res.setHeader('X-Cache', 'HIT');
        
        return res.status(200).json(data);
      }

      // Cache miss - continue to controller
      logger.debug(`Cache miss: ${cacheKey}`);
      res.setHeader('X-Cache', 'MISS');

      // Store original res.json function
      const originalJson = res.json.bind(res);

      // Override res.json to cache the response
      res.json = (body) => {
        // Only cache successful responses
        if (res.statusCode === 200) {
          redis.setex(cacheKey, duration, JSON.stringify(body))
            .catch(err => logger.error('Cache set error:', err));
        }

        // Call original json function
        return originalJson(body);
      };

      next();
    } catch (error) {
      logger.error('Cache middleware error:', error);
      next();
    }
  };
};

module.exports = cache;
