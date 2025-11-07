import { instance } from './axios';

/**
 * Fetch all listings with optional filters, sorting, and search
 * @param {Object} params - Query parameters
 * @param {string} params.search - Search query for title and description
 * @param {number} params.category - Category ID
 * @param {number} params.min_price - Minimum price
 * @param {number} params.max_price - Maximum price
 * @param {string} params.ordering - Ordering field (created_at, -created_at, price, -price)
 * @returns {Promise} - API response with listings
 */
export const fetchListings = async (params = {}) => {
  const queryParams = new URLSearchParams();
  
  if (params.search) {
    queryParams.append('search', params.search);
  }
  if (params.category) {
    queryParams.append('category', params.category);
  }
  if (params.min_price) {
    queryParams.append('min_price', params.min_price);
  }
  if (params.max_price) {
    queryParams.append('max_price', params.max_price);
  }
  if (params.ordering) {
    queryParams.append('ordering', params.ordering);
  }
  
  const queryString = queryParams.toString();
  const url = queryString ? `/api/listings/?${queryString}` : '/api/listings/';
  
  const response = await instance.get(url);
  return response.data;
};

/**
 * Fetch a single listing by ID
 * @param {number} id - Listing ID
 * @returns {Promise} - API response with listing details
 */
export const fetchListingById = async (id) => {
  const response = await instance.get(`/api/listings/${id}/`);
  return response.data;
};

/**
 * Create a new listing
 * @param {FormData} formData - Form data with listing details and images
 * @returns {Promise} - API response with created listing
 */
export const createListing = async (formData) => {
  const response = await instance.post('/api/listings/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Update an existing listing
 * @param {number} id - Listing ID
 * @param {FormData} formData - Form data with updated listing details
 * @returns {Promise} - API response with updated listing
 */
export const updateListing = async (id, formData) => {
  const response = await instance.patch(`/api/listings/${id}/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Delete a listing
 * @param {number} id - Listing ID
 * @returns {Promise} - API response
 */
export const deleteListing = async (id) => {
  const response = await instance.delete(`/api/listings/${id}/`);
  return response.data;
};

/**
 * Fetch current user's listings
 * @returns {Promise} - API response with user's listings
 */
export const fetchMyListings = async () => {
  const response = await instance.get('/api/listings/my_listings/');
  return response.data;
};
