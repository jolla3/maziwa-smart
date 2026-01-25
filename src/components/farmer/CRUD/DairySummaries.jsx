// pages/DairySummaries.jsx
import React, { useState, useEffect, useCallback, useContext } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Snackbar,
  Alert,
  Stack,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableSortLabel,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { AuthContext } from "../../PrivateComponents/AuthContext";
import axios from "axios";
import { useLocation } from "react-router-dom";

const DairySummaries = () => {
  const { token } = useContext(AuthContext);
  const location = useLocation();
  const cowId = location.state?.cowId;
  const theme = useTheme();

  const [summaryData, setSummaryData] = useState([]);
  const [cowName, setCowName] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [mode, setMode] = useState("daily"); // daily | weekly | monthly
  const [orderBy, setOrderBy] = useState("label");
  const [order, setOrder] = useState("asc");

  

  const API_BASE_URL = process.env.REACT_APP_API_BASE;

  

  const timeSlotOrder = [
    "early_morning",
    "morning",
    "midday",
    "afternoon",
    "evening",
    "night",
  ];

  const slotDisplay = {
    early_morning: "Early Morning",
    morning: "Morning",
    midday: "Midday",
    afternoon: "Afternoon",
    evening: "Evening",
    night: "Night",
  };

  const fetchSummary = useCallback(async () => {
    if (!cowId) return;
    setLoading(true);
    try {
      const url =
        mode === "daily"
          ? `${API_BASE_URL}/cow/daily/${cowId}`
          : mode === "weekly"
          ? `${API_BASE_URL}/cow/weekly/${cowId}`
          : `${API_BASE_URL}/cow/monthly/${cowId}`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!cowName && res.data.cow_name) {
        setCowName(res.data.cow_name);
      }

      let rawData = [];
      if (mode === "daily") rawData = res.data.summary || [];
      else if (mode === "weekly") rawData = res.data.weekly_summary || [];
      else if (mode === "monthly") rawData = res.data.monthly_summary || [];

      const transformed = rawData.map((item) => {
        const slotLitres = {};
        timeSlotOrder.forEach((slot) => (slotLitres[slot] = 0));

        if (Array.isArray(item.slots)) {
          item.slots.forEach((s) => {
            if (timeSlotOrder.includes(s.time_slot)) {
              slotLitres[s.time_slot] += s.litres || 0;
            }
          });
        }

        const total_litres = timeSlotOrder.reduce(
          (sum, slot) => sum + slotLitres[slot],
          0
        );

        // Display label with day name where applicable
        let label = item.date || item.week;
        let day = '';
        if (item.date && (mode === "daily" || mode === "weekly")) {
          day = new Date(item.date).toLocaleString('en-US', { weekday: 'long' });
          label = `${item.date} (${day})`;
        } else if (mode === "weekly" && item.day) {
          label = `${item.date} (${item.day})`;
        } else if (mode === "monthly") {
          label = item.week;
        }

        // Sort value (numeric)
        let sortValue;
        if (mode === "monthly") {
          sortValue = parseInt(item.week?.replace(/Week\s*/i, "") || "0", 10);
        } else {
          const dateStr = item.date || item.label;
          sortValue = dateStr ? new Date(dateStr).getTime() : 0;
        }

        return {
          label,
          sortValue,
          ...slotLitres,
          total_litres,
        };
      });

      setSummaryData(transformed);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Failed to fetch summary", severity: "error" });
    } finally {
      setLoading(false);
    }
  }, [cowId, mode, token, cowName]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const periodHeader = mode === "monthly" ? "Week" : "Date";

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedData = [...summaryData].sort((a, b) => {
    let valA, valB;
    if (orderBy === "label") {
      valA = a.sortValue;
      valB = b.sortValue;
    } else if (orderBy === "total_litres") {
      valA = a.total_litres || 0;
      valB = b.total_litres || 0;
    } else {
      // slot column
      valA = a[orderBy] ?? 0;
      valB = b[orderBy] ?? 0;
    }

    if (valA < valB) return order === "asc" ? -1 : 1;
    if (valA > valB) return order === "asc" ? 1 : -1;
    return 0;
  });

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: "#ffffff", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        fontWeight={700}
        color={theme.palette.primary.main}
        mb={3}
      >
        🐄 {cowName || "Cow"} Dairy Summaries
      </Typography>

      <Stack direction="row" spacing={1} mb={3} flexWrap="wrap" gap={1}>
        {["daily", "weekly", "monthly"].map((m) => (
          <Button
            key={m}
            variant={mode === m ? "contained" : "outlined"}
            color="primary"
            onClick={() => setMode(m)}
            sx={{ fontWeight: 700, textTransform: "capitalize" }}
          >
            {m}
          </Button>
        ))}
      </Stack>

      <Card sx={{ backgroundColor: "#ffffff" }}>
        <CardContent>
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="200px"
            >
              <CircularProgress color="primary" />
            </Box>
          ) : !summaryData.length ? (
            <Typography
              textAlign="center"
              color={theme.palette.primary.main}
              fontStyle="italic"
            >
              No data available
            </Typography>
          ) : (
            <Box sx={{ overflowX: "auto" }}>
              <Table sx={{ minWidth: 950 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                      <TableSortLabel
                        active={orderBy === "label"}
                        direction={orderBy === "label" ? order : "asc"}
                        onClick={() => handleRequestSort("label")}
                      >
                        {periodHeader}
                      </TableSortLabel>
                    </TableCell>

                    {timeSlotOrder.map((slot) => (
                      <TableCell
                        key={slot}
                        align="right"
                        sx={{ fontWeight: 700, color: theme.palette.primary.main }}
                      >
                        <TableSortLabel
                          active={orderBy === slot}
                          direction={orderBy === slot ? order : "asc"}
                          onClick={() => handleRequestSort(slot)}
                        >
                          {slotDisplay[slot]}
                        </TableSortLabel>
                      </TableCell>
                    ))}

                    <TableCell
                      align="right"
                      sx={{ fontWeight: 700, color: theme.palette.primary.main }}
                    >
                      <TableSortLabel
                        active={orderBy === "total_litres"}
                        direction={orderBy === "total_litres" ? order : "asc"}
                        onClick={() => handleRequestSort("total_litres")}
                      >
                        Total Litres
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedData.map((item, i) => (
                    <TableRow
                      key={i}
                      sx={{
                        backgroundColor: i % 2 === 0 ? "#ffffff" : theme.palette.primary.light + "20", // Pale green tint, hex with alpha
                      }}
                    >
                      <TableCell sx={{ color: "#000000" }}>
                        {item.label}
                      </TableCell>

                      {timeSlotOrder.map((slot) => (
                        <TableCell key={slot} align="right" sx={{ color: "#000000" }}>
                          {item[slot] ?? 0}
                        </TableCell>
                      ))}

                      <TableCell
                        align="right"
                        sx={{ color: theme.palette.secondary.main, fontWeight: 600 }}
                      >
                        {item.total_litres} L
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} onClose={handleSnackbarClose}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DairySummaries;