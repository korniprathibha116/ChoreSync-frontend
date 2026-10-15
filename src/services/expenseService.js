import api from './api';

export const expenseService = {
  async getExpenses(householdId) {
    const res = await api.get(`/households/${householdId}/expenses`);
    return res.data;
  },

  async createExpense(householdId, data) {
    const res = await api.post(`/households/${householdId}/expenses`, data);
    return res.data;
  },

  async updateExpense(expenseId, data) {
    const res = await api.put(`/expenses/${expenseId}`, data);
    return res.data;
  },

  async deleteExpense(expenseId) {
    const res = await api.delete(`/expenses/${expenseId}`);
    return res.data;
  },
};
