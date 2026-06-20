const express = require('express');
const habitController = require('../controllers/habitController');
const router = express.Router();
router.get('/', habitController.getHabits);
router.post('/', habitController.createHabit);
module.exports = router;