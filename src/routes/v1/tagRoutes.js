const express = require('express');
const tagController = require('../../controllers/tagController');
const { validateTag, validateBulkTags } = require('../../validators/tagValidator');
const { authenticate, authorize } = require('../../middlewares/auth');
const cache = require('../../middlewares/cache');

const router = express.Router();

/**
 * @route   GET /api/v1/tags
 * @desc    Get all tags with filtering, sorting, and pagination
 * @access  Public
 */
router.get(
  '/',
  cache(300), // 5 minutes cache
  tagController.getAllTags
);

/**
 * @route   GET /api/v1/tags/popular
 * @desc    Get popular tags
 * @access  Public
 */
router.get(
  '/popular',
  cache(600), // 10 minutes cache
  tagController.getPopularTags
);

/**
 * @route   GET /api/v1/tags/search
 * @desc    Search tags with autocomplete
 * @access  Public
 */
router.get(
  '/search',
  cache(300), // 5 minutes cache
  tagController.searchTags
);

/**
 * @route   GET /api/v1/tags/category/:category
 * @desc    Get tags by category
 * @access  Public
 */
router.get(
  '/category/:category',
  cache(600), // 10 minutes cache
  tagController.getTagsByCategory
);

/**
 * @route   GET /api/v1/tags/:slug
 * @desc    Get a single tag by slug
 * @access  Public
 */
router.get(
  '/:slug',
  cache(600), // 10 minutes cache
  tagController.getTag
);

/**
 * @route   POST /api/v1/tags
 * @desc    Create a new tag
 * @access  Private (Admin)
 */
router.post(
  '/',
  authenticate,
  authorize('admin', 'superadmin'),
  validateTag,
  tagController.createTag
);

/**
 * @route   POST /api/v1/tags/bulk
 * @desc    Bulk create tags
 * @access  Private (Admin)
 */
router.post(
  '/bulk',
  authenticate,
  authorize('admin', 'superadmin'),
  validateBulkTags,
  tagController.bulkCreateTags
);

/**
 * @route   PATCH /api/v1/tags/:slug
 * @desc    Update a tag by slug
 * @access  Private (Admin)
 */
router.patch(
  '/:slug',
  authenticate,
  authorize('admin', 'superadmin'),
  validateTag,
  tagController.updateTag
);

/**
 * @route   DELETE /api/v1/tags/:slug
 * @desc    Delete a tag by slug (soft delete)
 * @access  Private (Admin)
 */
router.delete(
  '/:slug',
  authenticate,
  authorize('admin', 'superadmin'),
  tagController.deleteTag
);

module.exports = router;
