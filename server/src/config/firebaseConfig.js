const admin = require("firebase-admin");
const dotenv = require("dotenv");

dotenv.config(); // Load biến môi trường từ .env

const firebaseConfig = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
    databaseURL: process.env.FIREBASE_DATABASE_URL, // Quan trọng!
  });
}

const database = admin.database(); // Dùng Firebase Admin SDK cho backend

module.exports = { database };
