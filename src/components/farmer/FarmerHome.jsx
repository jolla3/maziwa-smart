import React, { useEffect, useState, useContext, useMemo, useCallback } from "react";
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
  Chip,
  Alert,
  Skeleton,
  IconButton,
  Tooltip,
} from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PetsIcon from "@mui/icons-material/Pets";
import ScienceIcon from "@mui/icons-material/Science";
import WarningIcon from "@mui/icons-material/Warning";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import RefreshIcon from "@mui/icons-material/Refresh";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import Header from "../scenes/Header";
import axios from "axios";
import { Outlet } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import DownloadMonthlyReport from "../scenes/DownloadReport";
import { AuthContext } from "../../components/PrivateComponents/AuthContext";

// Constants
const API_BASE_URL = process.env.REACT_APP_API_BASE
const SLOT_COLORS = ["#4ade80", "#3b82f6", "#ef4444", "#f59e0b"];
const CHART_HEIGHT = 400;
const REFRESH_INTERVAL = 300000; // 5 minutes

// Custom hook for dashboard data
const useDashboardData = (token) => {
  const [dashboardData, setDashboardData] = useState({
    farmer: {
      code: "",
      name: "",
      email: "",
      phone: "",
      start_date: null,
    },
    stats: {
      total_milk: 0,
      milk_by_slot: {},
      cows: 0,
      breeds: 0,
      inseminations: 0,
      anomalies: 0,
      managers: [],
    },
    recent_activities: [],
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchDashboardData = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);
    
    try {
      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const { data } = await axios.get(`${API_BASE_URL}/farmerdash`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000, // 10 second timeout
      });
      
      setDashboardData(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      
      let errorMessage = "Failed to load dashboard data.";
      if (err.message.includes("token")) {
        errorMessage = "Authentication token not found.";
      } else if (err.response?.status === 401) {
        errorMessage = "Session expired. Please log in again.";
      } else if (err.response?.status === 403) {
        errorMessage = "Access denied: Only farmers can view this dashboard.";
      } else if (err.code === "ECONNABORTED") {
        errorMessage = "Request timeout. Please check your connection.";
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDashboardData();

    // Set up auto-refresh
    const interval = setInterval(() => {
      if (token) fetchDashboardData(false);
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [fetchDashboardData, token]);

  return { dashboardData, loading, error, fetchDashboardData, lastUpdated };
};

const FarmerHome = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { token, user } = useContext(AuthContext);
  
  const { dashboardData, loading, error, fetchDashboardData, lastUpdated } = useDashboardData(token);

  // Memoized calculations
  const daysSinceStart = useMemo(() => {
    return dashboardData.farmer.start_date 
      ? Math.ceil((new Date() - new Date(dashboardData.farmer.start_date)) / (1000 * 60 * 60 * 24))
      : 0;
  }, [dashboardData.farmer.start_date]);

  const milkBySlotData = useMemo(() => {
    const slotData = dashboardData.stats.milk_by_slot;
    if (!slotData || typeof slotData !== 'object') {
      return [];
    }
    
    return Object.entries(slotData)
      .filter(([slot, litres]) => slot && litres !== undefined && litres !== null)
      .map(([slot, litres]) => ({
        slot: slot.charAt(0).toUpperCase() + slot.slice(1),
        litres: Number(litres) || 0,
      }))
      .sort((a, b) => a.slot.localeCompare(b.slot));
  }, [dashboardData.stats.milk_by_slot]);

  // Enhanced StatCard component with better error handling and animations
  const StatCard = React.memo(({ 
    title, 
    value, 
    subtitle, 
    icon, 
    trend, 
    delay = 0, 
    color = "greenAccent",
    onClick
  }) => (
    <Grow in={!loading} style={{ transformOrigin: "0 0 0" }} timeout={1000 + delay}>
      <Card
        onClick={onClick}
        sx={{
          background: `linear-gradient(135deg, ${colors.primary[400]} 0%, ${colors.primary[500]} 100%)`,
          border: `1px solid ${colors.primary[300]}`,
          borderRadius: "16px",
          overflow: "hidden",
          position: "relative",
          cursor: onClick ? "pointer" : "default",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: `0 8px 32px ${colors.primary[700]}40`,
            border: `1px solid ${colors[color][500]}`,
          },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: `linear-gradient(90deg, ${colors[color][500]}, ${colors.blueAccent[500]})`,
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant="h3"
                fontWeight="700"
                color={colors.grey[100]}
                sx={{ mb: 1 }}
                noWrap
              >
                {typeof value === 'number' ? value.toLocaleString() : value}
              </Typography>
              <Typography variant="h6" color={colors.grey[200]} sx={{ mb: 0.5 }} noWrap>
                {title}
              </Typography>
              <Typography
                variant="body2"
                color={colors[color][400]}
                fontWeight="500"
                noWrap
              >
                {subtitle}
              </Typography>
              {trend && (
                <Box display="flex" alignItems="center" mt={1}>
                  <TrendingUpIcon
                    sx={{
                      color: colors[color][400],
                      fontSize: "16px",
                      mr: 0.5,
                    }}
                  />
                  <Typography
                    variant="caption"
                    color={colors[color][400]}
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
                background: `${colors[color][500]}20`,
                border: `1px solid ${colors[color][500]}30`,
                flexShrink: 0,
              }}
            >
              {React.cloneElement(icon, {
                sx: {
                  color: colors[color][400],
                  fontSize: "32px",
                },
              })}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Grow>
  ));

  // Loading skeleton component
  const StatCardSkeleton = () => (
    <Card
      sx={{
        background: colors.primary[400],
        border: `1px solid ${colors.primary[300]}`,
        borderRadius: "16px",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" height={40} sx={{ bgcolor: colors.grey[700] }} />
            <Skeleton variant="text" width="80%" height={24} sx={{ bgcolor: colors.grey[700] }} />
            <Skeleton variant="text" width="70%" height={20} sx={{ bgcolor: colors.grey[700] }} />
          </Box>
          <Skeleton variant="circular" width={64} height={64} sx={{ bgcolor: colors.grey[700] }} />
        </Box>
      </CardContent>
    </Card>
  );

  // Enhanced refresh handler
  const handleRefresh = useCallback(() => {
    fetchDashboardData(true);
  }, [fetchDashboardData]);

  // Loading component with better UX
  if (loading && !lastUpdated) {
    return (
      <Box m="20px" sx={{ minHeight: "100vh" }}>
        <Fade in timeout={800}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            mb={4}
          >
            <Header
              title="FARMER DASHBOARD"
              subtitle="Loading your dashboard..."
            />
          </Box>
        </Fade>

        <Grid container spacing={3} mb={4}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} lg={2} key={index}>
              <StatCardSkeleton />
            </Grid>
          ))}
        </Grid>

        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="300px"
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
            Loading farmer dashboard...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box m="20px" sx={{ minHeight: "100vh" }}>
      {/* Header Section with Refresh */}
      <Fade in timeout={800}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          mb={4}
        >
          <Header
            title="FARMER DASHBOARD"
            subtitle={`Welcome ${dashboardData.farmer.name || 'Farmer'} (${dashboardData.farmer.code})`}
          />
          <Box display="flex" gap={2} alignItems="center">
            {lastUpdated && (
              <Typography variant="caption" color={colors.grey[300]}>
                Last updated: {lastUpdated.toLocaleTimeString()}
              </Typography>
            )}
            <Tooltip title="Refresh Dashboard">
              <IconButton
                onClick={handleRefresh}
                disabled={loading}
                sx={{
                  color: colors.greenAccent[400],
                  "&:hover": { bgcolor: `${colors.greenAccent[400]}20` }
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Fade>

      {/* Error Display with better UX */}
      {error && (
        <Fade in timeout={600}>
          <Alert
            severity="error"
            sx={{
              mb: 3,
              backgroundColor: `${colors.redAccent[500]}20`,
              color: colors.redAccent[400],
              border: `1px solid ${colors.redAccent[500]}40`,
              borderRadius: "12px",
            }}
            action={
              <IconButton
                color="inherit"
                size="small"
                onClick={handleRefresh}
              >
                <RefreshIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {error}
          </Alert>
        </Fade>
      )}

      {/* Main Stats Grid */}
      {!error && (
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} lg={2}>
            <StatCard
              title="Total Milk"
              value={dashboardData.stats.total_milk}
              subtitle="Total litres collected"
              icon={<LocalDrinkIcon />}
              delay={0}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={2}>
            <StatCard
              title="Cows"
              value={dashboardData.stats.cows}
              subtitle="Total cows registered"
              icon={<PetsIcon />}
              delay={200}
              color="blueAccent"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={2}>
            <StatCard
              title="Breeds"
              value={dashboardData.stats.breeds}
              subtitle="Cow breeds recorded"
              icon={<ScienceIcon />}
              delay={400}
              color="yellowAccent"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={2}>
            <StatCard
              title="Inseminations"
              value={dashboardData.stats.inseminations}
              subtitle="Total insemination records"
              icon={<PersonAddIcon />}
              delay={600}
              color="greenAccent"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={2}>
            <StatCard
              title="Anomalies"
              value={dashboardData.stats.anomalies}
              subtitle="Milk anomalies detected"
              icon={<WarningIcon />}
              delay={800}
              color="redAccent"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={2}>
            <StatCard
              title="Days Active"
              value={daysSinceStart}
              subtitle="Since first record"
              icon={<TrendingUpIcon />}
              delay={1000}
              color="greenAccent"
            />
          </Grid>
        </Grid>
      )}

      {/* Charts and Activity Section */}
      {!error && (
        <Grid container spacing={3}>
          {/* Milk by Time Slot Chart */}
          <Grid item xs={12} lg={8}>
            <Grow in timeout={1400}>
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
                      Milk Collection by Time Slot
                    </Typography>
                    <DownloadOutlinedIcon
                      sx={{
                        fontSize: "24px",
                        color: colors.greenAccent[400],
                        cursor: "pointer",
                      }}
                    />
                  </Box>
                  <Box height={CHART_HEIGHT}>
                    {milkBySlotData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={milkBySlotData}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={colors.grey[600]}
                            opacity={0.3}
                          />
                          <XAxis
                            dataKey="slot"
                            stroke={colors.grey[100]}
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: colors.grey[100] }}
                          />
                          <YAxis
                            stroke={colors.grey[100]}
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: colors.grey[100] }}
                          />
                          <RechartsTooltip
                            content={({ active, payload, label }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <Box
                                    sx={{
                                      backgroundColor: colors.primary[500],
                                      border: `1px solid ${colors.primary[300]}`,
                                      borderRadius: "8px",
                                      padding: "12px",
                                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                    }}
                                  >
                                    <Typography
                                      variant="body2"
                                      color={colors.grey[100]}
                                      fontWeight="600"
                                      mb={0.5}
                                    >
                                      {`${label} Slot`}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color={colors.greenAccent[400]}
                                      fontWeight="500"
                                    >
                                      {`Milk Collected: ${payload[0].value} litres`}
                                    </Typography>
                                  </Box>
                                );
                              }
                              return null;
                            }}
                          />
                          <Bar
                            dataKey="litres"
                            fill={colors.greenAccent[400]}
                            radius={[4, 4, 0, 0]}
                            stroke={colors.greenAccent[500]}
                            strokeWidth={1}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        height="100%"
                      >
                        <Typography color={colors.grey[300]}>
                          No milk collection data available
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grow>
          </Grid>

          {/* Recent Activities */}
          <Grid item xs={12} lg={4}>
            <Grow in timeout={1600}>
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
                    Recent Activities
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
                    {dashboardData.recent_activities.length === 0 ? (
                      <Typography
                        color={colors.grey[300]}
                        textAlign="center"
                        sx={{ mt: 4 }}
                      >
                        No recent activities found.
                      </Typography>
                    ) : (
                      dashboardData.recent_activities.map((activity, index) => (
                        <Box
                          key={`${activity.date}-${index}`}
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
                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography
                              fontWeight="500"
                              color={colors.grey[100]}
                              fontSize="0.9rem"
                            >
                              {activity.litres} litres
                            </Typography>
                            <Chip
                              label={activity.slot}
                              size="small"
                              sx={{
                                backgroundColor: colors.greenAccent[500],
                                color: colors.grey[900],
                                fontSize: "0.7rem",
                              }}
                            />
                          </Box>
                          {activity.porter && (
                            <Typography
                              fontSize="0.75rem"
                              color={colors.blueAccent[400]}
                              fontWeight="500"
                              mb={0.5}
                            >
                              Porter: {activity.porter.name}
                            </Typography>
                          )}
                          <Typography
                            fontSize="0.75rem"
                            color={colors.grey[300]}
                            fontWeight="400"
                          >
                            {new Date(activity.date).toLocaleString()}
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

      {/* Managers Section with Better Layout */}
      {!error && dashboardData.stats.managers.length > 0 && (
        <Grid container spacing={3} mt={2}>
          <Grid item xs={12}>
            <Grow in timeout={1800}>
              <Card
                sx={{
                  background: colors.primary[400],
                  border: `1px solid ${colors.primary[300]}`,
                  borderRadius: "16px",
                  overflow: "hidden",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" mb={3}>
                    <SupervisorAccountIcon
                      sx={{
                        color: colors.blueAccent[400],
                        fontSize: "28px",
                        mr: 2,
                      }}
                    />
                    <Typography
                      variant="h5"
                      fontWeight="600"
                      color={colors.grey[100]}
                    >
                      Linked Managers ({dashboardData.stats.managers.length})
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    {dashboardData.stats.managers.map((manager, index) => (
                      <Grid item xs={12} sm={6} md={4} key={`${manager.email}-${index}`}>
                        <Box
                          p={3}
                          sx={{
                            borderRadius: "12px",
                            background: `${colors.primary[500]}80`,
                            border: `1px solid ${colors.primary[300]}`,
                            transition: "all 0.2s ease",
                            "&:hover": {
                              background: colors.primary[500],
                              border: `1px solid ${colors.blueAccent[500]}40`,
                              transform: "translateY(-2px)",
                            },
                          }}
                        >
                          <Typography
                            fontWeight="600"
                            color={colors.grey[100]}
                            fontSize="1.1rem"
                            mb={1}
                          >
                            {manager.name}
                          </Typography>
                          <Box display="flex" alignItems="center" mb={1}>
                            <EmailIcon
                              sx={{
                                color: colors.blueAccent[400],
                                fontSize: "16px",
                                mr: 1,
                              }}
                            />
                            <Typography
                              fontSize="0.85rem"
                              color={colors.blueAccent[400]}
                              sx={{ wordBreak: "break-all" }}
                            >
                              {manager.email}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center">
                            <PhoneIcon
                              sx={{
                                color: colors.greenAccent[400],
                                fontSize: "16px",
                                mr: 1,
                              }}
                            />
                            <Typography
                              fontSize="0.85rem"
                              color={colors.greenAccent[400]}
                            >
                              {manager.phone}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grow>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default FarmerHome;