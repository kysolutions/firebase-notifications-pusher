const admin = require('firebase-admin');
const https = require('https');

exports.initializeFirebase = () => {
  const serviceAccount = require('../../config/firebase-key.json');
  admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: 'https://ework-d5585-default-rtdb.firebaseio.com/',

  });
};

// exports.initializeFirebase = (url) => {

//   https.get(url, (res) => {
//     let data = '';

//     res.on('data', (chunk) => {
//       data += chunk;
//     });

//     res.on('end', () => {
//       try {
//         const serviceAccount = JSON.parse(data);
//         admin.initializeApp({
//           credential: admin.credential.cert(serviceAccount),
//           databaseURL: 'https://ework-d5585-default-rtdb.firebaseio.com/',
//         });

//         console.log('Firebase initialized successfully');
//       } catch (error) {
//         console.error('Error parsing or initializing Firebase:', error.message);
//       }
//     });
//   }).on('error', (error) => {
//     console.error('Error fetching the JSON file:', error.message);
//   });
// };
