// FILE: /src/components/SUPERaDMIN/utils/cache.js
const CACHE_EXPIRY_MS = 60 * 60 * 1000; // 1 hour
const MAX_CACHE_KEYS = 10; // Reduced to 10

export const cacheUtils = {
  set: (key, data) => {
    try {
      // Limit data size
      let limitedData = data;
      if (Array.isArray(data) && data.length > 20) limitedData = data.slice(0, 20);
      if (typeof data === 'object' && data !== null) {
        limitedData = Object.fromEntries(Object.entries(data).slice(0, 5));
      }

      // Check for changes
      const existing = localStorage.getItem(`cache_${key}`);
      if (existing) {
        const parsed = JSON.parse(existing);
        if (JSON.stringify(parsed.data) === JSON.stringify(limitedData)) {
          console.log(`Data unchanged for '${key}', skipping cache update.`);
          return;
        }
      }

      localStorage.setItem(`cache_${key}`, JSON.stringify({
        data: limitedData,
        timestamp: Date.now()
      }));

      // Aggressive cleanup
      const keys = Object.keys(localStorage).filter(k => k.startsWith('cache_'));
      if (keys.length > MAX_CACHE_KEYS) {
        keys.sort((a, b) => {
          const aTime = JSON.parse(localStorage.getItem(a))?.timestamp || 0;
          const bTime = JSON.parse(localStorage.getItem(b))?.timestamp || 0;
          return aTime - bTime;
        }).slice(0, keys.length - MAX_CACHE_KEYS).forEach(k => {
          localStorage.removeItem(k);
          console.log(`Removed old cache: ${k}`);
        });
      }
    } catch (err) {
      console.warn('Cache set failed:', err);
    }
  },

  get: (key) => {
    try {
      const cached = localStorage.getItem(`cache_${key}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < CACHE_EXPIRY_MS) {
          return parsed.data;
        } else {
          localStorage.removeItem(`cache_${key}`);
          console.log(`Removed expired cache: cache_${key}`);
        }
      }
    } catch (err) {
      console.warn('Cache get failed:', err);
    }
    return null;
  },

  // Manual cleanup function
  cleanup: () => {
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith('cache_'));
      keys.forEach(k => {
        const cached = localStorage.getItem(k);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Date.now() - parsed.timestamp >= CACHE_EXPIRY_MS) {
            localStorage.removeItem(k);
            console.log(`Manually removed expired cache: ${k}`);
          }
        }
      });
      console.log('Manual cache cleanup completed.');
    } catch (err) {
      console.warn('Manual cleanup failed:', err);
    }
  }
};