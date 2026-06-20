const { FIREBASE_BASE_URL } = require('../config/firebase');

class LogService {
  async getAllLogs() {
    try {
      const response = await fetch(`${FIREBASE_BASE_URL}/logs`);
      if (!response.ok) return [];
      const data = await response.json();
      if (!data.documents) return [];
      return data.documents.map(doc => ({
        id: doc.name.split('/').pop(),
        note: doc.fields.note?.stringValue || '',
        createdAt: doc.fields.createdAt?.stringValue || ''
      }));
    } catch (error) {
      return [];
    }
  }

  async createLog(note) {
    const documentId = `log_${Date.now()}`;
    const createdAt = new Date().toLocaleString('ru-RU');
    const response = await fetch(`${FIREBASE_BASE_URL}/logs/${documentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: {
          note: { stringValue: note },
          createdAt: { stringValue: createdAt }
        }
      })
    });
    if (!response.ok) throw new Error('Firebase error');
    return { id: documentId, note, createdAt };
  }
}
module.exports = new LogService();