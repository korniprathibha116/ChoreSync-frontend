import api from './api';

export const dashboardService = {
  async getDashboard(householdId) {
    const res = await api.get(`/households/${householdId}/dashboard`);
    return res.data;
  },
};
