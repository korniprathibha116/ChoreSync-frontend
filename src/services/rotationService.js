import api from './api';

export const rotationService = {
  async getRotation(householdId) {
    const res = await api.get(`/households/${householdId}/rotation`);
    if (!res.data || !Array.isArray(res.data.memberWorkloads) || !Array.isArray(res.data.choreRotations)) {
      throw new Error('The server returned an invalid rotation overview.');
    }
    return res.data;
  },

  async rotateChores(householdId) {
    const res = await api.post(`/households/${householdId}/rotation/rotate`);
    if (!res.data || !Array.isArray(res.data.memberWorkloads) || !Array.isArray(res.data.choreRotations)) {
      throw new Error('The server returned an invalid rotation result.');
    }
    return res.data;
  },
};
