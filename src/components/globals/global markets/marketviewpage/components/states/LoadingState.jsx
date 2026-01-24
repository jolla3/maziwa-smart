// marketviewpage/components/states/LoadingState.jsx
import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function LoadingState() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#ffffff",
      }}
    >
      <CircularProgress size={60} thickness={4} sx={{ mb: 3, color: "#667eea" }} />
      <Typography variant="h6" sx={{ color: "#000" }}>
        Loading livestock...
      </Typography>
    </Box>
  );
}