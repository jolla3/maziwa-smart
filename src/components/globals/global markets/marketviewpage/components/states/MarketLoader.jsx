// marketviewpage/components/states/MarketLoader.jsx
import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function MarketLoader() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        py: 10,
      }}
    >
      <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />
      <Typography variant="body1" color="text.secondary">
        Loading amazing livestock...
      </Typography>
    </Box>
  );
}