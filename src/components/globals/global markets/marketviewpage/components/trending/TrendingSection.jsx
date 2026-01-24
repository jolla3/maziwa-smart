// marketviewpage/components/trending/TrendingSection.jsx
import React from "react";
import { Box, Typography, Chip, Grid } from "@mui/material";
import { TrendingUp } from "lucide-react";
import ProductCard from "../listings/ProductCard";

export default function TrendingSection({ listings }) {
  return (
    <Box sx={{ mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              backgroundColor: "#ef444415",
              borderRadius: 2,
              p: 1,
            }}
          >
            <TrendingUp size={24} color="#ef4444" />
          </Box>
          <Typography variant="h5" fontWeight="bold" sx={{ color: "#000" }}>
            Trending Listings
          </Typography>
        </Box>
        <Chip
          label="🔥 Hot Deals"
          color="error"
          sx={{ fontWeight: "bold" }}
        />
      </Box>

      <Grid container spacing={3}>
        {listings.map((listing) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={listing._id}>
            <ProductCard listing={listing} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}