const Category = require('../models/Category');
const Tag = require('../models/Tag');
const { catchAsync } = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { getRedisClient } = require('../config/redis');
const config = require('../config/config');
const logger = require('../utils/logger');

/**
 * Get all categories
 */
exports.getAllCategories = catchAsync(async (req, res, next) => {
  const { isActive } = req.query;
  const cacheKey = `categories:all:${isActive || 'all'}`;
  const redis = getRedisClient();

  // Try cache
  if (redis) {
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        logger.debug('Cache hit for getAllCategories');
        return res.status(200).json(JSON.parse(cached));
      }
    } catch (error) {
      logger.warn('Redis get error:', error);
    }
  }

  const query = {};
  if (isActive !== undefined) {
    query.isActive = isActive === 'true';
  }

  const categories = await Category.find(query).sort({ order: 1, name: 1 });

  const response = {
    status: 'success',
    results: categories.length,
    data: {
      categories
    }
  };

  // Cache
  if (redis) {
    try {
      await redis.setex(cacheKey, config.cache.categoriesTTL, JSON.stringify(response));
    } catch (error) {
      logger.warn('Redis set error:', error);
    }
  }

  res.status(200).json(response);
});

/**
 * Get a single category by slug
 */
exports.getCategory = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const cacheKey = `category:${slug}`;
  const redis = getRedisClient();

  // Try cache
  if (redis) {
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return res.status(200).json(JSON.parse(cached));
      }
    } catch (error) {
      logger.warn('Redis get error:', error);
    }
  }

  const category = await Category.findOne({ slug, isActive: true });

  if (!category) {
    return next(new AppError('Category not found', 404));
  }

  // Get tag count for this category
  const tagCount = await Tag.countDocuments({
    category: category.slug,
    isActive: true,
    isPublic: true
  });

  const response = {
    status: 'success',
    data: {
      category: {
        ...category.toObject(),
        tagCount
      }
    }
  };

  // Cache
  if (redis) {
    try {
      await redis.setex(cacheKey, config.cache.categoriesTTL, JSON.stringify(response));
    } catch (error) {
      logger.warn('Redis set error:', error);
    }
  }

  res.status(200).json(response);
});

/**
 * Create a new category
 */
exports.createCategory = catchAsync(async (req, res, next) => {
  const category = await Category.create(req.body);

  // Invalidate cache
  await invalidateCategoryCache();

  res.status(201).json({
    status: 'success',
    data: {
      category
    }
  });
});

/**
 * Update a category by slug
 */
exports.updateCategory = catchAsync(async (req, res, next) => {
  const { slug } = req.params;

  const category = await Category.findOneAndUpdate(
    { slug },
    req.body,
    {
      new: true,
      runValidators: true
    }
  );

  if (!category) {
    return next(new AppError('Category not found', 404));
  }

  // Invalidate cache
  await invalidateCategoryCache(slug);

  res.status(200).json({
    status: 'success',
    data: {
      category
    }
  });
});

/**
 * Delete a category by slug
 */
exports.deleteCategory = catchAsync(async (req, res, next) => {
  const { slug } = req.params;

  const category = await Category.findOneAndUpdate(
    { slug },
    { isActive: false },
    { new: true }
  );

  if (!category) {
    return next(new AppError('Category not found', 404));
  }

  // Invalidate cache
  await invalidateCategoryCache(slug);

  res.status(204).json({
    status: 'success',
    data: null
  });
});

/**
 * Get subcategories of a category
 */
exports.getSubcategories = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const cacheKey = `category:${slug}:subcategories`;
  const redis = getRedisClient();

  // Try cache
  if (redis) {
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return res.status(200).json(JSON.parse(cached));
      }
    } catch (error) {
      logger.warn('Redis get error:', error);
    }
  }

  const category = await Category.findOne({ slug, isActive: true });

  if (!category) {
    return next(new AppError('Category not found', 404));
  }

  const response = {
    status: 'success',
    results: category.activeSubcategories.length,
    data: {
      subcategories: category.activeSubcategories
    }
  };

  // Cache
  if (redis) {
    try {
      await redis.setex(cacheKey, config.cache.categoriesTTL, JSON.stringify(response));
    } catch (error) {
      logger.warn('Redis set error:', error);
    }
  }

  res.status(200).json(response);
});

/**
 * Helper function to invalidate category cache
 */
async function invalidateCategoryCache(slug = null) {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    const pattern = slug ? `*category*${slug}*` : '*categor*';
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
      logger.debug(`Invalidated ${keys.length} cache keys`);
    }
  } catch (error) {
    logger.warn('Cache invalidation error:', error);
  }
}
