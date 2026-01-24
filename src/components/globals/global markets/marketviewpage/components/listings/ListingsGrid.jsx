// marketviewpage/components/listings/ListingsGrid.jsx
import React from "react";
import { Box, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import ListingCard from "./ListingCard";
import EmptyState from "../states/EmptyState";

export default function ListingsGrid({ listings, searchQuery, onClearFilters, onClearSearch }) {
  return (
    <>
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" fontWeight="bold">
          {listings.length} Available Listing{listings.length !== 1 ? "s" : ""}
        </Typography>
        {searchQuery && (
          <Typography variant="body2" color="text.secondary">
            Searching for: <strong>"{searchQuery}"</strong>
          </Typography>
        )}
      </Box>

      {listings.length > 0 ? (
        <motion.div layout>
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
            <AnimatePresence>
              {listings.map((listing, idx) => (
                <motion.div
                  key={listing._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <ListingCard listing={listing} />
                </motion.div>
              ))}
            </AnimatePresence>
          </Box>
        </motion.div>
      ) : (
        <EmptyState onClearFilters={onClearFilters} onClearSearch={onClearSearch} />
      )}
    </>
  );
}