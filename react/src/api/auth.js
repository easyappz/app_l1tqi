import { instance } from './axios';

export const authAPI = {
  login: async (email, password) => {
    const response = await instance.post('/api/auth/login/', { email, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await instance.post('/api/auth/register/', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await instance.get('/api/auth/me/');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await instance.put('/api/auth/profile/', userData);
    return response.data;
  },
};
