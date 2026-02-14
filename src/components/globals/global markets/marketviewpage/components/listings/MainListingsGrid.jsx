import React from "react";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import { AlertCircle } from "lucide-react";
import ProductCard from "./ListingCard"; // Assuming ListingCard is your ProductCard component

export default function MainListingsGrid({ listings, onClearFilters }) {
  if (listings.length === 0) {
    return (
      <Card
        sx={{
          p: 6,
          textAlign: "center",
          backgroundColor: "#ffffff",
          border: "1px solid #e5e7eb",
        }}
      >
        <CardContent>
          <AlertCircle size={64} color="#9ca3af" style={{ marginBottom: 16 }} />
          <Typography variant="h5" fontWeight="bold" sx={{ color: "#000", mb: 2 }}>
            No Listings Found
          </Typography>
          <Typography variant="body1" sx={{ color: "#6b7280", mb: 3 }}>
            Try adjusting your filters or search query
          </Typography>
          <Button
            variant="contained"
            onClick={onClearFilters}
            sx={{
              textTransform: "none",
              backgroundColor: "#667eea",
              "&:hover": { backgroundColor: "#5568d3" },
            }}
          >
            Clear All Filters
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{ color: "#000", mb: 3 }}
      >
        {listings.length} Available Listing{listings.length !== 1 ? "s" : ""}
      </Typography>

      {/* ✅ Adaptive Flexbox Grid: Cards fit naturally based on space */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3, // Spacing between cards
          justifyContent: "flex-start", // Align to start
        }}
      >
        {listings.map((listing) => (
          <Box
            key={listing._id}
            sx={{
              flex: "1 1 250px", // ✅ Min width 250px, grows to fill space
              maxWidth: "300px", // Optional max width to prevent too wide
            }}
          >
            <ProductCard listing={listing} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}