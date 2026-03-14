import { body, query, validationResult } from 'express-validator';

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

const taskValidation = [
  body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters')
    .escape(),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description max 1000 chars')
    .escape(),
  body('status').optional().isIn(['todo', 'in-progress', 'completed', 'cancelled'])
    .withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('dueDate').optional({ nullable: true }).isISO8601().withMessage('Invalid date format'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  handleValidationErrors,
];

const taskQueryValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be 1-50'),
  query('status').optional().isIn(['todo', 'in-progress', 'completed', 'cancelled', 'all'])
    .withMessage('Invalid status filter'),
  query('priority').optional().isIn(['low', 'medium', 'high', 'all']).withMessage('Invalid priority filter'),
  query('search').optional().trim().isLength({ max: 100 }).escape(),
  handleValidationErrors,
];

export { taskValidation, taskQueryValidation, handleValidationErrors };
