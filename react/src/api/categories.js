import { instance } from './axios';

/**
 * Fetch all categories
 * @returns {Promise} - API response with categories
 */
export const fetchCategories = async () => {
  const response = await instance.get('/api/categories/');
  return response.data;
};
