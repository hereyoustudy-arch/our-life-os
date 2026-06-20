const { FIREBASE_BASE_URL } = require('../config/firebase');

// Вспомогательная функция для сборки персонального пути к Firestore
function getUserUrl(userId) {
  return `${FIREBASE_BASE_URL}/users_${userId}`;
}

async function getAllTasks(userId) {
  if (!userId) return [];
  try {
    const response = await fetch(`${getUserUrl(userId)}/tasks`);
    if (!response.ok) {
      if (response.status === 404) return [];
      throw new Error(`Firebase error: ${response.statusText}`);
    }
    
    const data = await response.json();
    if (!data.documents) return [];

    return data.documents.map(doc => {
      const fields = doc.fields;
      const id = doc.name.split('/').pop();

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

async function createTask(taskData, userId) {
  if (!userId) throw new Error('Unauthorized');
  try {
    const documentId = `task_${Date.now()}`;
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

    const response = await fetch(`${getUserUrl(userId)}/tasks/${documentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(firestoreBody)
    });

    if (!response.ok) throw new Error(`Firebase update error: ${response.statusText}`);
    return { id: documentId, ...taskData, done: false };
  } catch (error) {
    console.error('[TaskService][createTask] Error:', error.message);
    throw error;
  }
}

async function updateTaskStatus(id, done, userId) {
  if (!userId) throw new Error('Unauthorized');
  try {
    const url = `${getUserUrl(userId)}/tasks/${id}?updateMask.fieldPaths=done`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: {
          done: { booleanValue: done }
        }
      })
    });
    if (!response.ok) throw new Error(`Firebase patch error: ${response.statusText}`);
    return true;
  } catch (error) {
    console.error('[TaskService][updateTaskStatus] Error:', error.message);
    throw error;
  }
}

module.exports = {
  getAllTasks,
  createTask,
  updateTaskStatus
};
