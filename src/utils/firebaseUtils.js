const https = require("https");
const fs = require("fs");
const admin = require("firebase-admin");

/**
 * Initialize Firebase using a service account key from either a remote URL or a local file.
 *
 * @param {string} firebaseKeyUrl - URL to the service account JSON or local file path.
 * @param {string} databaseURL - URL to the Firebase Realtime Database.
 *
 * @returns {Promise<void>} - Resolves when Firebase is successfully initialized, rejects on error.
 */
exports.initializeFirebase = async (firebaseKeyUrl, databaseURL) => {
  try {
    if (firebaseKeyUrl.startsWith("https://")) {
      // If it's a URL, fetch the JSON data via HTTPS
      await initializeFromUrl(firebaseKeyUrl, databaseURL);
    } else {
      // Otherwise, assume it's a local file path
      await initializeFromFile(firebaseKeyUrl, databaseURL);
    }
    console.log("Firebase initialization completed.");
  } catch (error) {
    console.error("Error during Firebase initialization:", error.message);
    throw error; // Throw the error so it can be caught in the Express route
  }
};

/**
 * Initialize Firebase from a remote URL.
 *
 * @param {string} firebaseKeyUrl - The remote URL to fetch the Firebase key.
 * @param {string} databaseURL - The Firebase database URL.
 */
function initializeFromUrl(firebaseKeyUrl, databaseURL) {
  return new Promise((resolve, reject) => {
    https
      .get(firebaseKeyUrl, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            if (!data) {
              return reject(new Error("No data received from the URL"));
            }

            const serviceAccount = JSON.parse(data);

            if (!admin.apps.length) {
              admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                databaseURL: databaseURL,
              });
              console.log("Firebase initialized successfully from URL.");
            }

            resolve();
          } catch (error) {
            reject(
              new Error(
                `Error initializing Firebase from URL: ${error.message}`
              )
            );
          }
        });
      })
      .on("error", (error) => {
        reject(
          new Error(`Error fetching the JSON file from URL: ${error.message}`)
        );
      });
  });
}

/**
 * Initialize Firebase from a local file.
 *
 * @param {string} firebaseKeyPath - The local file path to the Firebase key.
 * @param {string} databaseURL - The Firebase database URL.
 */
function initializeFromFile(firebaseKeyPath, databaseURL) {
  return new Promise((resolve, reject) => {
    fs.access(firebaseKeyPath, fs.constants.F_OK, (err) => {
      if (err) {
        return reject(new Error("Local Firebase key file not found."));
      }

      try {
        const serviceAccount = require(firebaseKeyPath);

        if (!admin.apps.length) {
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: databaseURL,
          });
          console.log("Firebase initialized successfully from local file.");
        }

        resolve();
      } catch (error) {
        reject(
          new Error(`Error loading local Firebase key file: ${error.message}`)
        );
      }
    });
  });
}
