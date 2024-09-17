const admin = require("firebase-admin");

/**
 * Sends a multicast notification to multiple FCM tokens.
 *
 * This function constructs a notification message with a title and body, and sends it
 * to the specified array of FCM tokens. It also includes an optional link to redirect users
 * via a web push notification.
 *
 * @param {Array} tokens - An array of FCM tokens to which the notification will be sent.
 * @param {String} title - The title of the notification.
 * @param {String} body - The body/content of the notification.
 *
 * @returns {Object} response - The response from the Firebase Admin SDK indicating the result of the multicast notification.
 *
 * @throws {Error} If the notification sending fails, an error is thrown with the corresponding message.
 */
exports.sendMulticastNotification = async (tokens, title, body) => {
  // Construct the notification message
  const message = {
    notification: {
      title,
      body,
    },
    webpush: {
      fcmOptions: {
        link: "https://app.ekoworking.com",
      },
    },
    tokens,
  };

  try {
    // Send the multicast notification to the specified tokens
    const response = await admin.messaging().sendEachForMulticast(message);
    return response;
  } catch (error) {
    // If an error occurs, throw it with the error message
    throw new Error(error.message);
  }
};

/**
 * Retrieves the FCM tokens for the specified users.
 *
 * This function queries the database to retrieve FCM tokens for a list of user IDs.
 * It returns an object that contains the FCM tokens for each user found in the database.
 *
 * @param {string} databaseRef - The FCM database reference.
 *
 * @returns {Promise<Object>} - A promise that resolves to an object containing the FCM tokens for the users.
 * The returned object has user IDs as keys and their FCM token data as values.
 *
 * @throws {Error} - Throws an error if the database query fails.
 */
exports.getUsersTokens = async (databaseRef) => {
  try {
    // Retrieve all users from the [TABLE] reference in the database
    const response = await admin.database().ref(databaseRef).once("value");
    return response.val();
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * Unsubscribes a specific FCM token from all topics.
 *
 * This function removes the provided FCM token from any topics it may be subscribed to
 * using Firebase Admin's `unsubscribeFromTopic` method.
 *
 * @param {Array} tokens - The FCM token to be unsubscribed.
 *
 * @returns {Promise<Object>} - A promise that resolves to the response from Firebase Admin SDK
 * indicating the result of the unsubscription.
 *
 * @throws {Error} - Throws an error if the unsubscription process fails.
 */
exports.removeToken = async (tokens) => {
  try {
    const response = await admin
      .messaging()
      .unsubscribeFromTopic(tokens, "sports");
    
    console.log("Unsubscribe response:", response);

    // Log each error with details
    if (response.errors && response.errors.length > 0) {
      response.errors.forEach((errorDetail) => {
        console.error(
          `Error unsubscribing token at index ${errorDetail.index}:`,
          errorDetail.error.message
        );
      });
    }
    return response;
  } catch (error) {
    console.error("Error removing tokens:", error.message);
    throw new Error(error.message);
  }
};
