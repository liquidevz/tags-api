const { body, validationResult } = require('express-validator');
const AppError = require('../utils/appError');

exports.validateCategory = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ max: 100 })
    .withMessage('Category name cannot exceed 100 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Category description is required')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  
  body('subcategories')
    .optional()
    .isArray()
    .withMessage('Subcategories must be an array'),
  
  body('subcategories.*.name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Subcategory name is required'),
  
  body('subcategories.*.description')
    .optional()
    .trim(),
  
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a positive integer'),
  
  body('color')
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage('Invalid color format. Use hex color code (e.g., #3B82F6)'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(err => err.msg);
      return next(new AppError(errorMessages.join(', '), 400));
    }
    next();
  }
];
