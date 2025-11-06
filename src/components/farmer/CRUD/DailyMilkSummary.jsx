import React, { useEffect, useState, useContext, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  useTheme,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  useMediaQuery,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  Chip,
  Stack,
  Paper,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { ResponsiveLine } from "@nivo/line";
import {
  TrendingUp,
  TrendingDown,
  BarChart as BarChartIcon,
  Timeline,
  Refresh,
  Analytics,
} from '@mui/icons-material';
import { tokens } from '../../../theme';
import { AuthContext } from '../../PrivateComponents/AuthContext';
import Header from '../../scenes/Header';

// API endpoints
const API_BASE = 'https://maziwasmart.onrender.com/api';

const API_ENDPOINTS = {
  MILK_SUMMARY: `${API_BASE}/summary/records`,
  COWS_LIST: `${API_BASE}/cows`,
  COW_WEEKLY_TREND: `${API_BASE}/cows`,
  COW_MONTHLY_SUMMARY: `${API_BASE}/cows`,
  COW_LITRES_SUMMARY: `${API_BASE}/cows`,
};

// Enhanced LineChart component
const MilkTrendChart = ({ data, chartType = 'line', height = 400, isDashboard = false, title }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    return [{
      id: title || 'milk-production',
      color: colors.blueAccent[400],
      data: data.map(item => ({
        x: item.period || item.day || item.date || item.week,
        y: item.litres || item.total_litres || 0,
      }))
    }];
  }, [data, colors, title]);

  return (
    <Box height={height}>
      <ResponsiveLine
        data={chartData}
        theme={{
          axis: {
            domain: {
              line: {
                stroke: colors.grey[100],
              },
            },
            legend: {
              text: {
                fill: colors.grey[100],
              },
            },
            ticks: {
              line: {
                stroke: colors.grey[100],
                strokeWidth: 1,
              },
              text: {
                fill: colors.grey[100],
              },
            },
          },
          legends: {
            text: {
              fill: colors.grey[100],
            },
          },
          tooltip: {
            container: {
              color: colors.primary[500],
            },
          },
        }}
        colors={{ scheme: "category10" }}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
          stacked: false,
          reverse: false,
        }}
        yFormat=" >-.1f"
        curve="catmullRom"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          orient: "bottom",
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
          legend: isDashboard ? undefined : "Time Period",
          legendOffset: 36,
          legendPosition: "middle",
        }}
        axisLeft={{
          orient: "left",
          tickValues: 5,
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: isDashboard ? undefined : "Litres",
          legendOffset: -40,
          legendPosition: "middle",
        }}
        enableGridX={false}
        enableGridY={true}
        gridYValues={5}
        pointSize={6}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        enableArea={chartType === 'area'}
        areaOpacity={0.1}
        useMesh={true}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
      />
    </Box>
  );
};

