import { useState, useEffect, useCallback } from 'react';
import listingViewsService from '../services/listingViewsService';

export const useListingViews = (autoFetch = true) => {
  const [viewsData, setViewsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isStale, setIsStale] = useState(false);

  const fetchViewsSummary = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);

    try {
      const data = await listingViewsService.getMyListingsViewsSummary(forceRefresh);
      setViewsData(data);
      setIsStale(data.isStale || false);
    } catch (err) {
      setError(err.message || 'Failed to fetch views');
      console.error('useListingViews error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(() => {
    return fetchViewsSummary(true);
  }, [fetchViewsSummary]);

  useEffect(() => {
    if (autoFetch) {
      fetchViewsSummary();
    }
  }, [autoFetch, fetchViewsSummary]);

  return {
    viewsData,
    loading,
    error,
    isStale,
    refresh
  };
};

export const useRegisterView = () => {
  const [registering, setRegistering] = useState(false);

  const registerView = useCallback(async (listingId) => {
    setRegistering(true);
    try {
      await listingViewsService.registerView(listingId);
    } catch (error) {
      console.error('View registration failed:', error);
    } finally {
      setRegistering(false);
    }
  }, []);

  return { registerView, registering };
};