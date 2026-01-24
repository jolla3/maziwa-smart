// marketviewpage/components/trending/TrendingListings.jsx
import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import ListingCard from "../listings/ListingCard";

export default function TrendingListings({ listings }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                backgroundColor: "#ef444415",
                borderRadius: 3,
                p: 1,
                mr: 2,
                display: "inline-flex",
              }}
            >
              <TrendingUp size={24} color="#ef4444" />
            </Box>
            <Typography variant="h5" fontWeight="bold">
              Trending Listings
            </Typography>
          </Box>
          <Chip
            label="Hot Deals 🔥"
            color="error"
            sx={{
              px: 2,
              py: 2.5,
              fontSize: "0.9rem",
              animation: "pulse 2s infinite",
              "@keyframes pulse": {
                "0%, 100%": { opacity: 1 },
                "50%": { opacity: 0.7 },
              },
            }}
          />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 3,
          }}
        >
          {listings.map((listing, idx) => (
            <motion.div
              key={listing._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <ListingCard listing={listing} isTrending />
            </motion.div>
          ))}
        </Box>
      </Box>
    </motion.div>
  );
}