import { instance } from './axios';

export const adminAPI = {
  getStatistics: async () => {
    const response = await instance.get('/api/admin/statistics/');
    return response.data;
  },

  getAllListings: async (params = {}) => {
    const response = await instance.get('/api/admin/listings/', { params });
    return response.data;
  },

  approveListing: async (id) => {
    const response = await instance.post(`/api/admin/listings/${id}/approve/`);
    return response.data;
  },

  rejectListing: async (id) => {
    const response = await instance.post(`/api/admin/listings/${id}/reject/`);
    return response.data;
  },

  deleteListing: async (id) => {
    const response = await instance.delete(`/api/admin/listings/${id}/`);
    return response.data;
  },

  blockUser: async (userId) => {
    const response = await instance.post(`/api/admin/users/${userId}/block/`);
    return response.data;
  },

  unblockUser: async (userId) => {
    const response = await instance.post(`/api/admin/users/${userId}/unblock/`);
    return response.data;
  },
};
