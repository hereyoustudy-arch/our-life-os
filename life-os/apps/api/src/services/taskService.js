const { FIREBASE_BASE_URL } = require('../config/firebase');

class TaskService {
  // Получение всех задач
  async getAllTasks() {
    try {
      const response = await fetch(`${FIREBASE_BASE_URL}/tasks`);
      if (!response.ok) {
        if (response.status === 404) return []; // Если коллекции еще нет
        throw new Error(`Firebase error: ${response.statusText}`);
      }
      
      const data = await response.json();
      if (!data.documents) return [];

      // Парсим страшный формат Firestore REST API в чистый JSON
      return data.documents.map(doc => {
        const fields = doc.fields;
        const nameParts = doc.name.split('/');
        const id = nameParts[nameParts.length - 1]; // Вытаскиваем реальный ID документа

        return {
          id,
          text: fields.text?.stringValue || '',
          targetPeriod: fields.targetPeriod?.stringValue || 'today',
          targetDate: fields.targetDate?.stringValue || '',
          isMain: fields.isMain?.booleanValue || false,
          parentId: fields.parentId?.stringValue || null,
          priority: fields.priority?.stringValue || 'medium',
          category: fields.category?.stringValue || 'personal',
          notes: fields.notes?.stringValue || '',
          done: fields.done?.booleanValue || false
        };
      });
    } catch (error) {
      console.error('[TaskService][getAllTasks] Error:', error.message);
      throw error;
    }
  }

  // Создание новой задачи
  async createTask(taskData) {
    try {
      const documentId = `task_${Date.now()}`;
      
      // Формируем строгую типизированную структуру для Firestore
      const firestoreBody = {
        fields: {
          text: { stringValue: taskData.text || 'Без названия' },
          targetPeriod: { stringValue: taskData.targetPeriod || 'today' },
          targetDate: { stringValue: taskData.targetDate || '' },
          isMain: { booleanValue: !!taskData.isMain },
          parentId: taskData.parentId ? { stringValue: taskData.parentId } : { nullValue: null },
          priority: { stringValue: taskData.priority || 'medium' },
          category: { stringValue: taskData.category || 'personal' },
          notes: { stringValue: taskData.notes || '' },
          done: { booleanValue: false }
        }
      };

      // Для принудительной генерации своего ID по спецификации используется PATCH/PUT
      const response = await fetch(`${FIREBASE_BASE_URL}/tasks/${documentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(firestoreBody)
      });

      if (!response.ok) {
        throw new Error(`Firebase update error: ${response.statusText}`);
      }

      return { id: documentId, ...taskData, done: false };
    } catch (error) {
      console.error('[TaskService][createTask] Error:', error.message);
      throw error;
    }
  }
}

module.exports = new TaskService();