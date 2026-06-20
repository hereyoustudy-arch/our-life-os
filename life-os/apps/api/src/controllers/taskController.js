const taskService = require('../services/taskService');

class TaskController {
  async getTasks(req, res) {
    try {
      const userId = req.headers['x-user-id']; // Читаем заголовок авторизации
      if (!userId) return res.status(401).json({ success: false, error: 'User ID missing' });

      const tasks = await taskService.getAllTasks(userId);
      res.status(200).json({ success: true, data: tasks });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }

  async createTask(req, res) {
    try {
      const userId = req.headers['x-user-id'];
      if (!userId) return res.status(401).json({ success: false, error: 'User ID missing' });

      const { text } = req.body;
      if (!text || text.trim() === '') {
        return res.status(400).json({ success: false, error: 'Field "text" is required' });
      }

      const newTask = await taskService.createTask(req.body, userId);
      res.status(201).json({ success: true, data: newTask });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }

  async updateTask(req, res) {
    try {
      const userId = req.headers['x-user-id'];
      if (!userId) return res.status(401).json({ success: false, error: 'User ID missing' });

      const { id } = req.params;
      const { done } = req.body;
      
      await taskService.updateTaskStatus(id, done, userId);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
}

module.exports = new TaskController();
