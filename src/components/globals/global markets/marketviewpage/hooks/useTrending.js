import { useContext } from "react";
import { AuthContext } from "../../../../PrivateComponents/AuthContext";
import { marketApi } from "../api/market.api";
import { useApiCache } from "../../../../../hooks/useApiCache"; // ✅ Import the hook

export default function useTrending() {
  const { token, user } = useContext(AuthContext);

  // ✅ Use useApiCache for trending listings
  const { data: trendingListings, forceRefresh } = useApiCache(
    `cache_${user?.id}_market_trending`, // Unique key per user
    async () => {
      const data = await marketApi.fetchTrending(token);
      if (data.success) {
        // ✅ Removed frontend validation - trust backend to send only valid listings
        // Keep duplicate removal for data consistency
        const uniqueListings = Array.from(
          new Map(data.listings.map(item => [item._id, item])).values()
        );
        
        return uniqueListings;
      }
      return [];
    },
    [user?.id, token] // Stable dependencies
  );

  return { trendingListings: trendingListings || [], forceRefresh }; // ✅ Added forceRefresh for manual refresh
}