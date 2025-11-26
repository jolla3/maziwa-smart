
// ============================================================
// src/superadmin/hooks/useOfflineCache.js
// ============================================================
import { useState, useEffect } from 'react';

export const useOfflineCache = (key, fetcher, refreshInterval = 30000) => {
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

  const loadData = async (useCache = false) => {
    if (useCache || isOffline) {
      const cached = localStorage.getItem(`cache_${key}`);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setData(parsed.data);
          setLoading(false);
          return parsed.data;
        } catch (e) {
          console.error('Cache parse error:', e);
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
      setData(result);
      
      // Cache the data
      localStorage.setItem(`cache_${key}`, JSON.stringify({
        data: result,
        timestamp: Date.now()
      }));
      
      setLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      
      // Try to load from cache on error
      const cached = localStorage.getItem(`cache_${key}`);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setData(parsed.data);
        } catch (e) {
          console.error('Cache parse error:', e);
        }
      }
    }
  };

  useEffect(() => {
    loadData(true);
    
    const interval = setInterval(() => {
      if (!isOffline) {
        loadData(false);
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [key, isOffline]);

  return { data, loading, error, isOffline, refresh: () => loadData(false) };
};
