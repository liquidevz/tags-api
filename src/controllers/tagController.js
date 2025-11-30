const Tag = require('../models/Tag');
const { catchAsync } = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { getRedisClient } = require('../config/redis');
const config = require('../config/config');
const logger = require('../utils/logger');

/**
 * Get all tags with advanced filtering, sorting, and pagination
 */
exports.getAllTags = catchAsync(async (req, res, next) => {
  const {
    page = 1,
    limit = config.pagination.defaultLimit,
    sort = '-usageCount',
    fields,
    search,
    category,
    subcategory,
    type,
    isActive,
    isPublic,
    isFeatured,
    minUsage,
    maxUsage
  } = req.query;

  // Build cache key
  const cacheKey = `tags:all:${JSON.stringify(req.query)}`;
  const redis = getRedisClient();

  // Try to get from cache
  if (redis) {
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        logger.debug('Cache hit for getAllTags');
        return res.status(200).json(JSON.parse(cached));
      }
    } catch (error) {
      logger.warn('Redis get error:', error);
    }
  }

  // Build query
  const query = {};

  // Text search
  if (search) {
    query.$text = { $search: search };
  }

  // Filters
  if (category) query.category = category;
  if (subcategory) query.subcategory = subcategory;
  if (type) query.type = type;
  if (isActive !== undefined) query.isActive = isActive === 'true';
  if (isPublic !== undefined) query.isPublic = isPublic === 'true';
  if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';

  // Usage count range
  if (minUsage || maxUsage) {
    query.usageCount = {};
    if (minUsage) query.usageCount.$gte = parseInt(minUsage);
    if (maxUsage) query.usageCount.$lte = parseInt(maxUsage);
  }

  // Default filters
  if (isActive === undefined) query.isActive = true;
  if (isPublic === undefined) query.isPublic = true;

  // Pagination
  const pageNum = parseInt(page, 10);
  const limitNum = Math.min(parseInt(limit, 10), config.pagination.maxLimit);
  const skip = (pageNum - 1) * limitNum;

  // Execute query
  let queryBuilder = Tag.find(query);

  // Sorting
  if (sort) {
    const sortBy = sort.split(',').join(' ');
    queryBuilder = queryBuilder.sort(sortBy);
  }

  // Field limiting
  if (fields) {
    const fieldList = fields.split(',').join(' ');
    queryBuilder = queryBuilder.select(fieldList);
  }

  // Pagination
  queryBuilder = queryBuilder.skip(skip).limit(limitNum);

  // Execute
  const [tags, total] = await Promise.all([
    queryBuilder.exec(),
    Tag.countDocuments(query)
  ]);

  // Response
  const response = {
    status: 'success',
    results: tags.length,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum)
    },
    data: {
      tags
    }
  };

  // Cache the response
  if (redis) {
    try {
      await redis.setex(cacheKey, config.cache.tagsTTL, JSON.stringify(response));
    } catch (error) {
      logger.warn('Redis set error:', error);
    }
  }

  res.status(200).json(response);
});

/**
 * Get a single tag by slug
 */
exports.getTag = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const cacheKey = `tag:${slug}`;
  const redis = getRedisClient();

  // Try cache first
  if (redis) {
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        logger.debug(`Cache hit for tag: ${slug}`);
        return res.status(200).json(JSON.parse(cached));
      }
    } catch (error) {
      logger.warn('Redis get error:', error);
    }
  }

  const tag = await Tag.findOne({ slug, isActive: true, isPublic: true })
    .populate('relatedTags', 'name slug category subcategory');

  if (!tag) {
    return next(new AppError('Tag not found', 404));
  }

  const response = {
    status: 'success',
    data: {
      tag
    }
  };

  // Cache the response
  if (redis) {
    try {
      await redis.setex(cacheKey, config.cache.tagsTTL, JSON.stringify(response));
    } catch (error) {
      logger.warn('Redis set error:', error);
    }
  }

  res.status(200).json(response);
});

/**
 * Create a new tag
 */
exports.createTag = catchAsync(async (req, res, next) => {
  const tagData = {
    ...req.body,
    createdBy: req.user?._id
  };

  const tag = await Tag.create(tagData);

  // Invalidate cache
  await invalidateTagCache();

  res.status(201).json({
    status: 'success',
    data: {
      tag
    }
  });
});

