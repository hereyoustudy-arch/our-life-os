const FIREBASE_BASE_URL = process.env.FIREBASE_DATABASE_URL || 'https://my-life-os-b0878.firebaseio.com';

class TaskService {
    // Получение всех задач
    async getAllTasks() {
        try {
            const response = await fetch(`${FIREBASE_BASE_URL}/tasks.json`);
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
    async createTask(taskData) {
        try {
            const response = await fetch(`${FIREBASE_BASE_URL}/tasks.json`, {
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

    // Обновление статуса задачи (выполнено / не выполнено)
    async updateTaskStatus(id, done) {
        try {
            // Используем PATCH и указываем точечное обновление поля через задачи Firebase REST API
            const url = `${FIREBASE_BASE_URL}/tasks/${id}.json`;
            const response = await fetch(url, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ done: done })
            });

            if (!response.ok) throw new Error(`Firebase patch error: ${response.statusText}`);
            return true;
        } catch (error) {
            console.error('[TaskService][updateTaskStatus] Error:', error.message);
            throw error;
        }
    }

    // Удаление задачи
    async deleteTask(id) {
        try {
            const response = await fetch(`${FIREBASE_BASE_URL}/tasks/${id}.json`, {
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

// Экспортируем экземпляр класса строго в конце файла
module.exports = new TaskService();
