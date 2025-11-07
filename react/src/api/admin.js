import { instance } from './axios';

export const getAdminStats = async () => {
  const response = await instance.get('/api/admin/stats/');
  return response.data;
};

export const getAdminListings = async (params = {}) => {
  const response = await instance.get('/api/admin/listings/', { params });
  return response.data;
};

export const deleteAdminListing = async (id) => {
  const response = await instance.delete(`/api/admin/listings/${id}/`);
  return response.data;
};

export const getAdminUsers = async (params = {}) => {
  const response = await instance.get('/api/admin/users/', { params });
  return response.data;
};

export const blockUser = async (id, isBlocked) => {
  const response = await instance.post(`/api/admin/users/${id}/block/`, {
    is_blocked: isBlocked
  });
  return response.data;
};
