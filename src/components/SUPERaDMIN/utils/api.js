
// ============================================
// STEP 3: Update your frontend api.js to debug
// ============================================

// FILE: /src/components/SUPERaDMIN/utils/api.js
import { cacheUtils } from './cache';

const API_BASE = process.env.REACT_APP_API_BASE || 'https://maziwasmart.onrender.com/api';

export const apiRequest = async (endpoint, options = {}, cacheKey = null) => {
  const token = localStorage.getItem('token');
  
  // DEBUG: Log token
  console.log('Token being sent:', token ? 'exists' : 'MISSING');
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options.headers
    }
  };

  // DEBUG: Log full request
  console.log('API Request:', `${API_BASE}${endpoint}`);
  console.log('Headers:', config.headers);

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    
    // DEBUG: Log response status
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      // If 403, try to get error message
      if (response.status === 403) {
        const errorData = await response.json().catch(() => ({}));
        console.error('403 Forbidden - Server says:', errorData);
      }
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if ((!options.method || options.method === 'GET') && cacheKey) {
      cacheUtils.set(cacheKey, data);
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);

    if (cacheKey) {
      const cached = cacheUtils.get(cacheKey);
      if (cached) {
        console.info('Using cached data for:', cacheKey);
        return cached;
      }
    }

    throw error;
  }
};

export { API_BASE };
