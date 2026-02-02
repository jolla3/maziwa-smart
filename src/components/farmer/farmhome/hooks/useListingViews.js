// farmhome/hooks/useListingViews.js
import { useState, useEffect, useCallback } from 'react';
import ListingViewsService from '../services/ListingViewsService';

const useListingViews = (autoRefresh = false) => {
  const [viewsData, setViewsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isStale, setIsStale] = useState(false);

  const fetchViewsSummary = useCallback(async (forceRefresh = false) => {
    if (!forceRefresh && viewsData) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await ListingViewsService.getMyListingsViewsSummary(forceRefresh);
      
      if (data.isStale) {
        setIsStale(true);
        setError('Using cached data - unable to fetch fresh data');
      } else {
        setIsStale(false);
      }
      
      setViewsData(data);
    } catch (err) {
      console.error('Failed to fetch views summary:', err);
      setError('Failed to load analytics data');
      
      // Try to load cached data
      const cached = ListingViewsService.getCachedSummary(true);
      if (cached) {
        setViewsData(cached);
        setIsStale(true);
      }
    } finally {
      setLoading(false);
    }
  }, [viewsData]);

  const refresh = useCallback(() => {
    fetchViewsSummary(true);
  }, [fetchViewsSummary]);

  useEffect(() => {
    fetchViewsSummary(false);

    // Auto-refresh every 5 minutes if enabled
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchViewsSummary(true);
      }, 5 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, fetchViewsSummary]);

  return {
    viewsData,
    loading,
    error,
    isStale,
    refresh,
  };
};

export default useListingViews;