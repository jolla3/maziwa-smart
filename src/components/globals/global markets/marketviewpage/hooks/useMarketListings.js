// marketviewpage/hooks/useMarketListings.js
import { useState, useEffect, useCallback, useContext } from "react";
import { AuthContext } from "../../../../PrivateComponents/AuthContext";
import { marketApi } from "../api/market.api";

const INITIAL_FILTERS = {
  species: "",
  gender: "",
  stage: "",
  breed: "",
  pregnant: "",
  minPrice: "",
  maxPrice: "",
  sort: "createdAt",
};

export default function useMarketListings() {
  const { token } = useContext(AuthContext);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [showFilters, setShowFilters] = useState(false);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters };
      if (searchQuery) params.search = searchQuery;

      const data = await marketApi.fetchListings(params, token);

      if (data.success) {
        setListings(data.listings);
        localStorage.setItem("cachedListings", JSON.stringify(data.listings));
      }
    } catch (err) {
      console.error("❌ Fetch market error:", err);
      const cached = localStorage.getItem("cachedListings");
      if (cached) setListings(JSON.parse(cached));
    } finally {
      setLoading(false);
    }
  }, [filters, token, searchQuery]);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchListings();
    }, 300);
    return () => clearTimeout(delay);
  }, [fetchListings]);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    setSearchQuery("");
  }, []);

  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  return {
    listings,
    loading,
    searchQuery,
    setSearchQuery,
    filters,
    updateFilter,
    clearFilters,
    showFilters,
    toggleFilters,
  };
}