import { instance } from './axios';

export const listingsAPI = {
  getListings: async (params = {}) => {
    const response = await instance.get('/api/listings/', { params });
    return response.data;
  },

  getListing: async (id) => {
    const response = await instance.get(`/api/listings/${id}/`);
    return response.data;
  },

  createListing: async (formData) => {
    const response = await instance.post('/api/listings/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateListing: async (id, formData) => {
    const response = await instance.put(`/api/listings/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteListing: async (id) => {
    const response = await instance.delete(`/api/listings/${id}/`);
    return response.data;
  },

  getCategories: async () => {
    const response = await instance.get('/api/categories/');
    return response.data;
  },
};
