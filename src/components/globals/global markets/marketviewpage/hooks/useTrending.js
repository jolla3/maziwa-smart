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
        setTrendingListings(data.listings);
      }
    } catch (err) {
      console.error("❌ Trending fetch error:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchTrending();
  }, [fetchTrending]);

  return { trendingListings };
}