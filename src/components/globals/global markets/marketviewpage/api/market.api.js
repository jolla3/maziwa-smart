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

  // getListingViews: async (listingId, token) => {
  //   const response = await axios.get(`${API_BASE}/listing/summary/${listingId}`, {  // ✅ Fixed: Corrected endpoint to match backend (/api/listing/summary/:id)
  //     headers: { Authorization: `Bearer ${token}` },
  //   });
    
  //   return response.data;
  // },

  incrementViews: async (listingId, token) => {
    try {
      const response = await axios.post(
        `${API_BASE}/listing/views/${listingId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      return response.data;
    } catch (err) {
      console.error("Failed to increment views:", err);
      return null;
    }
  },
};

export default marketApi;  // ✅ Added default export to support both named and default imports