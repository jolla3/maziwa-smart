// animals/api/animalApi.js
import axios from 'axios';

const BASE_URL =     process.env.REACT_APP_API_BASE

const getAuthHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});

const animalApi = {
  getAnimals: async (token, params = {}) => {
    const response = await axios.get(`${BASE_URL}/animals`, {
      headers: getAuthHeaders(token),
      params,
      timeout: 10000,
    });
    return response.data;
  },

  getAnimalById: async (token, id) => {
    const response = await axios.get(`${BASE_URL}/animals/${id}`, {
      headers: getAuthHeaders(token),
    });
    return response.data;
  },

  createAnimal: async (token, formData) => {
    const response = await axios.post(`${BASE_URL}/animals`, formData, {
      headers: {
        ...getAuthHeaders(token),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateAnimal: async (token, id, formData) => {
    const response = await axios.patch(`${BASE_URL}/animals/${id}`, formData, {
      headers: {
        ...getAuthHeaders(token),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteAnimal: async (token, id) => {
    const response = await axios.delete(`${BASE_URL}/animals/${id}`, {
      headers: getAuthHeaders(token),
    });
    return response.data;
  },
};

export default animalApi;