const { FIREBASE_BASE_URL } = require('../config/firebase');

class HabitService {
    // Получение всех привычек пользователя
    async getAllHabits(userId) {
        try {
            const response = await fetch(`${FIREBASE_BASE_URL}/users/${userId}/habits.json`);
            if (!response.ok) throw new Error(`Firebase error: ${response.statusText}`);

            const data = await response.json();
            if (!data) return [];

            return Object.keys(data).map(key => ({
                id: key,
                title: data[key].title || '',
                createdAt: data[key].createdAt || '',
                completions: data[key].completions || {}
            }));
        } catch (error) {
            console.error('[HabitService][getAllHabits] Error:', error.message);
            throw error;
        }
    }

    // Создание новой привычки
    async createHabit(userId, title) {
        try {
            const response = await fetch(`${FIREBASE_BASE_URL}/users/${userId}/habits.json`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    createdAt: new Date().toISOString(),
                    completions: {}
                })
            });

            if (!response.ok) throw new Error(`Firebase error: ${response.statusText}`);

            const data = await response.json();
            return { id: data.name, title, completions: {} };
        } catch (error) {
            console.error('[HabitService][createHabit] Error:', error.message);
            throw error;
        }
    }

    // Отметить/снять отметку выполнения за конкретную дату (формат YYYY-MM-DD)
    async setCompletion(userId, id, date, done) {
        try {
            const url = `${FIREBASE_BASE_URL}/users/${userId}/habits/${id}/completions/${date}.json`;
            const response = await fetch(url, {
                method: done ? 'PUT' : 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: done ? JSON.stringify(true) : undefined
            });

            if (!response.ok) throw new Error(`Firebase error: ${response.statusText}`);
            return true;
        } catch (error) {
            console.error('[HabitService][setCompletion] Error:', error.message);
            throw error;
        }
    }

    // Удаление привычки
    async deleteHabit(userId, id) {
        try {
            const response = await fetch(`${FIREBASE_BASE_URL}/users/${userId}/habits/${id}.json`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error(`Firebase error: ${response.statusText}`);
            return true;
        } catch (error) {
            console.error('[HabitService][deleteHabit] Error:', error.message);
            throw error;
        }
    }
}

module.exports = new HabitService();
