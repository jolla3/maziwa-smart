// marketviewpage/components/listings/MainListingsGrid.jsx
import React from "react";
import { Box, Typography, Grid, Card, CardContent, Button } from "@mui/material";
import { AlertCircle } from "lucide-react";
import ProductCard from "./ProductCard";

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