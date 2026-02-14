import { useContext } from "react";
import { AuthContext } from "../../../../PrivateComponents/AuthContext";
import { marketApi } from "../api/market.api";

export default function useListingViews(listingId) {
  const { token, user } = useContext(AuthContext);

  const incrementView = async () => {
    if (!user?.id) {
      return;
    }
    
    const viewedKey = `viewed_${user.id}_${listingId}`;
    if (localStorage.getItem(viewedKey)) {
      return;
    }
    
    try {
      await marketApi.incrementViews(listingId, token);
      localStorage.setItem(viewedKey, 'true');

      // Invalidate the market listings cache to force refresh
      const marketCacheKey = `cache_${user.id}_market_listings`; // Adjust if the key is different
      localStorage.removeItem(marketCacheKey);
    } catch (err) {
      console.error('Failed to increment view:', err);
    }
  };

  return { incrementView };
}