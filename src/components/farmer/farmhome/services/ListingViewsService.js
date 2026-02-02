// farmhome/services/ListingViewsService.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE
const CACHE_KEY = 'seller_views_summary';
const CACHE_DURATION = 5 * 60 * 1000;

class ListingViewsService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
    });

    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async registerView(listingId) {
    try {
      await this.api.post(`/listing/views/${listingId}`);
      return { success: true };
    } catch (error) {
      console.error('Failed to register view:', error);
      return { success: false, error };
    }
  }

  async getListingViews(listingId) {
    try {
      const response = await this.api.get(`/listing/summary/${listingId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch listing views:', error);
      throw error;
    }
  }

  async getMyListingsViewsSummary(forceRefresh = false) {
    if (!forceRefresh) {
      const cached = this.getCachedSummary();
      if (cached) return cached;
    }

    try {
      const response = await this.api.get('/listing/my-summary');
      const summary = response.data;
      this.cacheSummary(summary);
      return summary;
    } catch (error) {
      console.error('Failed to fetch my views summary:', error);
      const cached = this.getCachedSummary(true);
      if (cached) {
        return { ...cached, isStale: true };
      }
      throw error;
    }
  }

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