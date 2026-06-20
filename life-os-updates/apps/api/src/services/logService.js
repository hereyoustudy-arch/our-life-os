const { FIREBASE_BASE_URL } = require('../config/firebase');

class LogService {
    async getAllLogs(userId) {
        try {
            const response = await fetch(`${FIREBASE_BASE_URL}/users/${userId}/logs.json`);
            if (!response.ok) throw new Error(`Firebase error: ${response.statusText}`);

            const data = await response.json();
            if (!data) return [];

            return Object.keys(data)
                .map(key => ({ id: key, ...data[key] }))
                .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        } catch (error) {
            console.error('[LogService][getAllLogs] Error:', error.message);
            throw error;
        }
    }

    async createLog(userId, note) {
        try {
            const createdAt = new Date().toISOString();
            const response = await fetch(`${FIREBASE_BASE_URL}/users/${userId}/logs.json`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ note, createdAt })
            });

            if (!response.ok) throw new Error(`Firebase error: ${response.statusText}`);

            const data = await response.json();
            return { id: data.name, note, createdAt };
        } catch (error) {
            console.error('[LogService][createLog] Error:', error.message);
            throw error;
        }
    }

    async deleteLog(userId, id) {
        try {
            const response = await fetch(`${FIREBASE_BASE_URL}/users/${userId}/logs/${id}.json`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error(`Firebase error: ${response.statusText}`);
            return true;
        } catch (error) {
            console.error('[LogService][deleteLog] Error:', error.message);
            throw error;
        }
    }
}

module.exports = new LogService();
