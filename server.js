const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const notificationController = require('./src/controllers/notificationController');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Firebase Initialisation
const { initializeFirebase } = require('./src/utils/firebaseUtils');
initializeFirebase();

// Routes
app.use('/notifications', notificationController);

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
