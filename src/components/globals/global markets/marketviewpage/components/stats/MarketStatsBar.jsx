// marketviewpage/components/stats/MarketStatsBar.jsx
import React from "react";
import { Box, Card, CardContent, Typography, Button } from "@mui/material";
import { ShoppingBag, TrendingUp, Heart, Filter } from "lucide-react";
import { motion } from "framer-motion";

const StatCard = ({ icon: Icon, value, label, color }) => (
  <Card
    elevation={0}
    sx={{
      borderRadius: 4,
      height: "100%",
      boxShadow: 1,
    }}
  >
    <CardContent sx={{ display: "flex", alignItems: "center" }}>
      <Box
        sx={{
          backgroundColor: `${color}15`,
          borderRadius: 3,
          p: 1.5,
          mr: 2,
        }}
      >
        <Icon size={28} color={color} />
      </Box>
      <Box>
        <Typography variant="h4" fontWeight="bold" color={color}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

export default function MarketStatsBar({
  listingsCount,
  trendingCount,
  basketCount,
  wishlistCount,
  onToggleFilters,
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 2,
          mb: 4,
        }}
      >
        <StatCard
          icon={ShoppingBag}
          value={listingsCount}
          label="Active Listings"
          color="#667eea"
        />
        <StatCard
          icon={TrendingUp}
          value={trendingCount}
          label="Trending Now"
          color="#10b981"
        />
        <StatCard
          icon={Heart}
          value={wishlistCount}
          label="Wishlist"
          color="#ef4444"
        />

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            fullWidth
            variant="contained"
            sx={{
              height: "100%",
              borderRadius: 4,
              background:
                "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              boxShadow: 1,
              textTransform: "none",
              fontSize: "1rem",
            }}
            onClick={onToggleFilters}
            startIcon={<Filter />}
          >
            Advanced Filters
          </Button>
        </motion.div>
      </Box>
    </motion.div>
  );
}

