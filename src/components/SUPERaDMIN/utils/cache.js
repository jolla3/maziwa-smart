
// ============================================
// FILE: /src/superadmin/utils/cache.js
// ============================================
const CACHE_PREFIX = 'sa_cache_';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const cacheUtils = {
  set: (key, data) => {
    try {
      const cacheData = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(cacheData));
    } catch (err) {
      console.warn('Cache set failed:', err);
    }
  },

  get: (key) => {
    try {
      const cached = localStorage.getItem(CACHE_PREFIX + key);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const age = Date.now() - timestamp;

      if (age > CACHE_DURATION) {
        localStorage.removeItem(CACHE_PREFIX + key);
        return null;
      }

      return data;
    } catch (err) {
      console.warn('Cache get failed:', err);
      return null;
    }
  },

  clear: (key) => {
    try {
      if (key) {
        localStorage.removeItem(CACHE_PREFIX + key);
      } else {
        Object.keys(localStorage)
          .filter(k => k.startsWith(CACHE_PREFIX))
          .forEach(k => localStorage.removeItem(k));
      }
    } catch (err) {
      console.warn('Cache clear failed:', err);
    }
  }
};