const { FIREBASE_BASE_URL } = require('../config/firebase');

class TaskService {
    // Получение всех задач пользователя
    async getAllTasks(userId) {
        try {
            const response = await fetch(`${FIREBASE_BASE_URL}/users/${userId}/tasks.json`);
            if (!response.ok) throw new Error(`Firebase error: ${response.statusText}`);

            const data = await response.json();
            if (!data) return [];

            // Преобразуем объект Firebase в массив с id
            return Object.keys(data).map(key => ({
                id: key,
                ...data[key]
            }));
        } catch (error) {
            console.error('[TaskService][getAllTasks] Error:', error.message);
            throw error;
        }
    }

    // Создание новой задачи
    async createTask(userId, taskData) {
        try {
            const response = await fetch(`${FIREBASE_BASE_URL}/users/${userId}/tasks.json`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...taskData,
                    createdAt: new Date().toISOString()
                })
            });

            if (!response.ok) throw new Error(`Firebase error: ${response.statusText}`);

            const data = await response.json();
            return { id: data.name, ...taskData };
        } catch (error) {
            console.error('[TaskService][createTask] Error:', error.message);
            throw error;
        }
    }

    // Частичное обновление задачи (статус, текст, что угодно из тела запроса)
    async updateTask(userId, id, updates) {
        try {
            const url = `${FIREBASE_BASE_URL}/users/${userId}/tasks/${id}.json`;
            const response = await fetch(url, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });

            if (!response.ok) throw new Error(`Firebase patch error: ${response.statusText}`);
            return true;
        } catch (error) {
            console.error('[TaskService][updateTask] Error:', error.message);
            throw error;
        }
    }

    // Удаление задачи
    async deleteTask(userId, id) {
        try {
            const response = await fetch(`${FIREBASE_BASE_URL}/users/${userId}/tasks/${id}.json`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error(`Firebase delete error: ${response.statusText}`);
            return true;
        } catch (error) {
            console.error('[TaskService][deleteTask] Error:', error.message);
            throw error;
        }
    }
}

module.exports = new TaskService();
