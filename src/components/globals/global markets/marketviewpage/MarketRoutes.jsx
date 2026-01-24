// // marketviewpage/MarketViewPage.jsx
// import React from "react";
// import { Box } from "@mui/material";
// import { BasketProvider } from "./context/BasketContext";
// import { WishlistProvider } from "./context/WishlistContext";
// import MarketHero from "./components/hero/MarketHero";
// import MarketStatsBar from "./components/stats/MarketStatsBar";
// import MarketFiltersPanel from "./components/filters/MarketFiltersPanel";
// import TrendingListings from "./components/trending/TrendingListings";
// import ListingsGrid from "./components/listings/ListingsGrid";
// import MarketLoader from "./components/states/MarketLoader";
// import useMarketListings from "./hooks/useMarketListings";
// import useTrending from "./hooks/useTrending";

// export default function MarketViewPage() {
//   const {
//     listings,
//     loading,
//     searchQuery,
//     setSearchQuery,
//     filters,
//     updateFilter,
//     clearFilters,
//     showFilters,
//     toggleFilters,
//   } = useMarketListings();

//   const { trendingListings } = useTrending();

//   return (
//     <BasketProvider>
//       <WishlistProvider>
//         <Box
//           sx={{
//             minHeight: "100vh",
//             backgroundColor: "#f8f9fa",
//             px: 3,
//             py: 4,
//           }}
//         >
//           <MarketHero
//             searchQuery={searchQuery}
//             onSearchChange={setSearchQuery}
//           />

//           <MarketStatsBar
//             listingsCount={listings.length}
//             trendingCount={trendingListings.length}
//             onToggleFilters={toggleFilters}
//           />

//           <MarketFiltersPanel
//             show={showFilters}
//             filters={filters}
//             onFilterChange={updateFilter}
//             onClearFilters={clearFilters}
//             onClose={toggleFilters}
//           />

//           {trendingListings.length > 0 && (
//             <TrendingListings listings={trendingListings.slice(0, 4)} />
//           )}

//           {loading ? (
//             <MarketLoader />
//           ) : (
//             <ListingsGrid
//               listings={listings}
//               searchQuery={searchQuery}
//               onClearFilters={clearFilters}
//               onClearSearch={() => setSearchQuery("")}
//             />
//           )}
//         </Box>
//       </WishlistProvider>
//     </BasketProvider>
//   );
// }

// components/globals/global markets/marketviewpage/MarketViewPage.jsx
import React from "react"; 
import { ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import { BasketProvider } from "./context/BasketContext";
import { WishlistProvider } from "./context/WishlistContext";
import MainMarketView from "./pages/MainMarketView";
import WishlistPage from "./pages/WishlistPage";
import BasketPage from "./pages/BasketPage";
import PurchaseHistoryPage from "./pages/PurchaseHistoryPage";
import theme from "./theme";

function MarketContent() {
  return (
    <Routes>
      <Route index element={<MainMarketView />} />
      <Route path="wishlist" element={<WishlistPage />} />
      <Route path="basket" element={<BasketPage />} />
      <Route path="purchases" element={<PurchaseHistoryPage />} />
    </Routes>
  );
}

export default function MarketViewPage() {
  return (
    <ThemeProvider theme={theme}>
      <BasketProvider>
        <WishlistProvider>
          <MarketContent />
        </WishlistProvider>
      </BasketProvider>
    </ThemeProvider>
  );
}