const { FIREBASE_BASE_URL } = require('../config/firebase');

class ExpenseService {
    async getAllExpenses(userId) {
        try {
            const response = await fetch(`${FIREBASE_BASE_URL}/users/${userId}/expenses.json`);
            if (!response.ok) throw new Error(`Firebase error: ${response.statusText}`);

            const data = await response.json();
            if (!data) return [];

            return Object.keys(data)
                .map(key => ({ id: key, ...data[key] }))
                .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        } catch (error) {
            console.error('[ExpenseService][getAllExpenses] Error:', error.message);
            throw error;
        }
    }

    async createExpense(userId, amount, category) {
        try {
            const createdAt = new Date().toISOString();
            const response = await fetch(`${FIREBASE_BASE_URL}/users/${userId}/expenses.json`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, category, createdAt })
            });

            if (!response.ok) throw new Error(`Firebase error: ${response.statusText}`);

            const data = await response.json();
            return { id: data.name, amount, category, createdAt };
        } catch (error) {
            console.error('[ExpenseService][createExpense] Error:', error.message);
            throw error;
        }
    }

    async deleteExpense(userId, id) {
        try {
            const response = await fetch(`${FIREBASE_BASE_URL}/users/${userId}/expenses/${id}.json`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error(`Firebase error: ${response.statusText}`);
            return true;
        } catch (error) {
            console.error('[ExpenseService][deleteExpense] Error:', error.message);
            throw error;
        }
    }
}

module.exports = new ExpenseService();
