// marketviewpage/components/stats/QuickStats.jsx
import React from "react";
import { Box, Card, CardContent, Typography, Grid } from "@mui/material";
import { ShoppingBag, Filter, TrendingUp } from "lucide-react";

export default function QuickStats({ totalListings, filteredCount, trendingCount }) {
  const stats = [
    {
      label: "Total Listings",
      value: totalListings,
      icon: ShoppingBag,
      color: "#667eea",
    },
    {
      label: "Filtered Results",
      value: filteredCount,
      icon: Filter,
      color: "#10b981",
    },
    {
      label: "Trending",
      value: trendingCount,
      icon: TrendingUp,
      color: "#ef4444",
    },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {stats.map((stat) => (
        <Grid item xs={12} sm={4} key={stat.label}>
          <Card
            sx={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
            }}
          >
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  backgroundColor: `${stat.color}15`,
                  borderRadius: 2,
                  p: 1.5,
                }}
              >
                <stat.icon size={24} color={stat.color} />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight="bold" sx={{ color: "#000" }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ color: "#6b7280" }}>
                  {stat.label}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}