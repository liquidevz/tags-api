require('dotenv').config();

const config = {
  // Environment
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,

  // Database
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/tags-api',
    options: {
      maxPoolSize: 100,
      minPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    }
  },

  // Redis
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD || '',
    db: parseInt(process.env.REDIS_DB, 10) || 0,
    keyPrefix: 'tags-api:',
    enableReadyCheck: true,
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    }
  },

  // Cache TTL (in seconds)
  cache: {
    defaultTTL: parseInt(process.env.CACHE_TTL, 10) || 3600, // 1 hour
    tagsTTL: parseInt(process.env.TAGS_CACHE_TTL, 10) || 1800, // 30 minutes
    categoriesTTL: parseInt(process.env.CATEGORIES_CACHE_TTL, 10) || 3600, // 1 hour
    searchTTL: parseInt(process.env.SEARCH_CACHE_TTL, 10) || 600 // 10 minutes
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d'
  },

  // Rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 1000, // limit each IP to 1000 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false
  },

  // Pagination
  pagination: {
    defaultLimit: parseInt(process.env.DEFAULT_PAGE_LIMIT, 10) || 20,
    maxLimit: parseInt(process.env.MAX_PAGE_LIMIT, 10) || 100
  },

  // CORS
  corsOrigin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log',
    errorFile: process.env.LOG_ERROR_FILE || 'logs/error.log'
  },

  // API Keys (for monetization)
  apiKey: {
    headerName: 'X-API-Key',
    enabled: process.env.API_KEY_ENABLED === 'true' || false
  },

  // Feature flags
  features: {
    enableSwagger: process.env.ENABLE_SWAGGER !== 'false',
    enableMetrics: process.env.ENABLE_METRICS === 'true',
    enableAnalytics: process.env.ENABLE_ANALYTICS === 'true'
  }
};

module.exports = config;
