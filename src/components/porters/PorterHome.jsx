import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  useTheme,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Fade,
  Grow,
  useMediaQuery,
} from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import Header from "../scenes/Header";
import axios from "axios";
import { Outlet } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import DownloadMonthlyReport from "../scenes/DownloadReport";
// ✅ Import the AuthContext
import { AuthContext } from "../../components/PrivateComponents/AuthContext";

const PorterHome = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // ✅ Get the token and user from the context
  const { token, user } = useContext(AuthContext);

  const [stats, setStats] = useState({
    totalLitresCollected: 0,
    litresCollectedToday: 0,
    totalRecords: 0,
    todayRecords: 0,
    recentCollections: [],
    dailyLitresTrend: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        // ✅ Use the token from the context instead of localStorage
        if (!token) {
          setError("Authentication token not found.");
          setLoading(false);
          return;
        }

        const { data } = await axios.get(
          "https://maziwasmart.onrender.com/api/porterstats",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStats({
          totalLitresCollected: data.totalLitresCollected || 0,
          litresCollectedToday: data.litresCollectedToday || 0,
          totalRecords: data.totalRecords || 0,
          todayRecords: data.todayRecords || 0,
          recentCollections: data.recentCollections || [],
          dailyLitresTrend: data.dailyLitresTrend || [],
        });
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again.");
        } else {
          setError("Failed to load dashboard stats.");
        }
      } finally {
        setLoading(false);
      }
    };

    // ✅ Re-run fetchStats whenever the token changes
    fetchStats();
  }, [token]);

  // Enhanced StatCard component
  const StatCard = ({ title, value, subtitle, icon, trend, delay = 0 }) => (
    <Grow in={!loading} style={{ transformOrigin: "0 0 0" }} timeout={1000 + delay}>
      <Card
        sx={{
          background: `linear-gradient(135deg, ${colors.primary[400]} 0%, ${colors.primary[500]} 100%)`,
          border: `1px solid ${colors.primary[300]}`,
          borderRadius: "16px",
          overflow: "hidden",
          position: "relative",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: `0 8px 32px ${colors.primary[700]}40`,
            border: `1px solid ${colors.greenAccent[500]}`,
          },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: `linear-gradient(90deg, ${colors.greenAccent[500]}, ${colors.blueAccent[500]})`,
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography
                variant="h3"
                fontWeight="700"
                color={colors.grey[100]}
                sx={{ mb: 1 }}
              >
                {value.toLocaleString()}
              </Typography>
              <Typography variant="h6" color={colors.grey[200]} sx={{ mb: 0.5 }}>
                {title}
              </Typography>
              <Typography
                variant="body2"
                color={colors.greenAccent[400]}
                fontWeight="500"
              >
                {subtitle}
              </Typography>
              {trend && (
                <Box display="flex" alignItems="center" mt={1}>
                  <TrendingUpIcon
                    sx={{
                      color: colors.greenAccent[400],
                      fontSize: "16px",
                      mr: 0.5,
                    }}
                  />
                  <Typography
                    variant="caption"
                    color={colors.greenAccent[400]}
                    fontWeight="600"
                  >
                    {trend}
                  </Typography>
                </Box>
              )}
            </Box>
            <Box
              sx={{
                p: 2,
                borderRadius: "12px",
                background: `${colors.greenAccent[500]}20`,
                border: `1px solid ${colors.greenAccent[500]}30`,
              }}
            >
              {React.cloneElement(icon, {
                sx: {
                  color: colors.greenAccent[400],
                  fontSize: "32px",
                },
              })}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Grow>
  );

  // Loading component
  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress
          size={60}
          thickness={4}
          sx={{
            color: colors.greenAccent[400],
            mb: 3,
          }}
        />
        <Typography variant="h6" color={colors.grey[100]}>
          Loading dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box m="20px" sx={{ minHeight: "100vh" }}>
      {/* Header Section */}
      <Fade in timeout={800}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          mb={4}
        >
          <Header
            sx={{ color: colors.greenAccent[400] }}
            title="PORTER DASHBOARD"
            subtitle="Welcome to your porter dashboard"
          />
        </Box>
      </Fade>

      {/* Error Display */}
      {error && (
        <Fade in timeout={600}>
          <Box
            p={3}
            mb={3}
            borderRadius="12px"
            sx={{
              background: `${colors.redAccent[500]}20`,
              border: `1px solid ${colors.redAccent[500]}40`,
            }}
          >
            <Typography color={colors.redAccent[400]} textAlign="center">
              {error}
            </Typography>
          </Box>
        </Fade>
      )}

      {/* Stats Grid */}
      {!error && (
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Today's Litres"
              value={stats.litresCollectedToday}
              subtitle="Milk collected today"
              icon={<LocalDrinkIcon />}
              delay={0}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Total Litres"
              value={stats.totalLitresCollected}
              subtitle="All-time milk collected"
              icon={<LocalDrinkIcon />}
              delay={200}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Today's Records"
              value={stats.todayRecords}
              subtitle="Records created today"
              icon={<PersonAddIcon />}
              delay={400}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Total Records"
              value={stats.totalRecords}
              subtitle="All-time records"
              icon={<PersonAddIcon />}
              delay={600}
            />
          </Grid>
        </Grid>
      )}

      {/* Charts and Activity Section */}
      {!error && (
        <Grid container spacing={3}>
          {/* Milk Collection Chart */}
          <Grid item xs={12} lg={8}>
            <Grow in timeout={1200}>
              <Card
                sx={{
                  background: colors.primary[400],
                  border: `1px solid ${colors.primary[300]}`,
                  borderRadius: "16px",
                  overflow: "hidden",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={3}
                  >
                    <Typography
                      variant="h5"
                      fontWeight="600"
                      color={colors.grey[100]}
                    >
                      Milk Collection Trends (Last 7 Days)
                    </Typography>
                    <DownloadOutlinedIcon
                      sx={{
                        fontSize: "24px",
                        color: colors.greenAccent[400],
                      }}
                    />
                  </Box>
                  <Box height="350px">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats.dailyLitresTrend}>
                        <defs>
                          <linearGradient
                            id="milkGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor={colors.greenAccent[400]}
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor={colors.greenAccent[400]}
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={colors.grey[600]}
                          opacity={0.3}
                        />
                        <XAxis
                          dataKey="date"
                          stroke={colors.grey[100]}
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke={colors.grey[100]}
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: colors.primary[500],
                            border: `1px solid ${colors.primary[300]}`,
                            borderRadius: "8px",
                            color: colors.grey[100],
                          }}
                          labelStyle={{ color: colors.grey[100] }}
                        />
                        <Area
                          type="monotone"
                          dataKey="totalLitres"
                          stroke={colors.greenAccent[400]}
                          fillOpacity={1}
                          fill="url(#milkGradient)"
                          strokeWidth={3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12} lg={4}>
            <Grow in timeout={1400}>
              <Card
                sx={{
                  background: colors.primary[400],
                  border: `1px solid ${colors.primary[300]}`,
                  borderRadius: "16px",
                  height: "100%",
                }}
              >
                <CardContent sx={{ p: 3, height: "100%" }}>
                  <Typography
                    variant="h5"
                    fontWeight="600"
                    color={colors.grey[100]}
                    mb={3}
                  >
                    Recent Activity
                  </Typography>
                  <Box
                    sx={{
                      maxHeight: "350px",
                      overflowY: "auto",
                      "&::-webkit-scrollbar": {
                        width: "6px",
                      },
                      "&::-webkit-scrollbar-track": {
                        background: colors.primary[500],
                        borderRadius: "3px",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        background: colors.greenAccent[500],
                        borderRadius: "3px",
                      },
                    }}
                  >
                    {stats.recentCollections.length === 0 ? (
                      <Typography
                        color={colors.grey[300]}
                        textAlign="center"
                        sx={{ mt: 4 }}
                      >
                        No recent activity found.
                      </Typography>
                    ) : (
                      stats.recentCollections.map((activity, index) => (
                        <Box
                          key={index}
                          mb={2}
                          p={2}
                          sx={{
                            borderRadius: "8px",
                            background: `${colors.primary[500]}80`,
                            border: `1px solid ${colors.primary[300]}`,
                            transition: "all 0.2s ease",
                            "&:hover": {
                              background: colors.primary[500],
                              border: `1px solid ${colors.greenAccent[500]}40`,
                            },
                          }}
                        >
                          <Typography
                            fontWeight="500"
                            color={colors.grey[100]}
                            fontSize="0.9rem"
                            mb={0.5}
                          >
                            {activity.farmer_name} collected {activity.litres}{" "}
                            litres
                          </Typography>
                          <Typography
                            fontSize="0.75rem"
                            color={colors.greenAccent[400]}
                            fontWeight="500"
                          >
                            {new Date(
                              activity.collection_date
                            ).toLocaleString()}
                          </Typography>
                        </Box>
                      ))
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
        </Grid>
      )}

      {/* Nested Routes */}
      <Box mt={4}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default PorterHome;