// pages/DairySummaries.jsx
import React, { useState, useEffect, useCallback, useMemo, useContext } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Snackbar,
  Alert,
  Stack,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { BarChart2, List } from "lucide-react";
import { AuthContext } from "../../PrivateComponents/AuthContext";
import axios from "axios";
import { COLORS } from "../farmhome/utils/constants";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useLocation } from "react-router-dom";

const DairySummaries = () => {
  const { token } = useContext(AuthContext);
  const location = useLocation();
  const cowId = location.state?.cowId;

  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [view, setView] = useState("table"); // table or chart
  const [mode, setMode] = useState("daily"); // daily | weekly | monthly

  const API_BASE_URL =     process.env.REACT_APP_API_BASE

  const fetchSummary = useCallback(async () => {
    if (!cowId) return;
    setLoading(true);
    try {
      const url =
        mode === "daily"
          ? `${API_BASE_URL}/cows/daily/${cowId}`
          : mode === "weekly"
            ? `${API_BASE_URL}/cows/weekly/${cowId}`
            : `${API_BASE_URL}/cows/monthly/${cowId}`;

      const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });

      let formatted = [];
      if (mode === "daily") {
        formatted = Object.entries(res.data.summary).map(([date, slots]) => ({
          date,
          slots, // array of { time_slot, litres }
          total_litres: Object.values(slots).reduce((a, b) => a + b, 0),
        }));
      } else if (mode === "weekly") {
        formatted = res.data.weekly_trend || [];
      } else if (mode === "monthly") {
        formatted = res.data.monthly_summary || [];
      }

      setSummaryData(formatted);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Failed to fetch summary", severity: "error" });
    } finally {
      setLoading(false);
    }
  }, [cowId, mode, token]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const chartData = useMemo(
    () =>
      summaryData.map((item) => ({
        label: item.date || item.label || item.day || item.week,
        litres: item.total_litres || item.litres || 0,
      })),
    [summaryData]
  );

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: "#ffffff", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight={900} color="#000" mb={3}>
        🐄 Dairy Summaries
      </Typography>

      {/* Toggle Mode Buttons */}
      <Stack direction="row" spacing={1} mb={3}>
        {["daily", "weekly", "monthly"].map((m) => (
          <Button
            key={m}
            variant={mode === m ? "contained" : "outlined"}
            onClick={() => setMode(m)}
            sx={{
              backgroundColor: mode === m ? COLORS.aqua.main : "#fff",
              color: mode === m ? "#fff" : COLORS.aqua.main,
              border: `2px solid ${COLORS.aqua.main}`,
              fontWeight: 700,
              "&:hover": {
                backgroundColor: COLORS.aqua.dark,
                color: "#fff",
              },
            }}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </Button>
        ))}
        <IconButton
          onClick={() => setView(view === "table" ? "chart" : "table")}
          sx={{
            backgroundColor: "#fff",
            border: `2px solid ${COLORS.aqua.main}`,
            color: COLORS.aqua.main,
            "&:hover": {
              backgroundColor: COLORS.aqua.main,
              color: "#fff",
            },
          }}
        >
          {view === "table" ? <BarChart2 size={22} /> : <List size={22} />}
        </IconButton>
      </Stack>

      {/* Content */}
      <Card sx={{ backgroundColor: "#fff", borderRadius: "16px", border: `2px solid ${COLORS.aqua.main}30`, p: 2 }}>
        <CardContent>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress sx={{ color: COLORS.aqua.main }} />
            </Box>
          ) : !summaryData.length ? (
            <Typography textAlign="center" color="#000" fontStyle="italic">
              No data available
            </Typography>
          ) : view === "table" ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 900, color: "#000" }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#000" }}>Time Slot(s)</TableCell>
                  <TableCell sx={{ fontWeight: 900, color: "#000" }}>Litres</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {summaryData.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell sx={{ color: "#000" }}>{item.date}</TableCell>
                    <TableCell sx={{ color: "#000" }}>
                      {Array.isArray(item.slots)
                        ? item.slots.map((s) => `${s.time_slot} (${s.litres} L)`).join(", ")
                        : "-"}
                    </TableCell>
                    <TableCell sx={{ color: "#000" }}>{item.total_litres || 0} L</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Box height={400}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" stroke="#000" />
                  <YAxis stroke="#000" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#fff", border: `1px solid ${COLORS.aqua.main}` }}
                  />
                  <Line type="monotone" dataKey="litres" stroke={COLORS.aqua.main} strokeWidth={3} dot />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} onClose={handleSnackbarClose} sx={{ color: "#000" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DairySummaries;
