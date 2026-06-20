const habitService = require('../services/habitService');

class HabitController {
  async getHabits(req, res) {
    const habits = await habitService.getAllHabits();
    res.status(200).json({ success: true, habits });
  }
  async createHabit(req, res) {
    const { title } = req.body;
    if (!title) return res.status(400).json({ success: false, error: 'Title required' });
    try {
      const newHabit = await habitService.createHabit(title);
      res.status(201).json({ success: true, habit: newHabit });
    } catch (e) {
      res.status(500).json({ success: false });
    }
  }
}
module.exports = new HabitController();