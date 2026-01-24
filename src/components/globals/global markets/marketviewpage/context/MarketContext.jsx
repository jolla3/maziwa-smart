// marketviewpage/context/MarketContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { AuthContext } from "../../../../PrivateComponents/AuthContext";
import { marketApi } from "../api/market.api";

const MarketContext = createContext(null);

export const useMarket = () => {
  const ctx = useContext(MarketContext);
  if (!ctx) {
    throw new Error("useMarket must be used within MarketProvider");
  }
  return ctx;
};

export const MarketProvider = ({ children }) => {
  const { token } = useContext(AuthContext);

  const [allListings, setAllListings] = useState([]);
  const [trendingListings, setTrendingListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    species: "",
    gender: "",
    stage: "",
    pregnant: "",
    minPrice: "",
    maxPrice: "",
    sort: "createdAt",
  });

  const fetchMarketData = useCallback(async () => {
    setLoading(true);
    try {
      const [listingsRes, trendingRes] = await Promise.all([
        marketApi.fetchListings({}, token),
        marketApi.fetchTrending(token),
      ]);

      if (listingsRes?.success) {
        setAllListings(listingsRes.listings);
      }

      if (trendingRes?.success) {
        setTrendingListings(trendingRes.listings);
      }
    } catch (err) {
      console.error("Market fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setFilters({
      species: "",
      gender: "",
      stage: "",
      pregnant: "",
      minPrice: "",
      maxPrice: "",
      sort: "createdAt",
    });
  }, []);

  const filteredListings = useMemo(() => {
    let list = [...allListings];

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
        list.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      default:
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return list;
  }, [allListings, searchQuery, filters]);

  return (
    <MarketContext.Provider
      value={{
        loading,
        allListings,
        trendingListings,
        filteredListings,
        searchQuery,
        setSearchQuery,
        filters,
        setFilters,
        clearFilters,
        refetchMarket: fetchMarketData,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};