// farmhome/hooks/useDashboardData.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL, REFRESH_INTERVAL, CACHE_KEY } from '../utils/constants';

const useDashboardData = (token) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(false);

  const loadFromCache = useCallback(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        setData(parsed);
        return true;
      }
    } catch (err) {
      console.warn('Failed to load cached data:', err);
    }
    return false;
  }, []);

  const saveToCache = useCallback((dashboardData) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(dashboardData));
    } catch (err) {
      console.warn('Failed to cache data:', err);
    }
  }, []);

  const fetchDashboard = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);
    setIsOffline(false);

    try {
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await axios.get(`${API_BASE_URL}/farmerdash`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });

      if (response.data?.success && response.data?.data) {
        setData(response.data.data);
        saveToCache(response.data.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      
      let errorMessage = 'Failed to load dashboard data';
      
      if (err.message.includes('token')) {
        errorMessage = 'Authentication required. Please log in.';
      } else if (err.response?.status === 401) {
        errorMessage = 'Session expired. Please log in again.';
      } else if (err.response?.status === 403) {
        errorMessage = 'Access denied. Only farmers and managers can view this.';
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Loading cached data...';
        setIsOffline(true);
      } else if (!navigator.onLine) {
        errorMessage = 'You are offline. Showing cached data.';
        setIsOffline(true);
      }

      setError(errorMessage);
      
      // Load cached data on error
      const hasCache = loadFromCache();
      if (!hasCache && showLoading) {
        setLoading(false);
      }
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [token, loadFromCache, saveToCache]);

  const refresh = useCallback(() => {
    fetchDashboard(true);
  }, [fetchDashboard]);

  useEffect(() => {
    // Load cached data immediately
    loadFromCache();
    
    // Fetch fresh data
    fetchDashboard();

    // Set up auto-refresh
    const interval = setInterval(() => {
      if (token && navigator.onLine) {
        fetchDashboard(false);
      }
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchDashboard, token, loadFromCache]);

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      fetchDashboard(false);
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [fetchDashboard]);

  return { data, loading, error, refresh, isOffline };
};

export default useDashboardData;