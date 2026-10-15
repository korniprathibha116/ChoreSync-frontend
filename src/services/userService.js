import api from './api';

export const userService = {
  async getProfile() {
    const res = await api.get('/users/profile');
    return res.data;
  },

  async updateProfile(data) {
    const res = await api.put('/users/profile', data);
    return res.data;
  },
};
