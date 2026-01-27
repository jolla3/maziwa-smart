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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { AuthContext } from "../../PrivateComponents/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RefreshIcon from "@mui/icons-material/Refresh";
import TodayIcon from "@mui/icons-material/Today";
import ViewWeekIcon from "@mui/icons-material/ViewWeek";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import InsightsIcon from "@mui/icons-material/Insights";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment-timezone";

const MilkIntelligence = () => {
  const theme = useTheme();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [period, setPeriod] = useState({ day: moment().format("DD"), month: moment().format("MMMM"), year: moment().year() });
  const API_BASE_URL = process.env.REACT_APP_API_BASE;

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);

    const cacheKey = `milk_intel_${selectedDate.format("YYYY-MM-DD")}`;

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
      const params = {
        year: selectedDate.year(),
        month: selectedDate.month() + 1,
        day: selectedDate.date(),
      };

      const res = await axios.get(`${API_BASE_URL}/cowSummary`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setData(res.data);
      localStorage.setItem(cacheKey, JSON.stringify(res.data));
    } catch (err) {
      setError("Failed to fetch milk intelligence");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token, selectedDate]);

  const handleDateChange = (date) => {
    if (date && date.isValid()) {
      setSelectedDate(date);
      setPeriod({
        day: date.format("DD"),
        month: date.format("MMMM"),
        year: date.year(),
      });
    }
  };

  const handlePeriodShortcut = (type) => {
    let newDate;
    switch (type) {
      case "today":
        newDate = moment();
        break;
      case "month":
        newDate = moment();
        break;
      case "year":
        newDate = moment();
        break;
      case "last_year":
        newDate = moment().subtract(1, "year");
        break;
      default:
        newDate = moment();
    }
    handleDateChange(newDate);
  };

  const handleViewDetails = (cowId) => {
    navigate("/fmr.drb/dairysummaries", { state: { cowId } });
  };

  const handleNavigateToRecording = () => {
    navigate("/fmr.drb/milkrecording");
  };

  const periodButtons = [
    { label: "Today", icon: <TodayIcon />, onClick: () => handlePeriodShortcut("today") },
    { label: "This Month", icon: <CalendarMonthIcon />, onClick: () => handlePeriodShortcut("month") },
    { label: "This Year", icon: <CalendarTodayIcon />, onClick: () => handlePeriodShortcut("year") },
    { label: "Last Year", icon: <CalendarTodayIcon />, onClick: () => handlePeriodShortcut("last_year") },
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

  const { animals, totals } = data;

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
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight={700} color={theme.palette.primary.main}>
            <AgricultureIcon sx={{ mr: 1, verticalAlign: "middle" }} /> Milk Intelligence
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddCircleIcon />}
            onClick={handleNavigateToRecording}
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: "#ffffff",
              fontWeight: 700,
              textTransform: "capitalize",
              px: 3,
              py: 1.2,
              borderRadius: "50px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
              },
            }}
          >
            Record Milk
          </Button>
        </Stack>

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
                transition: "all 0.2s ease",
                "&:hover": { 
                  backgroundColor: theme.palette.primary.main,
                  color: "#ffffff",
                },
              }}
            >
              {btn.label}
            </Button>
          ))}
          <DatePicker
            label="Select Date"
            value={selectedDate}
            onChange={handleDateChange}
            slotProps={{
              textField: {
                size: "small",
                sx: {
                  minWidth: 150,
                  "& .MuiOutlinedInput-root": {
                    borderColor: theme.palette.primary.main,
                    "&:hover": {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                },
              },
            }}
          />
          <Tooltip title="Refresh Data">
            <IconButton 
              onClick={fetchData} 
              sx={{ 
                color: theme.palette.primary.main,
                transition: "transform 0.3s ease",
                "&:hover": { transform: "rotate(180deg)" },
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Stack>

        <Fade in timeout={600}>
          <Typography variant="h6" fontWeight={600} color="#000000" mb={2}>
            <CalendarTodayIcon sx={{ mr: 1, verticalAlign: "middle" }} /> Period: {period.day} {period.month} {period.year}
          </Typography>
        </Fade>

        {/* Farm Totals */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              backgroundColor: "#ffffff", 
              border: `2px solid ${theme.palette.primary.main}30`, 
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)", 
              transition: "transform 0.2s",
              "&:hover": { transform: "scale(1.02)" } 
            }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} color={theme.palette.primary.main}>
                  <LocalDrinkIcon sx={{ mr: 1, verticalAlign: "middle" }} /> Period Total
                </Typography>
                <Typography variant="h3" fontWeight={800} color="#000000">
                  {totals.period_total.toFixed(1)} L
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Animals Breakdown */}
        <Card sx={{ 
          backgroundColor: "#ffffff", 
          border: `2px solid ${theme.palette.primary.main}30`, 
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)" 
        }}>
          <CardContent>
            <Typography variant="h5" fontWeight={700} color="#000000" mb={3}>
              <InsightsIcon sx={{ mr: 1, verticalAlign: "middle" }} /> Per Animal Breakdown
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
                      <TableRow key={animal.animal_id} hover sx={{ 
                        "&:hover": { backgroundColor: theme.palette.primary.light + "10" }, 
                        transition: "background 0.2s" 
                      }}>
                        <TableCell sx={{ color: "#000000", fontWeight: 600 }}>{animal.animal_name}</TableCell>
                        <TableCell sx={{ color: "#000000" }}>
                          <Chip 
                            label={animal.species} 
                            size="small" 
                            sx={{ 
                              backgroundColor: theme.palette.secondary.main, 
                              color: "#ffffff" 
                            }} 
                            icon={<AgricultureIcon fontSize="small" />} 
                          />
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
                            <IconButton 
                              onClick={() => handleViewDetails(animal.animal_id)} 
                              sx={{ 
                                color: theme.palette.primary.main,
                                transition: "all 0.2s ease",
                                "&:hover": { transform: "scale(1.1)" },
                              }}
                            >
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