const taskService = require('../services/taskService');
const { getUserId } = require('../utils/getUserId');

class TaskController {
    async getTasks(req, res) {
        const userId = getUserId(req, res);
        if (!userId) return;
        try {
            const tasks = await taskService.getAllTasks(userId);
            res.status(200).json({ success: true, data: tasks });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    }

    async createTask(req, res) {
        const userId = getUserId(req, res);
        if (!userId) return;
        try {
            const { text } = req.body;

            // Базовая валидация данных (Защита от дурака)
            if (!text || typeof text !== 'string' || text.trim() === '') {
                return res.status(400).json({ success: false, error: 'Field "text" is required and must be a string' });
            }

            const newTask = await taskService.createTask(userId, req.body);
            res.status(201).json({ success: true, data: newTask });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    }

    async updateTask(req, res) {
        const userId = getUserId(req, res);
        if (!userId) return;
        try {
            await taskService.updateTask(userId, req.params.id, req.body);
            res.status(200).json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    }

    async deleteTask(req, res) {
        const userId = getUserId(req, res);
        if (!userId) return;
        try {
            await taskService.deleteTask(userId, req.params.id);
            res.status(200).json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    }
}

module.exports = new TaskController();
