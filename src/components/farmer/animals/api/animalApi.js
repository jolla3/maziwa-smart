// animals/api/animalApi.js
import axios from 'axios';

const BASE_URL = 'https://maziwasmart.onrender.com/api/farmer/animals';

const getAuthHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});

const animalApi = {
  getAnimals: async (token, params = {}) => {
    const response = await axios.get(BASE_URL, {
      headers: getAuthHeaders(token),
      params,
      timeout: 10000,
    });
    return response.data;
  },

  getAnimalById: async (token, id) => {
    const response = await axios.get(`${BASE_URL}/${id}`, {
      headers: getAuthHeaders(token),
    });
    return response.data;
  },

  createAnimal: async (token, formData) => {
    const response = await axios.post(BASE_URL, formData, {
      headers: {
        ...getAuthHeaders(token),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateAnimal: async (token, id, formData) => {
    const response = await axios.put(`${BASE_URL}/${id}`, formData, {
      headers: {
        ...getAuthHeaders(token),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteAnimal: async (token, id) => {
    const response = await axios.delete(`${BASE_URL}/${id}`, {
      headers: getAuthHeaders(token),
    });
    return response.data;
  },
};

export default animalApi;