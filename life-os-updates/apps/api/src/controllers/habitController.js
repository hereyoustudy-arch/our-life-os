const habitService = require('../services/habitService');
const { getUserId } = require('../utils/getUserId');

class HabitController {
    async getHabits(req, res) {
        const userId = getUserId(req, res);
        if (!userId) return;
        try {
            const habits = await habitService.getAllHabits(userId);
            res.status(200).json({ success: true, habits });
        } catch (e) {
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    }

    async createHabit(req, res) {
        const userId = getUserId(req, res);
        if (!userId) return;
        const { title } = req.body;
        if (!title) return res.status(400).json({ success: false, error: 'Title required' });
        try {
            const newHabit = await habitService.createHabit(userId, title);
            res.status(201).json({ success: true, habit: newHabit });
        } catch (e) {
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    }

    // Отметка выполнения привычки за конкретный день. Тело: { date?: "YYYY-MM-DD", done: boolean }
    async setCompletion(req, res) {
        const userId = getUserId(req, res);
        if (!userId) return;
        const date = req.body.date || new Date().toISOString().slice(0, 10);
        const done = req.body.done !== false;
        try {
            await habitService.setCompletion(userId, req.params.id, date, done);
            res.status(200).json({ success: true });
        } catch (e) {
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    }

    async deleteHabit(req, res) {
        const userId = getUserId(req, res);
        if (!userId) return;
        try {
            await habitService.deleteHabit(userId, req.params.id);
            res.status(200).json({ success: true });
        } catch (e) {
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    }
}

module.exports = new HabitController();
