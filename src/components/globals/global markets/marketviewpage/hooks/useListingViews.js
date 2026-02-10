import { useContext } from "react";
import { AuthContext } from "../../../../PrivateComponents/AuthContext";
import { marketApi } from "../api/market.api";
import { useApiCache } from "../../../../../hooks/useApiCache"; // Ensure correct path

export default function useListingViews(listingId) {
  const { token, user } = useContext(AuthContext);

  // ✅ Use useApiCache for views per listing
  const { data: viewsData, loading, error } = useApiCache(
    `cache_${user?.id}_listing_views_${listingId}`, // Unique key per user and listing
    async () => {
    //   console.log(`Fetching views for listing ${listingId}`); // ✅ Debug log
      if (!listingId) {
        console.error("No listingId provided to useListingViews");
        return { count: 0 };
      }
      try {
        const data = await marketApi.getListingViews(listingId, token);
        // console.log(`Views data for ${listingId}:`, data); // ✅ Debug log
        if (data.success) {
          return data.views || { count: 0 }; // Ensure it returns an object with count
        }
        return { count: 0 };
      } catch (err) {
        console.error(`Error fetching views for ${listingId}:`, err);
        return { count: 0 };
      }
    },
    [listingId, user?.id, token] // Stable dependencies
  );

  return { views: viewsData?.count || 0, loading, error };
}