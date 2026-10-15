import api from './api';

export const reportService = {
  async getReports(householdId, timeRange = 'Last 30 Days') {
    const res = await api.get(`/households/${householdId}/reports`, {
      params: { timeRange },
    });
    return res.data;
  },
};
