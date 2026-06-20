const express = require('express');
const cors = require('cors');

// Импорт маршрутов
const taskRoutes = require('./routes/taskRoutes');
const habitRoutes = require('./routes/habitRoutes');
const logRoutes = require('./routes/logRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Подключение модулей API
app.use('/api/tasks', taskRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/expenses', expenseRoutes);

// Проверка статуса сервера
app.get('/status', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Life OS API Operational',
    timestamp: new Date()
  });
});

// Запуск
app.listen(PORT, () => {
  console.log(`[server]: Engine active on port ${PORT}`);
});