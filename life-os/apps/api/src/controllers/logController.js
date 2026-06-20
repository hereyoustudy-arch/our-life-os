const logService = require('../services/logService');

class LogController {
  async getLogs(req, res) {
    const logs = await logService.getAllLogs();
    res.status(200).json({ success: true, logs });
  }
  async createLog(req, res) {
    const { note } = req.body;
    if (!note) return res.status(400).json({ success: false, error: 'Note required' });
    try {
      const newLog = await logService.createLog(note);
      res.status(201).json({ success: true, log: newLog });
    } catch (e) {
      res.status(500).json({ success: false });
    }
  }
}
module.exports = new LogController();