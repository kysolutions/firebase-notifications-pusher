const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const getmessaging = require('firebase-admin/messaging');
const NotificationRequest = require('./requests/NotificationRequest');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Firebase Key
const serviceAccount = require('./config/firebase-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


// Send notifications
app.post('/send-notification',
  // NotificationRequest.validate(),
  NotificationRequest.validateMulticast(),
  NotificationRequest.validateResult,
  (req, res) => {
    const { tokens, title, body } = req.body;

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


    ///
    // Create a list containing up to 500 registration tokens.
// These registration tokens come from the client FCM SDKs.

    admin.messaging().sendMulticast(message)
    .then((response) => {
        const successCount = response.successCount;
        const failureCount = response.failureCount;
        res.status(200).json({
          success: true,
          message: `Notifications sent successfully: ${successCount} succeeded, ${failureCount} failed`,
          response: response
        });
      })
      .catch((error) => {
        res.status(500).json({
          success: false,
          message: 'Error sending notifications',
          error: error.message
        });
      });
    ///

    // Envoyer la notification via Firebase Admin SDK
    // admin.messaging().send(message)
    //   .then((response) => {
    //     res.status(200).json({
    //       success: true,
    //       message: 'Notification sent successfully',
    //       response: response
    //     });
    //   })
    //   .catch((error) => {
    //     res.status(500).json({
    //       success: false,
    //       message: 'Error sending notification',
    //       error: error.message
    //     });
    //   });
  }
);

// Route not found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


// fiEy-NK8t70r_UO1iUnYd4:APA91bGNDRLuhHBOuonGQ-lGAKEInwrW0GZi71Ai6vicMorGy1z2ApOLymMnD6Z4KJMhYAw2MqqhgCM0jOIET4P0b9EqnAza0D-_fct_fkHf91YcleVYRFK4N6uo8bUeK03nPuprMi1W
