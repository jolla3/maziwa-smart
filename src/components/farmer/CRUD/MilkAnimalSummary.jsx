// pages/MilkIntelligence.jsx
import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
  Chip,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
  Fade,
  TextField,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { AuthContext } from "../../PrivateComponents/AuthContext";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import RefreshIcon from "@mui/icons-material/Refresh";
import TodayIcon from "@mui/icons-material/Today";
import ViewWeekIcon from "@mui/icons-material/ViewWeek";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import InsightsIcon from "@mui/icons-material/Insights";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment-timezone";

const MilkIntelligence = () => {
  const theme = useTheme();
  const { token } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const API_BASE_URL = process.env.REACT_APP_API_BASE;

  const year = searchParams.get("year");
  const month = searchParams.get("month");
  const day = searchParams.get("day");

  const fetchData = async (cacheKey) => {
    if (!token) return;
    setLoading(true);
    setError(null);

    // Offline check + cache
    if (!navigator.onLine) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        setData(JSON.parse(cached));
        setLoading(false);
        return;
      } else {
        setError("Offline - No cached data available");
        setLoading(false);
        return;
      }
    }

    try {
      const params = {};
      if (year) params.year = year;
      if (month) params.month = month;
      if (day) params.day = day;

      const res = await axios.get(`${API_BASE_URL}/cowSummary`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setData(res.data);
      localStorage.setItem(cacheKey, JSON.stringify(res.data)); // Cache for offline
    } catch (err) {
      setError("Failed to fetch milk intelligence");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cacheKey = `milk_intel_${year || ''}_${month || ''}_${day || 'today'}`;
    fetchData(cacheKey);
  }, [token, year, month, day]);

  const handlePeriodChange = (newYear, newMonth, newDay) => {
    const params = {};
    if (newYear) params.year = newYear;
    if (newMonth) params.month = newMonth;
    if (newDay) params.day = newDay;
    setSearchParams(params);
  };

  const handleDateChange = (date) => {
    if (date && date.isValid()) {
      setSelectedDate(date);
      handlePeriodChange(date.year(), date.month() + 1, date.date());
    }
  };

  const handleViewDetails = (cowId) => {
    navigate("/fmr.drb/dairysummaries", { state: { cowId } });
  };

  const periodButtons = [
    { label: "Today", icon: <TodayIcon />, onClick: () => handlePeriodChange() },
    { label: "This Month", icon: <CalendarMonthIcon />, onClick: () => handlePeriodChange(moment().year(), moment().month() + 1) },
    { label: "This Year", icon: <CalendarTodayIcon />, onClick: () => handlePeriodChange(moment().year()) },
    { label: "Last Year", icon: <CalendarTodayIcon />, onClick: () => handlePeriodChange(moment().year() - 1) },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress sx={{ color: theme.palette.primary.main }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!data) return null;

  const { period, animals, totals } = data;

  const stageDisplay = {
    early_morning: "Early Morning",
    morning: "Morning",
    midday: "Midday",
    afternoon: "Afternoon",
    evening: "Evening",
    night: "Night",
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: "#ffffff", minHeight: "100vh" }}>
        <Typography variant="h4" fontWeight={700} color={theme.palette.primary.main} mb={3}>
          <AgricultureIcon sx={{ mr: 1 }} /> Milk Intelligence
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={4} flexWrap="wrap" alignItems="center">
          {periodButtons.map((btn, i) => (
            <Button
              key={i}
              variant="outlined"
              startIcon={btn.icon}
              onClick={btn.onClick}
              sx={{
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                "&:hover": { backgroundColor: theme.palette.primary.main + "10" },
              }}
            >
              {btn.label}
            </Button>
          ))}
          <DatePicker
            label="Select Date"
            value={selectedDate}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} sx={{ minWidth: 200 }} />}
          />
          <IconButton onClick={() => fetchData(`milk_intel_${year || ''}_${month || ''}_${day || 'today'}`)} sx={{ color: theme.palette.primary.main }}>
            <RefreshIcon />
          </IconButton>
        </Stack>

        <Fade in timeout={600}>
          <Typography variant="h6" fontWeight={600} color="#000000" mb={2}>
            <CalendarTodayIcon sx={{ mr: 1 }} /> Period: {period.day || `${period.month} ${period.year}` || period.week || period.year}
          </Typography>
        </Fade>

        {/* Farm Totals */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ backgroundColor: "#ffffff", border: `2px solid ${theme.palette.primary.main}30`, boxShadow: "0 4px 20px rgba(0,0,0,0.05)", transition: "transform 0.2s", "&:hover": { transform: "scale(1.02)" } }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} color={theme.palette.primary.main}>
                  <LocalDrinkIcon sx={{ mr: 1 }} /> Period Total
                </Typography>
                <Typography variant="h3" fontWeight={800} color="#000000">
                  {totals.period_total.toFixed(1)} L
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Animals Breakdown */}
        <Card sx={{ backgroundColor: "#ffffff", border: `2px solid ${theme.palette.primary.main}30`, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
          <CardContent>
            <Typography variant="h5" fontWeight={700} color="#000000" mb={3}>
              <InsightsIcon sx={{ mr: 1 }} /> Per Animal Breakdown
            </Typography>
            <Box sx={{ overflowX: "auto" }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: theme.palette.primary.light + "10" }}>
                    <TableCell sx={{ fontWeight: 700, color: theme.palette.primary.main }}>Animal</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: theme.palette.primary.main }}>Species</TableCell>
                    {Object.keys(stageDisplay).map((stage) => (
                      <TableCell key={stage} align="right" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                        {stageDisplay[stage]}
                      </TableCell>
                    ))}
                    <TableCell align="right" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                      Total
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                      Details
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {animals
                    .sort((a, b) => b.period_total - a.period_total)
                    .map((animal) => (
                      <TableRow key={animal.animal_id} hover sx={{ "&:hover": { backgroundColor: theme.palette.primary.light + "10" }, transition: "background 0.2s" }}>
                        <TableCell sx={{ color: "#000000", fontWeight: 600 }}>{animal.animal_name}</TableCell>
                        <TableCell sx={{ color: "#000000" }}>
                          <Chip label={animal.species} size="small" sx={{ backgroundColor: theme.palette.secondary.main, color: "#ffffff" }} icon={<AgricultureIcon fontSize="small" />} />
                        </TableCell>
                        {animal.stages.map((stage) => (
                          <TableCell key={stage.stage} align="right" sx={{ color: "#000000" }}>
                            {stage.litres.toFixed(1)} L
                          </TableCell>
                        ))}
                        <TableCell align="right" sx={{ color: theme.palette.secondary.main, fontWeight: 700 }}>
                          {animal.period_total.toFixed(1)} L
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="View Details">
                            <IconButton onClick={() => handleViewDetails(animal.animal_id)} sx={{ color: theme.palette.primary.main }}>
                              <InsightsIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Box>
          </CardContent>
        </Card>

        <Snackbar open={!!error} autoHideDuration={6000} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default MilkIntelligence;