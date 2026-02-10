import React, { createContext, useContext } from "react";
import useMarketListings from "../hooks/useMarketListings";
import useTrending from "../hooks/useTrending";

const MarketContext = createContext(null);

export const useMarket = () => {
  const ctx = useContext(MarketContext);
  if (!ctx) {
    throw new Error("useMarket must be used within MarketProvider");
  }
  return ctx;
};

export const MarketProvider = ({ children }) => {
  // ✅ Use the updated hooks (which now use useApiCache internally)
  const listingsData = useMarketListings();
  const { trendingListings } = useTrending();

  return (
    <MarketContext.Provider
      value={{
        ...listingsData, // Includes listings, loading, etc.
        trendingListings,
        refetchMarket: listingsData.refetch, // To refresh if needed
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};