const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const notificationController = require('./src/controllers/notificationController');

const app = express();

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

app.use(cors());
app.use(bodyParser.json());

// Firebase Initialisation
// const { initializeFirebase } = require('./src/utils/firebaseUtils');
// initializeFirebase('https://drive.google.com/uc?export=download&id=1G-wBCwLzFInGcip9f_fWjgJkB2o1iMMZ');

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
