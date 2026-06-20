const dotenv = require('dotenv');
dotenv.config();

// Единая точка конфигурации для всех сервисов.
// Используем Realtime Database (REST API через .json) — она уже настроена и проверена в проекте.
const FIREBASE_BASE_URL = process.env.FIREBASE_DATABASE_URL || 'https://my-life-os-b0878.firebaseio.com';

module.exports = {
  FIREBASE_BASE_URL
};
