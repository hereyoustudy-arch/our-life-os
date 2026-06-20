const logService = require('../services/logService');
const { getUserId } = require('../utils/getUserId');

class LogController {
    async getLogs(req, res) {
        const userId = getUserId(req, res);
        if (!userId) return;
        try {
            const logs = await logService.getAllLogs(userId);
            res.status(200).json({ success: true, logs });
        } catch (e) {
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    }

    async createLog(req, res) {
        const userId = getUserId(req, res);
        if (!userId) return;
        const { note } = req.body;
        if (!note) return res.status(400).json({ success: false, error: 'Note required' });
        try {
            const newLog = await logService.createLog(userId, note);
            res.status(201).json({ success: true, log: newLog });
        } catch (e) {
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    }

    async deleteLog(req, res) {
        const userId = getUserId(req, res);
        if (!userId) return;
        try {
            await logService.deleteLog(userId, req.params.id);
            res.status(200).json({ success: true });
        } catch (e) {
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    }
}

module.exports = new LogController();
