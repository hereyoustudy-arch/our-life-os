const taskService = require('../services/taskService');

class TaskController {
  async getTasks(req, res) {
    try {
      const tasks = await taskService.getAllTasks();
      res.status(200).json({ success: true, data: tasks });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }

  async createTask(req, res) {
    try {
      const { text } = req.body;
      
      // Базовая валидация данных (Защита от дурака)
      if (!text || typeof text !== 'string' || text.trim() === '') {
        return res.status(400).json({ success: false, error: 'Field "text" is required and must be a string' });
      }

      const newTask = await taskService.createTask(req.body);
      res.status(201).json({ success: true, data: newTask });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
}

module.exports = new TaskController();