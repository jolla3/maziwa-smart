// marketviewpage/hooks/useTrending.js
import { useState, useEffect, useCallback, useContext } from "react";
import { AuthContext } from "../../../../PrivateComponents/AuthContext";
import { marketApi } from "../api/market.api";

export default function useTrending() {
  const { token } = useContext(AuthContext);
  const [trendingListings, setTrendingListings] = useState([]);

  const fetchTrending = useCallback(async () => {
    try {
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
        
        setTrendingListings(uniqueListings);
      }
    } catch (err) {
      console.error("Fetch trending error:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchTrending();
  }, [fetchTrending]);

  return { trendingListings };
}