import api from './api';

const CACHE_KEY = 'seller_views_summary';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

class ListingViewsService {
  // Register a view for a listing
  async registerView(listingId) {
    try {
      await api.post(`/listing/views/${listingId}`);
      return { success: true };
    } catch (error) {
      console.error('Failed to register view:', error);
      return { success: false, error };
    }
  }

  // Get views for a specific listing
  async getListingViews(listingId) {
    try {
      const response = await api.get(`/listing/summary/${listingId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch listing views:', error);
      throw error;
    }
  }

  // Get summary of seller's listings (userId comes from token, not parameter)
  async getMyListingsViewsSummary(forceRefresh = false) {
    // Check cache first
    if (!forceRefresh) {
      const cached = this.getCachedSummary();
      if (cached) return cached;
    }

    try {
      const response = await api.get('/listing/my-summary');
      const summary = response.data;
      
      // Cache the result
      this.cacheSummary(summary);
      
      return summary;
    } catch (error) {
      console.error('Failed to fetch my views summary:', error);
      
      // Return cached data if available, even if expired
      const cached = this.getCachedSummary(true);
      if (cached) {
        return { ...cached, isStale: true };
      }
      
      throw error;
    }
  }

  // Cache management
  cacheSummary(data) {
    try {
      const cacheData = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Failed to cache summary:', error);
    }
  }

  getCachedSummary(ignoreExpiry = false) {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const isExpired = Date.now() - timestamp > CACHE_DURATION;

      if (isExpired && !ignoreExpiry) return null;

      return data;
    } catch (error) {
      console.error('Failed to get cached summary:', error);
      return null;
    }
  }

  clearCache() {
    localStorage.removeItem(CACHE_KEY);
  }
}

export default new ListingViewsService();