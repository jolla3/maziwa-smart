import { useState, useEffect, useCallback } from 'react';

const CACHE_EXPIRY_MS = 60 * 60 * 1000; // 1 hour
const MAX_CACHE_KEYS = 10; // Reduced to 10 to prevent bloat
const REFRESH_INTERVAL_MS = 60000; // Increased to 60s to reduce calls

export const useOfflineCache = (key, fetcher, refreshInterval = REFRESH_INTERVAL_MS) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Helper to check if cache is valid
  const isCacheValid = useCallback((cache) => {
    if (!cache || !cache.timestamp) return false;
    return Date.now() - cache.timestamp < CACHE_EXPIRY_MS;
  }, []);

  // Helper to limit data size
  const limitDataSize = useCallback((data) => {
    if (Array.isArray(data)) {
      // Limit arrays to 20 items (reduced)
      return data.slice(0, 20).map(item => {
        // Truncate large objects (keep only essential fields)
        if (typeof item === 'object' && item !== null) {
          const limited = {};
          Object.keys(item).slice(0, 5).forEach(k => { // Reduced to 5 fields
            limited[k] = typeof item[k] === 'string' && item[k].length > 50 ? item[k].substring(0, 50) : item[k];
          });
          return limited;
        }
        return item;
      });
    }
    // For objects, limit to 5 fields
    if (typeof data === 'object' && data !== null) {
      const limited = {};
      Object.keys(data).slice(0, 5).forEach(k => {
        limited[k] = typeof data[k] === 'string' && data[k].length > 50 ? data[k].substring(0, 50) : data[k];
      });
      return limited;
    }
    return data;
  }, []);

  // Helper to clean up old caches aggressively
  const cleanupCaches = useCallback(() => {
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith('cache_'));
      console.log(`Total cache keys before cleanup: ${keys.length}`);

      const caches = keys.map(k => ({ key: k, cache: JSON.parse(localStorage.getItem(k)) })).filter(c => c.cache);

      // Remove expired caches
      const expired = caches.filter(c => !isCacheValid(c.cache));
      expired.forEach(c => {
        localStorage.removeItem(c.key);
        console.log(`Removed expired cache: ${c.key}`);
      });

      // Keep only the most recent MAX_CACHE_KEYS
      const validCaches = caches.filter(c => isCacheValid(c.cache)).sort((a, b) => b.cache.timestamp - a.cache.timestamp);
      const toRemove = validCaches.slice(MAX_CACHE_KEYS);
      toRemove.forEach(c => {
        localStorage.removeItem(c.key);
        console.log(`Removed old cache: ${c.key}`);
      });

      console.log(`Cache keys after cleanup: ${Object.keys(localStorage).filter(k => k.startsWith('cache_')).length}`);
    } catch (err) {
      console.warn('Cache cleanup failed:', err);
    }
  }, [isCacheValid]);

  const loadData = async (useCache = false) => {
    if (useCache || isOffline) {
      const cached = localStorage.getItem(`cache_${key}`);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (isCacheValid(parsed)) {
            setData(parsed.data);
            setLoading(false);
            console.log(`Loaded from cache for '${key}'.`);
            return parsed.data;
          } else {
            localStorage.removeItem(`cache_${key}`); // Remove expired
            console.log(`Removed expired cache for '${key}'.`);
          }
        } catch (e) {
          console.error('Cache parse error:', e);
          localStorage.removeItem(`cache_${key}`);
        }
      }
    }

    if (isOffline) {
      setError('You are offline. Showing cached data.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await fetcher();
      const limitedResult = limitDataSize(result);

      // Check if data has changed
      const existingCache = localStorage.getItem(`cache_${key}`);
      let existingData = null;
      if (existingCache) {
        try {
          const parsed = JSON.parse(existingCache);
          if (isCacheValid(parsed)) existingData = parsed.data;
        } catch (e) {}
      }

      if (JSON.stringify(existingData) !== JSON.stringify(limitedResult)) {
        // Data changed, save new cache
        localStorage.setItem(`cache_${key}`, JSON.stringify({
          data: limitedResult,
          timestamp: Date.now()
        }));
        console.log(`Cache updated for '${key}' with new data.`);
      } else {
        console.log(`Data unchanged for '${key}', skipping cache update.`);
      }

      setData(limitedResult);
      setLoading(false);
      return limitedResult;
    } catch (err) {
      setError(err.message);
      setLoading(false);

      // Try to load from cache on error
      const cached = localStorage.getItem(`cache_${key}`);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (isCacheValid(parsed)) {
            setData(parsed.data);
          }
        } catch (e) {
          console.error('Cache parse error:', e);
        }
      }
    }
  };

  useEffect(() => {
    cleanupCaches(); // Clean up on mount
    loadData(true);

    const interval = setInterval(() => {
      if (!isOffline) {
        loadData(false);
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [key, isOffline, cleanupCaches, refreshInterval]);

  return { data, loading, error, isOffline, refresh: () => loadData(false) };
};