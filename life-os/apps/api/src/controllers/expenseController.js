const expenseService = require('../services/expenseService');

class ExpenseController {
  async getExpenses(req, res) {
    const expenses = await expenseService.getAllExpenses();
    res.status(200).json({ success: true, expenses });
  }
  async createExpense(req, res) {
    const { amount, category } = req.body;
    if (!amount || !category) return res.status(400).json({ success: false, error: 'Amount and category required' });
    try {
      const newExpense = await expenseService.createExpense(amount, category);
      res.status(201).json({ success: true, expense: newExpense });
    } catch (e) {
      res.status(500).json({ success: false });
    }
  }
}
module.exports = new ExpenseController();