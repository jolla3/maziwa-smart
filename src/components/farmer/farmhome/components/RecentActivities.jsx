// farmhome/components/RecentActivities.jsx
import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
} from "@mui/material";
import { Droplet, Clock } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
} from "recharts";
import { COLORS } from "../utils/constants";
import { formatTimeAgo, formatNumber } from "../utils/formatters";

const RecentActivities = ({ activities }) => {
  const chartData =
    activities && activities.length > 0
      ? activities.map((a) => ({
          name: a.slot || "Unknown",
          litres: a.litres || 0,
        }))
      : [];

  if (!activities || activities.length === 0) {
    return (
      <Card
        sx={{
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          border: `2px solid ${COLORS.aqua.main}30`,
          height: "100%",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "12px",
                background: `linear-gradient(135deg, ${COLORS.aqua.main}20 0%, ${COLORS.aqua.main}10 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: COLORS.aqua.main,
              }}
            >
              <Clock size={24} />
            </Box>
            <Typography variant="h5" fontWeight="900" color="#000000">
              Recent Activities
            </Typography>
          </Box>

          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="200px"
          >
            <Typography color="#999999" fontStyle="italic">
              No recent activities recorded
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Grid container spacing={3}>
      {/* Chart Section */}
      <Grid item xs={12} md={6}>
        <Card
          sx={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            border: `2px solid ${COLORS.aqua.main}30`,
            height: "100%",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "12px",
                  background: `linear-gradient(135deg, ${COLORS.aqua.main}20 0%, ${COLORS.aqua.main}10 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: COLORS.aqua.main,
                }}
              >
                <Droplet size={24} />
              </Box>
              <Typography variant="h5" fontWeight="900" color="#000000">
                Milk Yield Overview
              </Typography>
            </Box>

            {/* Expanded chart container */}
            <Box
              sx={{
                width: "100%",
                height: 360,
                minHeight: 300,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ResponsiveContainer width="99%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#000000", fontSize: 12 }}
                    interval={0}
                  />
                  <YAxis tick={{ fill: "#000000", fontSize: 12 }} />
                  <ReTooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: `1px solid ${COLORS.aqua.main}30`,
                    }}
                  />
                  <Bar
                    dataKey="litres"
                    fill={COLORS.aqua.main}
                    radius={[8, 8, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Recent Activity Cards */}
      <Grid item xs={12} md={6}>
        <Card
          sx={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            border: `2px solid ${COLORS.aqua.main}30`,
            height: "100%",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: "12px",
                  background: `linear-gradient(135deg, ${COLORS.aqua.main}20 0%, ${COLORS.aqua.main}10 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: COLORS.aqua.main,
                }}
              >
                <Clock size={24} />
              </Box>
              <Typography variant="h5" fontWeight="900" color="#000000">
                Recent Activities
              </Typography>
            </Box>

            <Box
              sx={{
                maxHeight: "350px",
                overflowY: "auto",
                "&::-webkit-scrollbar": {
                  width: "6px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "#f0f0f0",
                  borderRadius: "3px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: COLORS.aqua.main,
                  borderRadius: "3px",
                  "&:hover": {
                    background: COLORS.aqua.dark,
                  },
                },
              }}
            >
              <Grid container spacing={2}>
                {activities.map((activity, index) => (
                  <Grid item xs={12} sm={6} md={4} key={`${activity.date}-${index}`}>
                    <Box
                      sx={{
                        mb: 2,
                        p: 2.5,
                        borderRadius: "12px",
                        backgroundColor: "#f8f9fa",
                        border: "1px solid #e0e0e0",
                        height: "100%",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          backgroundColor: `${COLORS.aqua.main}08`,
                          border: `1px solid ${COLORS.aqua.main}30`,
                          transform: "translateY(-3px)",
                        },
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={2} mb={1.5}>
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: "10px",
                            background: `linear-gradient(135deg, ${COLORS.aqua.main} 0%, ${COLORS.aqua.dark} 100%)`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#ffffff",
                            flexShrink: 0,
                          }}
                        >
                          <Droplet size={18} />
                        </Box>
                        <Box flex={1}>
                          <Typography
                            variant="body1"
                            fontWeight="700"
                            color="#000000"
                            noWrap
                          >
                            {formatNumber(activity.litres)} litres
                          </Typography>
                        </Box>
                        <Chip
                          label={activity.slot || "Unknown"}
                          size="small"
                          sx={{
                            backgroundColor: COLORS.green.main,
                            color: "#ffffff",
                            fontWeight: 700,
                            fontSize: "0.7rem",
                          }}
                        />
                      </Box>

                      {activity.porter && (
                        <Typography
                          variant="caption"
                          color="#666666"
                          fontWeight="600"
                          display="block"
                          mb={0.5}
                        >
                          Porter: {activity.porter.name} ({activity.porter.phone})
                        </Typography>
                      )}

                      <Typography
                        variant="caption"
                        color="#999999"
                        display="flex"
                        alignItems="center"
                        gap={0.5}
                      >
                        <Clock size={12} />
                        {formatTimeAgo(activity.date)}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default React.memo(RecentActivities);
