import { instance } from './axios';

export const getListingById = async (id) => {
  const response = await instance.get(`/api/listings/${id}/`);
  return response.data;
};

export const deleteListing = async (id) => {
  const response = await instance.delete(`/api/listings/${id}/`);
  return response.data;
};
