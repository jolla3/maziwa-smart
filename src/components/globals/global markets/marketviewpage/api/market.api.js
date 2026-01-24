// marketviewpage/api/market.api.js
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE;

export const marketApi = {
  fetchListings: async (filters, token) => {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== "")
    );
    
    const response = await axios.get(`${API_BASE}/market`, {
      params,
      headers: { Authorization: `Bearer ${token}` },
    });
    
    return response.data;
  },

  fetchTrending: async (token) => {
    const response = await axios.get(`${API_BASE}/market/extra/trending`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    return response.data;
  },

  incrementViews: async (listingId, token) => {
    const response = await axios.post(
      `${API_BASE}/market/${listingId}/view`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    return response.data;
  },
};