const dotenv = require('dotenv');
dotenv.config();

const projectId = process.env.FIREBASE_PROJECT_ID || 'my-life-os-b0878'; 

// Базовый URL для REST API Firestore
const FIREBASE_BASE_URL = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;

module.exports = {
  FIREBASE_BASE_URL
};