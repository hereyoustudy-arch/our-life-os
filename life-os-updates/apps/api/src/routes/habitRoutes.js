const express = require('express');
const habitController = require('../controllers/habitController');
const router = express.Router();

router.get('/', habitController.getHabits);
router.post('/', habitController.createHabit);
router.patch('/:id', habitController.setCompletion);
router.delete('/:id', habitController.deleteHabit);

module.exports = router;
