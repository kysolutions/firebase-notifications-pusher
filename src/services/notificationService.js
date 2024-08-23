const admin = require('firebase-admin');

/**
 * Sends a multicast notification to multiple users.
 * 
 * @param {string[]} usersIDs 
 * @param {string} title 
 * @param {string} body 
 * @returns {Promise<Object>} 
 * @throws {Error} 
 */
exports.sendMulticastNotification = async (tokens, title, body) => {
    
  const message = {
    notification: {
      title,
      body,
    },
    webpush: {
      fcmOptions: {
        link: '/?breakingnews'
      }
    },
    tokens
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * 
 * @param {string[]} usersIDs 
 * @returns {Promise<Object>} 
 * @throws {Error} 
 */
exports.getUsersTokens = async (usersIDs) => {
  try {
    const response = await admin.database().ref('users').once('value');
    return response.val();
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * 
 * @param {string} token 
 * @returns {Promise<Object>} 
 * @throws {Error} 
 */
exports.removeToken = async (token) => {
  try {
    const response = await admin.messaging().unsubscribeFromTopic(token, 'breakingnews');
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};