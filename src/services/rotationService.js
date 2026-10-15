import api from './api';

export const rotationService = {
  async getRotation(householdId) {
    const res = await api.get(`/households/${householdId}/rotation`);
    return res.data;
  },

  async rotateChores(householdId) {
    const res = await api.post(`/households/${householdId}/rotation/rotate`);
    return res.data;
  },
};
