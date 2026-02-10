import { useContext } from "react";
import { AuthContext } from "../../../../PrivateComponents/AuthContext";
import { marketApi } from "../api/market.api";
import { useApiCache } from "../../../../../hooks/useApiCache"; // ✅ Import the hook

export default function useTrending() {
  const { token, user } = useContext(AuthContext);

  // ✅ Use useApiCache for trending listings
  const { data: trendingListings } = useApiCache(
    `cache_${user?.id}_market_trending`, // Unique key per user
    async () => {
      const data = await marketApi.fetchTrending(token);
      if (data.success) {
        // Remove duplicates AND filter out invalid listings
        const validListings = data.listings.filter(item => 
          item._id && 
          item.title && 
          item.price > 0
        );
        
        const uniqueListings = Array.from(
          new Map(validListings.map(item => [item._id, item])).values()
        );
        
        return uniqueListings;
      }
      return [];
    },
    [user?.id, token] // Stable dependencies
  );

  return { trendingListings: trendingListings || [] }; // ✅ Safety check
}