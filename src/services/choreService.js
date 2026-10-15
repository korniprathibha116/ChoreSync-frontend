import api from './api';

export const choreService = {
  async getChores(householdId) {
    const res = await api.get(`/households/${householdId}/chores`);
    return res.data;
  },

  async createChore(householdId, data) {
    const res = await api.post(`/households/${householdId}/chores`, data);
    return res.data;
  },

  async updateChore(choreId, data) {
    const res = await api.put(`/chores/${choreId}`, data);
    return res.data;
  },

  async deleteChore(choreId) {
    const res = await api.delete(`/chores/${choreId}`);
    return res.data;
  },

  async completeChore(choreId, notes = 'Completed') {
    const res = await api.post(`/chores/${choreId}/complete`, { notes });
    return res.data;
  },

  async reopenChore(choreId) {
    const res = await api.post(`/chores/${choreId}/reopen`);
    return res.data;
  },
};
