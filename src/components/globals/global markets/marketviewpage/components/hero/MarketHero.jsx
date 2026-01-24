// marketviewpage/components/hero/ModernHero.jsx
import React from "react";
import { Box, Container, Typography, InputBase, Paper, IconButton } from "@mui/material";
import { Search, SlidersHorizontal } from "lucide-react";

export default function ModernHero({ searchQuery, onSearchChange, onFilterClick }) {
  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        pt: 6,
        pb: 8,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative circles */}
      <Box
        sx={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -50,
          left: -50,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h2"
            sx={{
              color: "white",
              fontWeight: 800,
              mb: 2,
            }}
          >
            Premium Livestock Marketplace
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: "rgba(255,255,255,0.9)",
              fontWeight: 400,
              maxWidth: 600,
              mx: "auto",
            }}
          >
            Find quality livestock from verified sellers across Kenya
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            maxWidth: 700,
            mx: "auto",
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", p: 1 }}>
            <Search size={24} color="#64748b" style={{ margin: "0 12px" }} />
            <InputBase
              fullWidth
              placeholder="Search by species, breed, location..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              sx={{
                flex: 1,
                fontSize: "1.1rem",
                py: 1.5,
                color: "text.primary",
              }}
            />
            <IconButton
              onClick={onFilterClick}
              sx={{
                backgroundColor: "primary.main",
                color: "white",
                mx: 1,
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              }}
            >
              <SlidersHorizontal size={20} />
            </IconButton>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
