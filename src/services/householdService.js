import api from './api';

function validateHousehold(household) {
  if (!household || household.id == null || typeof household.name !== 'string') {
    throw new Error('The server returned an invalid household.');
  }
  return household;
}

export const householdService = {
  async getHouseholds() {
    const res = await api.get('/households');
    if (!Array.isArray(res.data)) {
      throw new Error('The server returned an invalid household list.');
    }
    return res.data.map(validateHousehold);
  },

  async getHouseholdSummary(id) {
    const res = await api.get(`/households/${id}`);
    if (!res.data || res.data.id == null || typeof res.data.name !== 'string' || !Array.isArray(res.data.members)) {
      throw new Error('The server returned an invalid household summary.');
    }
    const hasInvalidMember = res.data.members.some((member) =>
      !member || member.userId == null ||
      typeof member.displayName !== 'string' ||
      typeof member.email !== 'string' ||
      typeof member.role !== 'string'
    );
    if (hasInvalidMember) {
      throw new Error('The server returned an invalid household member.');
    }
    return res.data;
  },

  async createHousehold(data) {
    const res = await api.post('/households', data);
    return validateHousehold(res.data);
  },

  async joinHousehold(inviteCode) {
    const res = await api.post('/households/join', { inviteCode });
    return validateHousehold(res.data);
  },

  async removeMember(householdId, userId) {
    const res = await api.delete(`/households/${householdId}/members/${userId}`);
    return res.data;
  },
};
