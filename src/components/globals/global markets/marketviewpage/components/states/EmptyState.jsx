// marketviewpage/components/states/EmptyState.jsx
import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { Search } from "lucide-react";

export default function EmptyState({ onClearFilters }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 8,
        textAlign: "center",
        border: "2px dashed #e5e7eb",
        borderRadius: 4,
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          backgroundColor: "#f1f5f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mx: "auto",
          mb: 3,
        }}
      >
        <Search size={40} color="#64748b" />
      </Box>
      
      <Typography variant="h5" fontWeight={700} color="text.primary" gutterBottom>
        No Listings Found
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: "auto" }}>
        We couldn't find any livestock matching your criteria. Try adjusting your filters or search terms.
      </Typography>
      
      <Button
        variant="contained"
        size="large"
        onClick={onClearFilters}
        sx={{
          px: 4,
          py: 1.5,
        }}
      >
        Clear All Filters
      </Button>
    </Paper>
  );
}