import instance from './axios';

export const getCategories = async () => {
  const response = await instance.get('/api/categories/');
  return response.data;
};

export const createListing = async (formData) => {
  const response = await instance.post('/api/listings/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getListingById = async (id) => {
  const response = await instance.get(`/api/listings/${id}/`);
  return response.data;
};

export const updateListing = async (id, formData) => {
  const response = await instance.put(`/api/listings/${id}/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteListing = async (id) => {
  const response = await instance.delete(`/api/listings/${id}/`);
  return response.data;
};
