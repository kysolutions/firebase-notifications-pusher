const express = require("express");
const { initializeFirebase } = require("./../utils/firebaseUtils.js");
const notificationService = require("../services/notificationService");
const NotificationRequest = require("../../requests/NotificationRequest");
const router = express.Router();

/**
 * POST /users
 *
 * This route is responsible for sending notifications to a list of users.
 * It retrieves the Firebase Cloud Messaging (FCM) tokens for the specified user IDs
 * and sends a multicast notification to all valid tokens.
 *
 * @param {Array} usersIDs - An array of user IDs for which FCM tokens will be retrieved.
 * @param {String} title - The title of the notification to be sent.
 * @param {String} body - The body/content of the notification to be sent.
 * @param {String} firebaseKeyUrl - URL or local path to the Firebase service account key.
 * @param {String} databaseURL - URL to the Firebase Realtime Database.
 * @param {String} databaseRef - The reference to the database node where user tokens are stored.
 *
 * @returns {Object} JSON response
 * - success: {Boolean} Indicates if the process was successful.
 * - message: {String} Descriptive message indicating success or error.
 * - response: {Array} (optional) Array of retrieved FCM tokens if successful.
 * - error: {String} (optional) Error message if the process fails.
 */

router.post(
  "/users",
  NotificationRequest.validateUsersForSender(),
  NotificationRequest.validateResult,
  async (req, res) => {
    const { usersIDs, title, body, firebaseKeyUrl, databaseURL, databaseRef } =
      req.body;
    const tokens = [];

    try {
      // Firebase Initialisation
      await initializeFirebase(firebaseKeyUrl, databaseURL); //https://api-v3.ekoworking.com/firebase-key.json

      // Retrieve the FCM tokens for the users with the provided userIDs
      const response = await notificationService.getUsersTokens(databaseRef);

      if (response) {
        // Loop through the userIDs and get their corresponding FCM tokens
        usersIDs.forEach((userID) => {
          const user = response[userID];
          if (user && user.fcmTokens) {
            // Add each FCM token to the tokens array
            Object.values(user.fcmTokens).forEach((token) => {
              tokens.push(token);
            });
          }
        });
      } else {
        res.status(500).json({
          success: false,
          message: "ERROR",
          error: "No users found",
        });
      }
      // If there are tokens, send a multicast notification
      // remove some
      if (tokens.length > 0) {
        await notificationService.sendMulticastNotification(
          tokens,
          title,
          body
        );
      }

      res.status(200).json({
        success: true,
        message: "Notifications sent successfully",
        response: tokens,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "ERROR",
        error: error.message,
      });
    }
  }
);


/**
 * DELETE /users
 *
 * This route is responsible for remove user tokens to a list of users.
 * It retrieves the Firebase Cloud Messaging (FCM) tokens for the specified user IDs
 *
 * @param {Array} usersIDs - An array of user IDs for which FCM tokens will be retrieved.
 * @param {String} firebaseKeyUrl - URL or local path to the Firebase service account key.
 * @param {String} databaseURL - URL to the Firebase Realtime Database.
 * @param {String} databaseRef - The reference to the database node where user tokens are stored.
 *
 * @returns {Object} JSON response
 * - success: {Boolean} Indicates if the process was successful.
 * - message: {String} Descriptive message indicating success or error.
 * - response: {Array} (optional) Array of retrieved FCM tokens if successful.
 * - error: {String} (optional) Error message if the process fails.
 */
router.delete(
  "/users",
  NotificationRequest.validateUsersForRemover(),
  NotificationRequest.validateResult,
  async (req, res) => {
    const { usersIDs, firebaseKeyUrl, databaseURL, databaseRef } = req.body;
    const tokensToRemove = [];

    try {
      await initializeFirebase(firebaseKeyUrl, databaseURL);

      const response = await notificationService.getUsersTokens(databaseRef);

       if (response) {
         // Loop through the userIDs and get their corresponding FCM tokens
         usersIDs.forEach((userID) => {
           const user = response[userID];
           if (user && user.fcmTokens) {
             // Add each FCM token to the tokens array
             Object.values(user.fcmTokens).forEach((token) => {
               tokensToRemove.push(token);
             });
           }
         });
       } else {
         res.status(500).json({
           success: false,
           message: "ERROR",
           error: "No users found",
         });
       }

      await notificationService.removeToken(tokensToRemove);

      res.status(200).json({
        success: true,
        message: "Tokens removed successfully",
        response: tokensToRemove,
      });
      
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "ERROR",
        error: error.message,
      });
    }
  }
);

module.exports = router;
