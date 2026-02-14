import { useState, useEffect, useCallback, useRef, useMemo } from "react";

const CACHE_EXPIRY_HOURS = 1; // Default 1 hour

export const useApiCache = (key, fetchFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoize the cache key to prevent re-computations and handle undefined user
  const cacheKey = useMemo(() => {
    // If key includes 'undefined', replace with 'guest' for consistency
    return key.replace('_undefined_', '_guest_');
  }, [key]);

  // Helper to check if cache is valid
  const isCacheValid = useCallback((cache) => {
    if (!cache || !cache.timestamp) return false;
    const now = Date.now();
    const expiry = CACHE_EXPIRY_HOURS * 60 * 60 * 1000;
    return now - cache.timestamp < expiry;
  }, []);

  // Helper to get cached data
  const getCachedData = useCallback(() => {
    try {
      const cache = JSON.parse(localStorage.getItem(cacheKey));
      return isCacheValid(cache) ? cache : null;
    } catch (err) {
      console.warn("Failed to load from cache:", err);
      return null;
    }
  }, [cacheKey, isCacheValid]);

  // Helper to check if data has changed (optimized for arrays like listings)
  const hasDataChanged = useCallback((newData, cachedData) => {
    if (!cachedData) return true; // No cache, so save
    if (Array.isArray(newData) && Array.isArray(cachedData)) {
      // For arrays (e.g., listings), compare length and key IDs
      if (newData.length !== cachedData.length) return true;
      const newIds = newData.map(item => item._id).sort();
      const cachedIds = cachedData.map(item => item._id).sort();
      return JSON.stringify(newIds) !== JSON.stringify(cachedIds);
    }
    // For other data, use full JSON comparison
    return JSON.stringify(newData) !== JSON.stringify(cachedData);
  }, []);

  // Helper to set cached data with quota handling and change detection
  const setCachedData = useCallback((data) => {
    try {
      const existingCache = getCachedData();
      if (!hasDataChanged(data, existingCache?.data)) {
        console.log(`Data unchanged for '${cacheKey}', skipping cache update.`);
        return; // No need to update if data is the same
      }

      // Limit data size: For notifications, only store first 10 items with essential fields
      let limitedData = data;
      if (key === 'notifications' && Array.isArray(data)) {
        limitedData = data.slice(0, 10).map(item => ({
          _id: item._id,
          title: item.title,
          message: item.message?.substring(0, 100), // Truncate message
          is_read: item.is_read,
          created_at: item.created_at,
          type: item.type,
          cow: item.cow ? { cow_name: item.cow.cow_name, animal_code: item.cow.animal_code } : null,
        }));
      }
      // For other keys, limit to 50 items if array
      if (Array.isArray(limitedData) && limitedData.length > 50) {
        limitedData = limitedData.slice(0, 50);
      }

      const cache = { data: limitedData, timestamp: Date.now() };
      localStorage.setItem(cacheKey, JSON.stringify(cache));
      console.log(`Cache updated for '${cacheKey}' with new data.`);
    } catch (err) {
      if (err.name === 'QuotaExceededError') {
        console.warn(`Storage quota exceeded for key '${cacheKey}'. Clearing old caches and retrying...`);
        // Clear old caches (e.g., any keys starting with 'cache_')
        try {
          Object.keys(localStorage).forEach(k => {
            if (k.startsWith('cache_') || k !== cacheKey) { // Avoid clearing the current key
              localStorage.removeItem(k);
            }
          });
          // Retry setting cache
          const cache = { data, timestamp: Date.now() };
          localStorage.setItem(cacheKey, JSON.stringify(cache));
          console.log(`Cache set successfully after clearing for '${cacheKey}'.`);
        } catch (retryErr) {
          console.error(`Failed to set cache even after clearing for '${cacheKey}':`, retryErr);
          // Skip caching if still failing
        }
      } else {
        console.warn("Failed to cache data:", err);
      }
    }
  }, [cacheKey, key, getCachedData, hasDataChanged]);

  // Helper to clear cache
  const clearCache = useCallback(() => {
    try {
      localStorage.removeItem(cacheKey);
      setData(null); // Reset state to trigger re-fetch if needed
    } catch (err) {
      console.warn("Failed to clear cache:", err);
    }
  }, [cacheKey]);

  // Use useRef to store the fetch function stably (prevents re-creation)
  const fetchRef = useRef(fetchFunction);
  fetchRef.current = fetchFunction; // Update ref on changes, but doesn't cause re-renders

  // Memoize the fetch logic
  const memoizedFetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Check cache first
    const cached = getCachedData();
    if (cached) {
      setData(cached.data);
      setLoading(false);
      console.log(`Loaded from cache for '${cacheKey}'.`);
      return;
    }

    // Fetch from API
    try {
      const result = await fetchRef.current(); // Use ref to avoid dependency issues
      setData(result);
      setCachedData(result);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [getCachedData, setCachedData]); // Removed fetchFunction from deps

  // Effect to trigger fetch on dependencies change
  useEffect(() => {
    memoizedFetch();
  }, [memoizedFetch, ...dependencies]); // Include dependencies to re-fetch when they change

  return { data, loading, error, clearCache };
};