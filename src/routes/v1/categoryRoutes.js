const express = require('express');
const categoryController = require('../../controllers/categoryController');
const { validateCategory } = require('../../validators/categoryValidator');
const { authenticate, authorize } = require('../../middlewares/auth');
const cache = require('../../middlewares/cache');

const router = express.Router();

/**
 * @route   GET /api/v1/categories
 * @desc    Get all categories
 * @access  Public
 */
router.get(
  '/',
  cache(3600), // 1 hour cache
  categoryController.getAllCategories
);

/**
 * @route   GET /api/v1/categories/:slug
 * @desc    Get a single category by slug
 * @access  Public
 */
router.get(
  '/:slug',
  cache(3600), // 1 hour cache
  categoryController.getCategory
);

/**
 * @route   GET /api/v1/categories/:slug/subcategories
 * @desc    Get subcategories of a category
 * @access  Public
 */
router.get(
  '/:slug/subcategories',
  cache(3600), // 1 hour cache
  categoryController.getSubcategories
);

/**
 * @route   POST /api/v1/categories
 * @desc    Create a new category
 * @access  Private (Admin)
 */
router.post(
  '/',
  authenticate,
  authorize('admin', 'superadmin'),
  validateCategory,
  categoryController.createCategory
);

/**
 * @route   PATCH /api/v1/categories/:slug
 * @desc    Update a category by slug
 * @access  Private (Admin)
 */
router.patch(
  '/:slug',
  authenticate,
  authorize('admin', 'superadmin'),
  validateCategory,
  categoryController.updateCategory
);

/**
 * @route   DELETE /api/v1/categories/:slug
 * @desc    Delete a category by slug (soft delete)
 * @access  Private (Admin)
 */
router.delete(
  '/:slug',
  authenticate,
  authorize('admin', 'superadmin'),
  categoryController.deleteCategory
);

module.exports = router;
