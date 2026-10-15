import api from './api';

export const householdService = {
  async getHouseholds() {
    const res = await api.get('/households');
    return res.data;
  },

  async getHouseholdSummary(id) {
    const res = await api.get(`/households/${id}`);
    return res.data;
  },

  async createHousehold(data) {
    const res = await api.post('/households', data);
    return res.data;
  },

  async joinHousehold(inviteCode) {
    const res = await api.post('/households/join', { inviteCode });
    return res.data;
  },

  async removeMember(householdId, userId) {
    const res = await api.delete(`/households/${householdId}/members/${userId}`);
    return res.data;
  },
};
