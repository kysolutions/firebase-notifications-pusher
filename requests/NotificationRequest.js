const { body, validationResult } = require("express-validator");

class NotificationRequest {
  static validateUsersForSender() {
    return [
      body("usersIDs").isArray({ min: 1 }).withMessage("usersIDs is required"),
      body("title").notEmpty().withMessage("Title is required"),
      body("body").notEmpty().withMessage("Body is required"),
      body("firebaseKeyUrl")
        .notEmpty()
        .withMessage("firebaseKeyUrl is required"),
      body("databaseURL").notEmpty().withMessage("databaseURL is required"),
      body("databaseRef").notEmpty().withMessage("databaseRef is required"),
    ];
  }

  static validateUsersForRemover() {
    return [
      body("usersIDs").isArray({ min: 1 }).withMessage("usersIDs is required"),
      body("firebaseKeyUrl")
        .notEmpty()
        .withMessage("firebaseKeyUrl is required"),
      body("databaseURL").notEmpty().withMessage("databaseURL is required"),
      body("databaseRef").notEmpty().withMessage("databaseRef is required"),
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
