const { body, validationResult } = require('express-validator');
const AppError = require('../utils/appError');

const validCategories = [
  'geography-timing',
  'people-roles',
  'domain-category',
  'skills-tools',
  'content-format',
  'intent-objectives',
  'constraints-compliance',
  'status-meta'
];

const validTypes = ['standard', 'custom', 'system'];

exports.validateTag = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Tag name is required')
    .isLength({ max: 100 })
    .withMessage('Tag name cannot exceed 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(validCategories)
    .withMessage('Invalid category'),
  
  body('subcategory')
    .trim()
    .notEmpty()
    .withMessage('Subcategory is required'),
  
  body('type')
    .optional()
    .isIn(validTypes)
    .withMessage('Invalid type'),
  
  body('metadata.color')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Invalid color format. Use hex color code (e.g., #3B82F6)'),
  
  body('metadata.priority')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Priority must be between 0 and 100'),
  
  body('metadata.weight')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Weight must be a positive number'),
  
  body('aliases')
    .optional()
    .isArray()
    .withMessage('Aliases must be an array'),
  
  body('aliases.*')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Each alias cannot exceed 100 characters'),
  
  body('searchKeywords')
    .optional()
    .isArray()
    .withMessage('Search keywords must be an array'),
  
  body('searchKeywords.*')
    .optional()
    .trim()
    .toLowerCase(),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean'),
  
  body('isFeatured')
    .optional()
    .isBoolean()
    .withMessage('isFeatured must be a boolean'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(err => err.msg);
      return next(new AppError(errorMessages.join(', '), 400));
    }
    next();
  }
];

exports.validateBulkTags = [
  body('tags')
    .isArray({ min: 1 })
    .withMessage('Tags must be a non-empty array'),
  
  body('tags.*.name')
    .trim()
    .notEmpty()
    .withMessage('Each tag must have a name')
    .isLength({ max: 100 })
    .withMessage('Tag name cannot exceed 100 characters'),
  
  body('tags.*.category')
    .notEmpty()
    .withMessage('Each tag must have a category')
    .isIn(validCategories)
    .withMessage('Invalid category'),
  
  body('tags.*.subcategory')
    .trim()
    .notEmpty()
    .withMessage('Each tag must have a subcategory'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(err => err.msg);
      return next(new AppError(errorMessages.join(', '), 400));
    }
    next();
  }
];
