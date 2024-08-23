const express = require('express');
const NotificationRequest = require('../../requests/NotificationRequest');
const notificationService = require('../services/notificationService');

const router = express.Router();

router.post(
  '/send',
  NotificationRequest.validateMulticast(),
  NotificationRequest.validateResult,
  async (req, res) => {
    const { usersIDs, title, body } = req.body;

    try {
      const response = await notificationService.sendMulticastNotification(usersIDs, title, body);
      const successCount = response.successCount;
      const failureCount = response.failureCount;
      res.status(200).json({
        success: true,
        message: `Notifications sent successfully: ${successCount} succeeded, ${failureCount} failed`,
        response: response
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'ERROR',
        error: error.message
      });
    }
  }
);

router.get(
  '/users',
  NotificationRequest.validateUsers(),
  NotificationRequest.validateResult,
  async (req, res) => {
    const { usersIDs, title, body } = req.body;
  try {
    const response = await notificationService.getUsersTokens(usersIDs);

    const tokens = [];
    usersIDs.forEach(userID => {
      const user = response[userID];
      if (user && user.fcmTokens) {
        Object.values(user.fcmTokens).forEach(token => {
          tokens.push(token);
        });
      }
    });

    if (tokens.length > 0) {
     await notificationService.sendMulticastNotification(tokens, title, body);
    }
    
    res.status(200).json({
      success: true,
      message: 'Tokens retrieved successfully',
      response: tokens
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ERROR',
      error: error.message
    });
  }
});

module.exports = router;
