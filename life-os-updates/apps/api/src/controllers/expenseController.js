const expenseService = require('../services/expenseService');
const { getUserId } = require('../utils/getUserId');

class ExpenseController {
    async getExpenses(req, res) {
        const userId = getUserId(req, res);
        if (!userId) return;
        try {
            const expenses = await expenseService.getAllExpenses(userId);
            res.status(200).json({ success: true, expenses });
        } catch (e) {
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    }

    async createExpense(req, res) {
        const userId = getUserId(req, res);
        if (!userId) return;
        const { amount, category } = req.body;
        if (!amount || !category) return res.status(400).json({ success: false, error: 'Amount and category required' });
        try {
            const newExpense = await expenseService.createExpense(userId, amount, category);
            res.status(201).json({ success: true, expense: newExpense });
        } catch (e) {
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    }

    async deleteExpense(req, res) {
        const userId = getUserId(req, res);
        if (!userId) return;
        try {
            await expenseService.deleteExpense(userId, req.params.id);
            res.status(200).json({ success: true });
        } catch (e) {
            res.status(500).json({ success: false, error: 'Internal Server Error' });
        }
    }
}

module.exports = new ExpenseController();
