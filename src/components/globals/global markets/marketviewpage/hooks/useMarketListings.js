import { useState, useEffect, useCallback, useContext, useMemo } from "react";
import { AuthContext } from "../../../../PrivateComponents/AuthContext";
import { marketApi } from "../api/market.api";
import { useApiCache } from "../../../../../hooks/useApiCache"; // ✅ Import the hook

const INITIAL_FILTERS = {
  species: "",
  gender: "",
  stage: "",
  pregnant: "",
  minPrice: "",
  maxPrice: "",
  sort: "createdAt",
};

export default function useMarketListings() {
  const { token, user } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  // ✅ Use useApiCache for listings (replaces custom fetch logic)
  const { data: allListings, loading, error, clearCache } = useApiCache(
    `cache_${user?.id}_market_listings`, // Unique key per user
    async () => {
      const data = await marketApi.fetchListings({}, token);
      if (data.success) {
        // Remove duplicates AND filter out invalid listings
        const validListings = data.listings.filter(item => 
          item && item._id && item.title && item.price > 0 // ✅ Extra check for undefined items
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

  const filteredListings = useMemo(() => {
    let list = allListings || []; // ✅ Safety check

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (l) =>
          l.title?.toLowerCase().includes(q) ||
          l.location?.toLowerCase().includes(q) ||
          l.animal_id?.species?.toLowerCase().includes(q) ||
          l.animal_id?.breed?.toLowerCase().includes(q)
      );
    }

    if (filters.species) {
      list = list.filter((l) => l.animal_id?.species === filters.species);
    }

    if (filters.gender) {
      list = list.filter((l) => l.animal_id?.gender === filters.gender);
    }

    if (filters.stage) {
      list = list.filter((l) => l.animal_id?.stage === filters.stage);
    }

    if (filters.pregnant) {
      const isPregnant = filters.pregnant === "true";
      list = list.filter(
        (l) => (l.animal_id?.status === "pregnant") === isPregnant
      );
    }

    if (filters.minPrice) {
      list = list.filter((l) => l.price >= Number(filters.minPrice));
    }

    if (filters.maxPrice) {
      list = list.filter((l) => l.price <= Number(filters.maxPrice));
    }

    switch (filters.sort) {
      case "price_asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "views_desc":
        list.sort((a, b) => (b.views?.count || 0) - (a.views?.count || 0));
        break;
      default:
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return list;
  }, [allListings, searchQuery, filters]);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setFilters(INITIAL_FILTERS);
  }, []);

  return {
    listings: filteredListings,
    loading,
    error, // ✅ Now available for error handling
    searchQuery,
    setSearchQuery,
    filters,
    updateFilter,
    clearFilters,
    refetch: clearCache, // ✅ To manually refresh if needed
  };
} 