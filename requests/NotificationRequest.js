const { body, validationResult } = require('express-validator');

class NotificationRequest {
  static validate() {
    return [
      body('token').notEmpty().withMessage('Token is required'),
      body('title').notEmpty().withMessage('Title is required'),
      body('body').notEmpty().withMessage('Body is required')
    ];
  }
    
  static validateMulticast() {
    return [
      body('tokens').isArray({ min: 1 }).withMessage('usersIDs is required'),
      body('title').notEmpty().withMessage('Title is required'),
      body('body').notEmpty().withMessage('Body is required')
    ];
  }

  static validateUsers() {
    return [
      body('usersIDs').isArray({ min: 1 }).withMessage('usersIDs is required'),
      body('title').notEmpty().withMessage('Title is required'),
      body('body').notEmpty().withMessage('Body is required')
    ];
  }

  static validateResult(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
}

module.exports = NotificationRequest;
