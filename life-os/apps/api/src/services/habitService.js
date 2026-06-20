const { FIREBASE_BASE_URL } = require('../config/firebase');

class HabitService {
  async getAllHabits() {
    try {
      const response = await fetch(`${FIREBASE_BASE_URL}/habits`);
      if (!response.ok) return [];
      const data = await response.json();
      if (!data.documents) return [];
      return data.documents.map(doc => ({
        id: doc.name.split('/').pop(),
        title: doc.fields.title?.stringValue || ''
      }));
    } catch (error) {
      return [];
    }
  }

  async createHabit(title) {
    const documentId = `habit_${Date.now()}`;
    const response = await fetch(`${FIREBASE_BASE_URL}/habits/${documentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: { title: { stringValue: title } } })
    });
    if (!response.ok) throw new Error('Firebase error');
    return { id: documentId, title };
  }
}
module.exports = new HabitService();