// Custom hook for fetching all milk data
const useMilkData = (token) => {
  const [summaryData, setSummaryData] = useState(null);
  const [cowsData, setCowsData] = useState([]);
  const [selectedCowTrends, setSelectedCowTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCow, setSelectedCow] = useState(null);

  const fetchSummaryData = useCallback(async () => {
    try {
      const response = await fetch(API_ENDPOINTS.MILK_SUMMARY, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch summary');

      const data = await response.json();
      setSummaryData(data);
    } catch (err) {
      throw new Error(`Summary fetch error: ${err.message}`);
    }
  }, [token]);

  const fetchCowsData = useCallback(async () => {
    try {
      const response = await fetch(API_ENDPOINTS.COWS_LIST, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch cows');

      const data = await response.json();
      setCowsData(data.cows || []);

      // Set first cow as selected by default
      if (data.cows && data.cows.length > 0) {
        setSelectedCow(data.cows[0]);
      }
    } catch (err) {
      throw new Error(`Cows fetch error: ${err.message}`);
    }
  }, [token]);

  const fetchCowTrends = useCallback(async (cowId) => {
    if (!cowId) return;

    try {
      const [weeklyResponse, monthlyResponse, summaryResponse] = await Promise.all([
        fetch(`${API_ENDPOINTS.COW_WEEKLY_TREND}/${cowId}/weekly-trend`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_ENDPOINTS.COW_MONTHLY_SUMMARY}/${cowId}/monthly`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_ENDPOINTS.COW_LITRES_SUMMARY}/${cowId}/summary`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);

      const weeklyData = weeklyResponse.ok ? await weeklyResponse.json() : { trend: {} };
      const monthlyData = monthlyResponse.ok ? await monthlyResponse.json() : { monthly_summary: [] };
      const summaryDataRes = summaryResponse.ok ? await summaryResponse.json() : { summary: {} };

      // Process weekly trend data
      const weeklyTrend = Object.entries(weeklyData.trend || {}).map(([day, litres]) => ({
        period: day,
        day,
        litres
      }));

      // Process monthly data
      const monthlyTrend = (monthlyData.monthly_summary || []).map(item => ({
        period: item.week,
        week: item.week,
        litres: item.total_litres,
        date_range: item.date_range
      }));

      // Process daily summary data
      const dailyTrend = Object.entries(summaryDataRes.summary || {}).map(([date, litres]) => ({
        period: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        date,
        litres
      })).sort((a, b) => new Date(a.date) - new Date(b.date));

      setSelectedCowTrends({
        weekly: weeklyTrend,
        monthly: monthlyTrend,
        daily: dailyTrend
      });

    } catch (err) {
      console.error('Error fetching cow trends:', err);
    }
  }, [token]);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!token) {
      setError('Authentication token not found');
      setLoading(false);
      return;
    }

    try {
      await Promise.all([
        fetchSummaryData(),
        fetchCowsData()
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, fetchSummaryData, fetchCowsData]);

  // Fetch cow trends when selected cow changes
  useEffect(() => {
    if (selectedCow?._id) {
      fetchCowTrends(selectedCow._id);
    }
  }, [selectedCow, fetchCowTrends]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return {
    summaryData,
    cowsData,
    selectedCowTrends,
    selectedCow,
    setSelectedCow,
    loading,
    error,
    refetch: fetchAllData
  };
};

// Stats card component
const StatsCard = ({ title, value, trend, icon, color }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const trendIcon = trend > 0 ? <TrendingUp /> : trend < 0 ? <TrendingDown /> : null;
  const trendColor = trend > 0 ? colors.greenAccent[400] : colors.redAccent[400];

  return (
    <Card
      sx={{
        background: colors.primary[400],
        border: `1px solid ${colors.primary[300]}`,
        borderRadius: 2,
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-2px)',
          transition: 'transform 0.2s ease',
        }
      }}
    >
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h6" color={colors.grey[300]} gutterBottom>
              {title}
            </Typography>
            <Typography variant="h3" fontWeight="bold" color={color}>
              {value}
            </Typography>
            {trend !== undefined && trend !== 0 && (
              <Stack direction="row" alignItems="center" mt={1}>
                {trendIcon && React.cloneElement(trendIcon, {
                  sx: { fontSize: 16, color: trendColor }
                })}
                <Typography variant="body2" color={trendColor} ml={0.5}>
                  {Math.abs(trend).toFixed(1)}%
                </Typography>
              </Stack>
            )}
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}20`,
              borderRadius: 2,
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {React.cloneElement(icon, { sx: { color, fontSize: 24 } })}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

// Enhanced collection slot card
const EnhancedCollectionSlotCard = ({ slot, collections, colors, totalLitres, loading }) => {
  return (
    <Card
      sx={{
        background: colors.primary[400],
        border: `1px solid ${colors.primary[300]}`,
        borderRadius: 2,
        height: '100%',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 4px 20px ${colors.primary[700]}`,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography
            variant="h5"
            fontWeight="bold"
            color={colors.greenAccent[400]}
            sx={{ textTransform: 'capitalize' }}
          >
            {slot} Collections
          </Typography>
          <Chip
            label={loading ? '...' : `${totalLitres}L`}
            variant="outlined"
            sx={{
              borderColor: colors.greenAccent[400],
              color: colors.greenAccent[400],
              fontWeight: 'bold',
            }}
          />
        </Stack>

        <Divider sx={{ mb: 2, backgroundColor: colors.primary[300] }} />

        {loading ? (
          <Box display="flex" justifyContent="center" py={2}>
            <CircularProgress size={24} />
          </Box>
        ) : collections?.length > 0 ? (
          <>
            <Typography variant="body2" color={colors.grey[300]} mb={2}>
              {collections.length} collection{collections.length !== 1 ? 's' : ''}
            </Typography>
            <List sx={{ maxHeight: 200, overflowY: 'auto' }}>
              {collections.slice(0, 5).map((item, index) => (
                <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight="bold" color={colors.grey[100]}>
                        {item.litres}L
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" color={colors.grey[300]}>
                        {new Date(item.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </>
        ) : (
          <Typography variant="body2" color={colors.grey[300]} textAlign="center" py={2}>
            No collections for this slot
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

// Main enhanced component
const EnhancedMilkSummary = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { token, user } = useContext(AuthContext);
  const {
    summaryData,
    cowsData,
    selectedCowTrends,
    selectedCow,
    setSelectedCow,
    loading,
    error,
    refetch
  } = useMilkData(token);

  const [showTrends, setShowTrends] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');
  const [chartType, setChartType] = useState('line');

  // Calculate statistics from summary data
  const stats = useMemo(() => {
    if (!summaryData?.summary) return null;

    const allCollections = Object.values(summaryData.summary).flat();
    const totalLitres = allCollections.reduce((sum, item) => sum + (item.litres || 0), 0);
    const collectionsCount = allCollections.length;

    const avgDaily = collectionsCount > 0 ? (totalLitres / collectionsCount * 3).toFixed(1) : '0.0'; // Approximate daily average

    const bestSlot = Object.entries(summaryData.summary)
      .map(([slot, collections]) => ({
        slot,
        total: collections.reduce((sum, item) => sum + (item.litres || 0), 0)
      }))
      .sort((a, b) => b.total - a.total)[0];

    return {
      totalLitres,
      avgDaily,
      bestSlot: bestSlot?.slot || 'N/A',
      collectionsCount,
    };
  }, [summaryData]);

  // Get trend data based on selected period
  const currentTrendData = useMemo(() => {
    if (!selectedCowTrends) return [];
    return selectedCowTrends[selectedPeriod] || [];
  }, [selectedCowTrends, selectedPeriod]);

  if (error) {
    return (
      <Box m={3}>
        <Alert
          severity="error"
          action={
            <IconButton size="small" onClick={refetch}>
              <Refresh />
            </IconButton>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box m="20px">
      <Header
        title="ENHANCED MILK DASHBOARD"
        subtitle={summaryData ? `${summaryData.farmer_name} (${summaryData.farmer_code})` : 'Loading farmer information...'}
      />

      {/* Controls */}
      <Stack direction="row" spacing={2} mb={3} flexWrap="wrap" alignItems="center">
        <FormControlLabel
          control={
            <Switch
              checked={showTrends}
              onChange={(e) => setShowTrends(e.target.checked)}
              color="primary"
            />
          }
          label="Show Trends"
        />

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Period</InputLabel>
          <Select
            value={selectedPeriod}
            label="Period"
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Cow</InputLabel>
          <Select
            value={selectedCow?._id || ''}
            label="Cow"
            onChange={(e) => {
              const cow = cowsData.find(c => c._id === e.target.value);
              setSelectedCow(cow);
            }}
          >
            {cowsData.map((cow) => (
              <MenuItem key={cow._id} value={cow._id}>
                {cow.cow_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Tooltip title="Refresh Data">
          <IconButton onClick={refetch} disabled={loading}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Statistics Cards */}
      {stats && (
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Production"
              value={`${stats.totalLitres}L`}
              icon={<BarChartIcon />}
              color={colors.blueAccent[400]}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Daily Average"
              value={`${stats.avgDaily}L`}
              icon={<Timeline />}
              color={colors.greenAccent[400]}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Best Slot"
              value={stats.bestSlot}
              icon={<Analytics />}
              color={colors.primary[300]}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Collections"
              value={stats.collectionsCount}
              icon={<TrendingUp />}
              color={colors.redAccent[400]}
            />
          </Grid>
        </Grid>
      )}

      {/* Trend Chart */}
      {showTrends && currentTrendData.length > 0 && (
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 3,
                backgroundColor: colors.primary[400],
                border: `1px solid ${colors.primary[300]}`,
                borderRadius: 2,
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5" fontWeight="bold" color={colors.grey[100]}>
                  {selectedCow?.cow_name} - {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} Trend
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Chip
                    label="Line"
                    variant={chartType === 'line' ? "filled" : "outlined"}
                    onClick={() => setChartType('line')}
                    size="small"
                    sx={{ cursor: 'pointer' }}
                  />
                  <Chip
                    label="Area"
                    variant={chartType === 'area' ? "filled" : "outlined"}
                    onClick={() => setChartType('area')}
                    size="small"
                    sx={{ cursor: 'pointer' }}
                  />
                </Stack>
              </Stack>
              <MilkTrendChart
                data={currentTrendData}
                chartType={chartType}
                height={300}
                title={`${selectedCow?.cow_name} Production`}
              />
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Collection Summary Cards */}
      <Grid container spacing={3}>
        {summaryData?.summary ? Object.entries(summaryData.summary).map(([slot, collections]) => {
          const totalLitres = collections.reduce((sum, item) => sum + (item.litres || 0), 0);
          return (
            <Grid item xs={12} md={4} key={slot}>
              <EnhancedCollectionSlotCard
                slot={slot}
                collections={collections}
                colors={colors}
                totalLitres={totalLitres}
                loading={loading}
              />
            </Grid>
          );
        }) : (
          // Loading skeleton
          [1, 2, 3].map((index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  background: colors.primary[400],
                  height: 300,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CircularProgress />
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default EnhancedMilkSummary;