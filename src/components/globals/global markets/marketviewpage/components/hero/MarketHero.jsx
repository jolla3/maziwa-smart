// marketviewpage/components/hero/MarketHero.jsx
import React from "react";
import { motion } from "framer-motion";
import { Box, InputBase, Paper } from "@mui/material";
import { Search, Sparkles } from "lucide-react";

export default function MarketHero({ searchQuery, onSearchChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 4,
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          padding: "3rem 2rem",
          mb: 4,
          boxShadow: 3,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            opacity: 0.25,
          }}
        >
          <Sparkles size={200} color="white" />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            alignItems: "center",
            gap: 3,
            position: "relative",
          }}
        >
          <Box sx={{ flex: 1, color: "white" }}>
            <Box
              component="h1"
              sx={{
                fontSize: { xs: "2rem", md: "3rem" },
                fontWeight: 800,
                mb: 2,
                color: "white",
              }}
            >
              🐄 Premium Livestock Marketplace
            </Box>
            <Box
              component="p"
              sx={{
                fontSize: { xs: "1.1rem", md: "1.25rem" },
                opacity: 0.9,
                color: "white",
                mb: 0,
              }}
            >
              Discover quality livestock from verified sellers across Kenya
            </Box>
          </Box>

          <Box sx={{ flex: 1, width: "100%" }}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                p: 0.5,
                backgroundColor: "white",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", px: 2 }}>
                <Search size={24} color="#0f172a" />
                <InputBase
                  placeholder="Search livestock, breeds, location..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  sx={{
                    ml: 2,
                    flex: 1,
                    fontSize: "1.1rem",
                    py: 1.5,
                    color: "#0f172a",
                    "& ::placeholder": {
                      color: "#0f172a",
                      opacity: 0.6,
                    },
                  }}
                />
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
}