/**
 * Update a tag by slug
 */
exports.updateTag = catchAsync(async (req, res, next) => {
  const { slug } = req.params;

  const tag = await Tag.findOneAndUpdate(
    { slug },
    {
      ...req.body,
      updatedBy: req.user?._id
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!tag) {
    return next(new AppError('Tag not found', 404));
  }

  // Invalidate cache
  await invalidateTagCache(slug);

  res.status(200).json({
    status: 'success',
    data: {
      tag
    }
  });
});

/**
 * Delete a tag by slug (soft delete)
 */
exports.deleteTag = catchAsync(async (req, res, next) => {
  const { slug } = req.params;

  const tag = await Tag.findOneAndUpdate(
    { slug },
    { isActive: false },
    { new: true }
  );

  if (!tag) {
    return next(new AppError('Tag not found', 404));
  }

  // Invalidate cache
  await invalidateTagCache(slug);

  res.status(204).json({
    status: 'success',
    data: null
  });
});

/**
 * Get popular tags
 */
exports.getPopularTags = catchAsync(async (req, res, next) => {
  const { limit = 10 } = req.query;
  const cacheKey = `tags:popular:${limit}`;
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

  const tags = await Tag.findPopular(parseInt(limit));

  const response = {
    status: 'success',
    results: tags.length,
    data: {
      tags
    }
  };

  // Cache
  if (redis) {
    try {
      await redis.setex(cacheKey, config.cache.tagsTTL, JSON.stringify(response));
    } catch (error) {
      logger.warn('Redis set error:', error);
    }
  }

  res.status(200).json(response);
});

/**
 * Get tags by category
 */
exports.getTagsByCategory = catchAsync(async (req, res, next) => {
  const { category } = req.params;
  const { limit = 50, sort = '-usageCount' } = req.query;

  const cacheKey = `tags:category:${category}:${limit}:${sort}`;
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

  const tags = await Tag.findByCategory(category, {
    limit: parseInt(limit),
    sort
  });

  const response = {
    status: 'success',
    results: tags.length,
    data: {
      tags
    }
  };

  // Cache
  if (redis) {
    try {
      await redis.setex(cacheKey, config.cache.tagsTTL, JSON.stringify(response));
    } catch (error) {
      logger.warn('Redis set error:', error);
    }
  }

  res.status(200).json(response);
});

/**
 * Bulk create tags
 */
exports.bulkCreateTags = catchAsync(async (req, res, next) => {
  const { tags } = req.body;

  if (!Array.isArray(tags) || tags.length === 0) {
    return next(new AppError('Please provide an array of tags', 400));
  }

  const createdTags = await Tag.insertMany(
    tags.map(tag => ({
      ...tag,
      createdBy: req.user?._id
    }))
  );

  // Invalidate cache
  await invalidateTagCache();

  res.status(201).json({
    status: 'success',
    results: createdTags.length,
    data: {
      tags: createdTags
    }
  });
});

/**
 * Search tags with autocomplete
 */
exports.searchTags = catchAsync(async (req, res, next) => {
  const { q, limit = 10 } = req.query;

  if (!q) {
    return next(new AppError('Please provide a search query', 400));
  }

  const cacheKey = `tags:search:${q}:${limit}`;
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

  const tags = await Tag.find({
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { searchKeywords: { $regex: q, $options: 'i' } },
      { aliases: { $regex: q, $options: 'i' } }
    ],
    isActive: true,
    isPublic: true
  })
    .sort({ usageCount: -1 })
    .limit(parseInt(limit))
    .select('name slug category subcategory usageCount');

  const response = {
    status: 'success',
    results: tags.length,
    data: {
      tags
    }
  };

  // Cache
  if (redis) {
    try {
      await redis.setex(cacheKey, config.cache.searchTTL, JSON.stringify(response));
    } catch (error) {
      logger.warn('Redis set error:', error);
    }
  }

  res.status(200).json(response);
});

/**
 * Helper function to invalidate tag cache
 */
async function invalidateTagCache(slug = null) {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    const pattern = slug ? `*tag*${slug}*` : '*tags*';
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
      logger.debug(`Invalidated ${keys.length} cache keys`);
    }
  } catch (error) {
    logger.warn('Cache invalidation error:', error);
  }
}
