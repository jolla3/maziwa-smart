import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useTheme,
  Tooltip,
  IconButton,
  TextField,
  InputAdornment,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
import GroupsIcon from "@mui/icons-material/Groups";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { AuthContext } from "../PrivateComponents/AuthContext";
import { tokens } from "../../theme";

const transformByFarmer = (slots) => {
  const farmerMap = {};

  slots.forEach((slot) => {
    slot.records.forEach((rec) => {
      // FIX 1: Ensure rec.farmer_code is a string before using it as a key
      const farmerCode = String(rec.farmer_code);
      const key = farmerCode;

      if (!farmerMap[key]) {
        farmerMap[key] = {
          farmer_name: rec.farmer_name,
          farmer_code: farmerCode, // Store the string version
          time_slots: {},
          total_litres: 0,
          slot_count: 0,
        };
      }
      farmerMap[key].time_slots[slot.time_slot] =
        (farmerMap[key].time_slots[slot.time_slot] || 0) + rec.litres;
      farmerMap[key].total_litres += rec.litres;
    });
  });

  return Object.values(farmerMap)
    .map((farmer) => ({
      ...farmer,
      slot_count: Object.keys(farmer.time_slots).length,
    }))
    .sort((a, b) => b.total_litres - a.total_litres);
};

export default function PorterMyRecords() {
  const { token } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

   const Base_API = process.env.REACT_APP_API_BASE


  const fetchRecords = useCallback(
    async (isRefresh = false) => {
      // Check for cached data first
      const cachedData = localStorage.getItem("porterMilkRecords");
      
      // If no cached data, set loading to true
      if (!cachedData || isRefresh) {
        setLoading(true);
      } else {
        // If cached data exists, display it immediately
        const parsedData = JSON.parse(cachedData);
        setData(parsedData);
        if (parsedData.summary.length > 0 && !selectedDate) {
          setSelectedDate(parsedData.summary[0].date);
        }
        // Then, proceed to fetch new data in the background
        setLoading(false);
      }

      setError("");
      
      try {
        const res = await fetch(
         `${Base_API}/milk/myrecords`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const json = await res.json();
        setData(json);
        // Cache the fresh data
        localStorage.setItem("porterMilkRecords", JSON.stringify(json));
        
        // Only set date if it wasn't already set from cache
        if (!selectedDate) {
          setSelectedDate(json.summary[0]?.date || "");
        }
      } catch (err) {
        console.error(err);
        // Only show error if we have no cached data to fall back on
        if (!cachedData) {
          setError(err.message || "Failed to fetch records");
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [token, selectedDate]
  );

  useEffect(() => {
    if (token) {
      fetchRecords();
    }
  }, [token, fetchRecords]);

  const handleRefresh = () => {
    fetchRecords(true);
  };

  if (loading) {
    return (
      <Box p={3} display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress sx={{ color: colors.blueAccent[500] }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert 
          severity="error" 
          sx={{ 
            mb: 2,
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }}
        >
          Error: {error}
        </Alert>
        <Box display="flex" justifyContent="center">
          <IconButton 
            onClick={handleRefresh} 
            disabled={refreshing}
            sx={{ color: colors.blueAccent[500] }}
          >
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>
    );
  }

  if (!data || !data.summary) return null;

  const selectedDayData = data.summary.find((d) => d.date === selectedDate);
  const farmerData = selectedDayData
    ? transformByFarmer(selectedDayData.slots)
    : [];

  const filteredFarmers = farmerData.filter(
    (farmer) =>
      farmer.farmer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(farmer.farmer_code).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalLitres = farmerData.reduce((sum, f) => sum + f.total_litres, 0);
  const totalFarmers = farmerData.length;
  const totalSlots = selectedDayData ? selectedDayData.slots.length : 0;
  const avgLitresPerFarmer =
    totalFarmers > 0 ? (totalLitres / totalFarmers).toFixed(1) : 0;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Box p={2} sx={{ color: theme.palette.text.primary, bgcolor: theme.palette.background.default }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography
          variant="h2"
          gutterBottom
          sx={{ 
            color: theme.palette.text.primary,
            fontWeight: 500
          }}
        >
          Porter: {data.porter}
        </Typography>
        <Tooltip title="Refresh Data">
          <IconButton
            onClick={handleRefresh}
            disabled={refreshing}
            sx={{ 
              color: colors.blueAccent[500],
              '&:hover': { bgcolor: theme.palette.action.hover }
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Grid container spacing={2} alignItems="center" mb={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel 
              id="date-select-label"
              sx={{ color: theme.palette.text.secondary }}
            >
              Select Collection Date
            </InputLabel>
            <Select
              labelId="date-select-label"
              value={selectedDate}
              label="Select Collection Date"
              onChange={(e) => setSelectedDate(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <CalendarTodayIcon sx={{ color: theme.palette.action.active }} />
                </InputAdornment>
              }
              sx={{
                bgcolor: theme.palette.background.paper,
                borderRadius: 2,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.divider,
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: colors.blueAccent[300],
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: colors.blueAccent[500],
                },
                ".MuiSelect-select": {
                  color: theme.palette.text.primary,
                },
                "& .MuiSvgIcon-root": {
                  color: theme.palette.action.active,
                },
              }}
            >
              {data.summary.map((day, idx) => (
                <MenuItem key={idx} value={day.date}>
                  <Box>
                    <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
                      {formatDate(day.date)}
                    </Typography>
                    <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                      {day.total_litres_for_date}L • {day.slots.length} slot
                      {day.slots.length !== 1 ? "s" : ""}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search farmers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              bgcolor: theme.palette.background.paper,
              borderRadius: 2,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.palette.divider,
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.blueAccent[300],
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: colors.blueAccent[500],
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: theme.palette.action.active }} />
                </InputAdornment>
              ),
              sx: {
                color: theme.palette.text.primary,
                "& .MuiSvgIcon-root": {
                  color: theme.palette.action.active,
                },
              },
            }}
          />
        </Grid>
      </Grid>

      {selectedDate && (
        <Box mb={3}>
          <Paper
            sx={{
              p: 2.5,
              bgcolor: theme.palette.background.paper,
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: theme.shadows[2],
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ color: theme.palette.text.primary, fontWeight: 500 }}
            >
              📅 {formatDate(selectedDate)}
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              Collection summary for the selected date
            </Typography>
          </Paper>
        </Box>
      )}

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${colors.blueAccent[100]} 0%, ${colors.blueAccent[200]} 100%)`,
              borderRadius: 3,
              boxShadow: theme.shadows[4],
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center">
                <LocalDrinkIcon 
                  sx={{ 
                    fontSize: 40, 
                    mr: 2, 
                    color: colors.blueAccent[500] 
                  }} 
                />
                <Box>
                  <Typography variant="h6" sx={{ color: colors.blueAccent[700] }}>
                    Total Litres
                  </Typography>
                  <Typography 
                    variant="h4" 
                    fontWeight="600"
                    sx={{ color: colors.blueAccent[800] }}
                  >
                    {totalLitres.toLocaleString()} L
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${colors.greenAccent[100]} 0%, ${colors.greenAccent[200]} 100%)`,
              borderRadius: 3,
              boxShadow: theme.shadows[4],
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center">
                <GroupsIcon 
                  sx={{ 
                    fontSize: 40, 
                    mr: 2, 
                    color: colors.greenAccent[500] 
                  }} 
                />
                <Box>
                  <Typography variant="h6" sx={{ color: colors.greenAccent[700] }}>
                    Farmers
                  </Typography>
                  <Typography 
                    variant="h4" 
                    fontWeight="600"
                    sx={{ color: colors.greenAccent[800] }}
                  >
                    {totalFarmers}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${colors.redAccent[100]} 0%, ${colors.redAccent[200]} 100%)`,
              borderRadius: 3,
              boxShadow: theme.shadows[4],
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center">
                <AccessTimeIcon 
                  sx={{ 
                    fontSize: 40, 
                    mr: 2, 
                    color: colors.redAccent[500] 
                  }} 
                />
                <Box>
                  <Typography variant="h6" sx={{ color: colors.redAccent[700] }}>
                    Time Slots
                  </Typography>
                  <Typography 
                    variant="h4" 
                    fontWeight="600"
                    sx={{ color: colors.redAccent[800] }}
                  >
                    {totalSlots}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${colors.yellowAccent[100]} 0%, ${colors.yellowAccent[200]} 100%)`,
              borderRadius: 3,
              boxShadow: theme.shadows[4],
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUpIcon 
                  sx={{ 
                    fontSize: 40, 
                    mr: 2, 
                    color: colors.yellowAccent[500] 
                  }} 
                />
                <Box>
                  <Typography variant="h6" sx={{ color: colors.yellowAccent[700] }}>
                    Avg Per Farmer
                  </Typography>
                  <Typography 
                    variant="h4" 
                    fontWeight="600"
                    sx={{ color: colors.yellowAccent[800] }}
                  >
                    {avgLitresPerFarmer} L
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {searchTerm && (
        <Box mb={2}>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            Showing {filteredFarmers.length} of {totalFarmers} farmers
          </Typography>
          <Divider sx={{ mt: 1, mb: 2, borderColor: theme.palette.divider }} />
        </Box>
      )}

      {!selectedDate ? (
        <Alert 
          severity="info" 
          sx={{ 
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }}
        >
          Please select a date to view farmer records.
        </Alert>
      ) : filteredFarmers.length === 0 ? (
        <Alert 
          severity="info" 
          sx={{ 
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }}
        >
          {searchTerm
            ? "No farmers found matching your search."
            : "No farmer records available for this date."}
        </Alert>
      ) : (
        filteredFarmers.map((farmer, idx) => (
          <Accordion 
            key={idx} 
            sx={{ 
              mb: 1.5,
              bgcolor: theme.palette.background.paper,
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: theme.shadows[1],
              '&:before': { display: 'none' },
              '&.Mui-expanded': {
                margin: '0 0 12px 0',
              }
            }}
          >
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon sx={{ color: theme.palette.action.active }} />}
              sx={{
                '&:hover': {
                  bgcolor: theme.palette.action.hover,
                },
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                width="100%"
                mr={2}
              >
                <Typography 
                  sx={{ 
                    flexGrow: 1, 
                    color: theme.palette.text.primary,
                    fontWeight: 500
                  }}
                >
                  <strong>{farmer.farmer_name}</strong> ({farmer.farmer_code})
                </Typography>
                <Box display="flex" gap={1}>
                  <Chip
                    label={`${farmer.slot_count} slot${
                      farmer.slot_count !== 1 ? "s" : ""
                    }`}
                    size="small"
                    sx={{
                      bgcolor: theme.palette.action.selected,
                      color: theme.palette.text.secondary,
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  />
                  <Chip
                    label={`${farmer.total_litres}L`}
                    size="small"
                    sx={{
                      bgcolor: colors.blueAccent[100],
                      color: colors.blueAccent[700],
                      border: `1px solid ${colors.blueAccent[300]}`,
                    }}
                  />
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ bgcolor: theme.palette.action.hover }}>
              <Box mb={2}>
                <Typography 
                  variant="body2" 
                  sx={{ color: theme.palette.text.secondary }}
                  gutterBottom
                >
                  Collection breakdown by time slot for{" "}
                  {formatDate(selectedDate)}
                </Typography>
              </Box>
              <TableContainer 
                component={Paper} 
                variant="outlined"
                sx={{ 
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  overflow: 'hidden'
                }}
              >
                <Table size="small">
                  <TableHead
                    sx={{
                      backgroundColor: colors.blueAccent[100],
                      "& th": {
                        color: colors.blueAccent[700],
                        fontWeight: 600,
                        borderBottom: `2px solid ${colors.blueAccent[300]}`,
                      },
                    }}
                  >
                    <TableRow>
                      <TableCell>Time Slot</TableCell>
                      <TableCell align="right">Litres</TableCell>
                      <TableCell align="right">% of Day's Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(farmer.time_slots)
                      .sort(([slotA], [slotB]) => slotA.localeCompare(slotB))
                      .map(([slot, litres], i) => (
                        <TableRow
                          key={i}
                          sx={{
                            "&:nth-of-type(odd)": {
                              backgroundColor: theme.palette.action.hover,
                            },
                            "&:nth-of-type(even)": {
                              backgroundColor: theme.palette.background.paper,
                            },
                            '&:hover': {
                              backgroundColor: theme.palette.action.selected,
                            }
                          }}
                        >
                          <TableCell sx={{ fontWeight: 500, color: theme.palette.text.primary }}>
                            <Box display="flex" alignItems="center">
                              <AccessTimeIcon
                                sx={{
                                  fontSize: 16,
                                  mr: 1,
                                  color: theme.palette.action.active,
                                }}
                              />
                              {slot}
                            </Box>
                          </TableCell>
                          <TableCell 
                            align="right" 
                            sx={{ 
                              fontWeight: 600,
                              color: theme.palette.text.primary
                            }}
                          >
                            {litres} L
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ color: colors.blueAccent[600], fontWeight: 500 }}
                          >
                            {farmer.total_litres > 0
                              ? ((litres / farmer.total_litres) * 100).toFixed(1)
                              : 0}
                            %
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Box>
  );
}