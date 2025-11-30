const rateLimit = require('express-rate-limit');
const { getRedisClient } = require('../config/redis');
const config = require('../config/config');
const logger = require('../utils/logger');

// Redis store for rate limiting (distributed rate limiting)
class RedisStore {
  constructor(options = {}) {
    this.client = getRedisClient();
    this.prefix = options.prefix || 'rl:';
    this.resetExpiryOnChange = options.resetExpiryOnChange || false;
  }

  async increment(key) {
    if (!this.client) {
      // Fallback to memory if Redis is not available
      return { totalHits: 0, resetTime: null };
    }

    const prefixedKey = this.prefix + key;
    
    try {
      const current = await this.client.incr(prefixedKey);
      
      if (current === 1) {
        await this.client.expire(prefixedKey, config.rateLimit.windowMs / 1000);
      }
      
      const ttl = await this.client.ttl(prefixedKey);
      const resetTime = new Date(Date.now() + ttl * 1000);
      
      return {
        totalHits: current,
        resetTime
      };
    } catch (error) {
      logger.error('Redis rate limit error:', error);
      return { totalHits: 0, resetTime: null };
    }
  }

  async decrement(key) {
    if (!this.client) return;
    
    const prefixedKey = this.prefix + key;
    
    try {
      await this.client.decr(prefixedKey);
    } catch (error) {
      logger.error('Redis rate limit decrement error:', error);
    }
  }

  async resetKey(key) {
    if (!this.client) return;
    
    const prefixedKey = this.prefix + key;
    
    try {
      await this.client.del(prefixedKey);
    } catch (error) {
      logger.error('Redis rate limit reset error:', error);
    }
  }
}

// Create rate limiter with Redis store
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: config.rateLimit.standardHeaders,
  legacyHeaders: config.rateLimit.legacyHeaders,
  skipSuccessfulRequests: config.rateLimit.skipSuccessfulRequests,
  
  // Use Redis store if available
  store: new RedisStore({
    prefix: 'rate-limit:'
  }),
  
  // Custom key generator (use API key if available, otherwise IP)
  keyGenerator: (req) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey) {
      return `apikey:${apiKey}`;
    }
    return req.ip;
  },
  
  // Custom handler for rate limit exceeded
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for ${req.ip}`);
    res.status(429).json({
      status: 'error',
      message: 'Too many requests, please try again later.',
      retryAfter: req.rateLimit.resetTime
    });
  },
  
  // Skip rate limiting for certain conditions
  skip: (req) => {
    // Skip rate limiting for superadmins
    if (req.user && req.user.role === 'superadmin') {
      return true;
    }
    return false;
  }
});

// Stricter rate limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    logger.warn(`Auth rate limit exceeded for ${req.ip}`);
    res.status(429).json({
      status: 'error',
      message: 'Too many authentication attempts, please try again later.',
      retryAfter: req.rateLimit.resetTime
    });
  }
});

module.exports = limiter;
module.exports.authLimiter = authLimiter;
