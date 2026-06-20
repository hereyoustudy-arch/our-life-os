const { FIREBASE_BASE_URL } = require('../config/firebase');

class ExpenseService {
  async getAllExpenses() {
    try {
      const response = await fetch(`${FIREBASE_BASE_URL}/expenses`);
      if (!response.ok) return [];
      const data = await response.json();
      if (!data.documents) return [];
      return data.documents.map(doc => ({
        id: doc.name.split('/').pop(),
        amount: Number(doc.fields.amount?.stringValue || 0),
        category: doc.fields.category?.stringValue || '',
        createdAt: doc.fields.createdAt?.stringValue || ''
      }));
    } catch (error) {
      return [];
    }
  }

  async createExpense(amount, category) {
    const documentId = `expense_${Date.now()}`;
    const createdAt = new Date().toLocaleString('ru-RU');
    const response = await fetch(`${FIREBASE_BASE_URL}/expenses/${documentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: {
          amount: { stringValue: String(amount) },
          category: { stringValue: category },
          createdAt: { stringValue: createdAt }
        }
      })
    });
    if (!response.ok) throw new Error('Firebase error');
    return { id: documentId, amount, category, createdAt };
  }
}
module.exports = new ExpenseService();