import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from '@mui/material';
import { useTheme } from '@mui/material';
import { tokens } from '../../theme';
import axios from 'axios';
import { AuthContext } from '../../components/PrivateComponents/AuthContext';
import Header from '../scenes/Header';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useLocation } from 'react-router-dom';

// Tooltip
const CustomTooltip = ({ active, payload, label, colors }) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{
        p: 1,
        backgroundColor: colors.primary[600],
        border: `1px solid ${colors.greenAccent[500]}`,
        borderRadius: '8px'
      }}>
        <Typography variant="body2" fontWeight="bold" color={colors.grey[100]}>{label}</Typography>
        {payload.map((pld, index) => (
          <Typography key={index} variant="caption" color={pld.color}>
            {`${pld.name}: ${pld.value} L`}
          </Typography>
        ))}
      </Box>
    );
  }
  return null;
};

const DairySummaries = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { token } = useContext(AuthContext);

  const location = useLocation();
  const cowIdFromState = location.state?.cowId;

  const [cows, setCows] = useState([]);
  const [selectedCowId, setSelectedCowId] = useState('');
  const [dailySummary, setDailySummary] = useState(null);
  const [weeklyTrend, setWeeklyTrend] = useState(null);
  const [monthlySummary, setMonthlySummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchCowsLoading, setFetchCowsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const [view, setView] = useState("daily"); // 👈 toggle state

  const API_BASE_URL = 'https://maziwasmart.onrender.com/api/cow';

  const fetchCows = useCallback(async () => {
    if (!token) {
      setError('Authentication token not found. Please log in.');
      setFetchCowsLoading(false);
      return;
    }
    setFetchCowsLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_BASE_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: { gender: 'female', stage: 'cow' },
      });
      setCows(response.data.cows);
    } catch (err) {
      console.error('Failed to fetch cows:', err.response?.data || err.message);
      setError('Failed to fetch cows. Please try again later.');
      setSnackbarMessage('Failed to fetch cows.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setFetchCowsLoading(false);
    }
  }, [token]);

  const fetchCowSummaries = useCallback(async (cowId) => {
    if (!cowId || !token) return;

    setLoading(true);
    setError(null);
    setDailySummary(null);
    setWeeklyTrend(null);
    setMonthlySummary(null);

    try {
      const [dailyRes, weeklyRes, monthlyRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/daily/${cowId}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/weekly/${cowId}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_BASE_URL}/monthly/${cowId}`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setDailySummary(dailyRes.data);
      setWeeklyTrend(weeklyRes.data);
      setMonthlySummary(monthlyRes.data);
    } catch (err) {
      console.error('Failed to fetch cow summaries:', err.response?.data || err.message);
      setError('Failed to fetch data for this cow. Please try again later.');
      setSnackbarMessage('Failed to fetch cow data.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const loadCowsAndSelect = async () => {
      await fetchCows();
      if (cowIdFromState) {
        setSelectedCowId(cowIdFromState);
      }
    };
    loadCowsAndSelect();
  }, [fetchCows, cowIdFromState]);

  useEffect(() => {
    if (selectedCowId) {
      fetchCowSummaries(selectedCowId);
    }
  }, [selectedCowId, fetchCowSummaries]);

  const handleCowChange = (event) => {
    setSelectedCowId(event.target.value);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Memoized data
  const dailyChartData = useMemo(() => {
    if (!dailySummary || !dailySummary.summary) return [];
    return Object.entries(dailySummary.summary)
      .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
      .map(([date, litres]) => ({ label: date, litres }));
  }, [dailySummary]);

  const weeklyChartData = useMemo(() => {
    if (!weeklyTrend || !weeklyTrend.weekly_trend) return [];
    return [...weeklyTrend.weekly_trend]
      .map(record => ({ label: record.day, litres: record.litres }));
  }, [weeklyTrend]);

  const monthlyChartData = useMemo(() => {
    if (!monthlySummary || !monthlySummary.monthly_summary) return [];
    return [...monthlySummary.monthly_summary]
      .map(record => ({ label: record.week, litres: record.total_litres }));
  }, [monthlySummary]);

  const getChartData = () => {
    if (view === "daily") return dailyChartData;
    if (view === "weekly") return weeklyChartData;
    if (view === "monthly") return monthlyChartData;
    return [];
  };

  return (
    <Box m="20px">
      <Header
        title="DAIRY SUMMARIES"
        subtitle="View milk production data for your cows"
      />
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} variant="filled" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Grid container spacing={4} mt={2}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant="filled">
            <InputLabel>Select Cow</InputLabel>
            <Select
              value={selectedCowId}
              onChange={handleCowChange}
              disabled={fetchCowsLoading}
            >
              {fetchCowsLoading ? (
                <MenuItem disabled>Loading cows...</MenuItem>
              ) : cows.length > 0 ? (
                cows.map((cow) => (
                  <MenuItem key={cow._id} value={cow._id}>
                    {cow.cow_name} ({cow.cow_id})
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No female cows available for milk recording.</MenuItem>
              )}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {selectedCowId && (
        <Box mt={4}>
          {/* Toggle buttons */}
          <Stack direction="row" spacing={2} mb={2}>
            {["daily", "weekly", "monthly"].map((v) => (
              <Button
                key={v}
                variant={view === v ? "contained" : "outlined"}
                onClick={() => setView(v)}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </Button>
            ))}
          </Stack>

          {/* Chart */}
          {loading ? (
            <CircularProgress />
          ) : getChartData().length === 0 ? (
            <Typography variant="body1" color={colors.grey[400]}>No {view} data available</Typography>
          ) : (
            <Card>
              <CardContent>
                <Box height="400px">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip colors={colors} />} />
                      <Line type="monotone" dataKey="litres" stroke={colors.greenAccent[500]} strokeWidth={3} dot />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>
      )}
    </Box>
  );
};

export default DairySummaries;
