import React, { useState, useEffect, useContext, useMemo } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// ✅ FIXED: Removed duplicate import and used correct path
import { AuthContext } from "../PrivateComponents/AuthContext";
import {
  Box,
  Typography,
  useTheme,
  MenuItem,
  Select,
  Breadcrumbs,
  Link,
  TextField,
  CircularProgress,
  Card,
  Collapse,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  ChevronLeft,
  User,
  Box as BoxIcon,
  Clock,
  Users,
  ChevronDown,
  ChevronRight,
  Database,
} from "lucide-react";

import { ResponsiveLine } from "@nivo/line";
import { tokens } from "../../theme";
import Header from "../scenes/Header";

const Records = () => {
  // ✅ FIXED: Properly get token from AuthContext
  const { token, user } = useContext(AuthContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const [date, setDate] = useState(new Date());
  const [records, setRecords] = useState([]);
  const [dailyTotal, setDailyTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedPorter, setSelectedPorter] = useState("");
  const [searchText, setSearchText] = useState("");
  const [openPorters, setOpenPorters] = useState({});

  // ✅ FIXED: Move all useMemo hooks before any conditional returns
  const filteredRecords = useMemo(() => {
    if (!selectedPorter && !searchText) return records;
    return records
      .filter((porter) =>
        selectedPorter ? porter.porter_id === selectedPorter : true
      )
      .map((porter) => {
        const filteredSlots = porter.slots
          .map((slot) => {
            const filteredFarmers = slot.farmers.filter((farmer) =>
              farmer.farmer_name.toLowerCase().includes(searchText.toLowerCase())
            );
            if (
              slot.time_slot.toLowerCase().includes(searchText.toLowerCase()) ||
              filteredFarmers.length > 0
            ) {
              return { ...slot, farmers: filteredFarmers };
            }
            return null;
          })
          .filter(Boolean);

        if (
          porter.porter_name.toLowerCase().includes(searchText.toLowerCase()) ||
          filteredSlots.length > 0
        ) {
          return { ...porter, slots: filteredSlots };
        }
        return null;
      })
      .filter(Boolean);
  }, [records, selectedPorter, searchText]);

  const lineChartData = useMemo(() => {
    const slotOrder = ["morning", "midmorning", "afternoon"];
    const slotTotals = {};

    filteredRecords.forEach((porter) => {
      porter.slots.forEach((slot) => {
        const slotName = slot.time_slot;
        if (!slotTotals[slotName]) slotTotals[slotName] = 0;
        slotTotals[slotName] += slot.total_litres;
      });
    });

    return [
      {
        id: "Milk Collected (L)",
        color: colors.blueAccent[400],
        data: slotOrder.map((slot) => ({
          x: slot.charAt(0).toUpperCase() + slot.slice(1),
          y: slotTotals[slot] || 0,
        })),
      },
    ];
  }, [filteredRecords, colors]);

  // ✅ FIXED: Define fetchData function before useEffect
  const fetchData = async () => {
    // ✅ FIXED: Double-check token exists before making request
    if (!token) {
      toast.error("No authentication token found");
      return;
    }

    try {
      setLoading(true);
      toast.info("Fetching records...");
      const formattedDate = date.toISOString().split("T")[0];
      
      // ✅ FIXED: Proper token usage with error handling
      const res = await axios.get(
        `https://maziwasmart.onrender.com/api/recordstats?date=${formattedDate}`,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 second timeout
        }
      );
      
      if (res.data) {
        setRecords(res.data.summaries || []);
        setDailyTotal(res.data.daily_total || 0);
        toast.dismiss();
        toast.success("Records loaded successfully");
      }
    } catch (err) {
      toast.dismiss();
      console.error("Fetch error:", err);
      
      // ✅ FIXED: Better error handling
      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate('/login');
      } else if (err.response?.status === 403) {
        toast.error("Access denied. Insufficient permissions.");
      } else if (err.code === 'ECONNABORTED') {
        toast.error("Request timeout. Please try again.");
      } else {
        toast.error("Failed to fetch data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePorter = (porterId) => {
    setOpenPorters((prev) => ({
      ...prev,
      [porterId]: !prev[porterId],
    }));
  };

  useEffect(() => {
    // ✅ FIXED: Only fetch data if token exists
    if (token) {
      fetchData();
    } else {
      toast.error("Authentication required");
      navigate('/login'); // Redirect to login if no token
    }
  }, [date, token, navigate]);

  // ✅ FIXED: Move conditional return after all hooks
  if (!token) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        flexDirection="column"
        gap={2}
      >
        <CircularProgress />
        <Typography>Authenticating...</Typography>
      </Box>
    );
  }

  return (
    <Box m={4}>
      {/* ✅ FIXED: Add user info display if available */}
      {user && (
        <Box mb={2}>
          <Typography variant="caption" color={colors.grey[400]}>
            Logged in as: {user.username || user.name} ({user.role})
          </Typography>
        </Box>
      )}

      {/* Breadcrumb */}
      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{ mb: 3, cursor: "pointer", color: colors.blueAccent[500] }}
        onClick={() => navigate(-1)}
      >
        <Link
          underline="hover"
          color="inherit"
          sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
        >
          <ChevronLeft size={20} /> Back to Dashboard
        </Link>
      </Breadcrumbs>

      <Header title="MILK RECORDS" subtitle="Daily milk collection records" />

      {/* Filters */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          mb: 3,
          alignItems: "center",
        }}
      >
        <DatePicker
          selected={date}
          onChange={(d) => setDate(d)}
          className="form-control"
          wrapperClassName="date-picker-wrapper"
          style={{
            borderRadius: 4,
            border: `1px solid ${colors.blueAccent[400]}`,
            padding: "6px 12px",
            minWidth: 160,
            color: theme.palette.mode === "dark" ? colors.grey[100] : colors.grey[900],
            backgroundColor: theme.palette.mode === "dark" ? colors.primary[400] : "#fff",
          }}
          aria-label="Select date"
          disabled={loading}
        />

        <Select
          value={selectedPorter}
          onChange={(e) => setSelectedPorter(e.target.value)}
          displayEmpty
          disabled={loading}
          sx={{
            minWidth: 180,
            backgroundColor:
              theme.palette.mode === "dark" ? colors.primary[400] : "#fff",
            color:
              theme.palette.mode === "dark"
                ? colors.grey[100]
                : colors.grey[900],
            borderRadius: 1,
            border: `1px solid ${colors.blueAccent[400]}`,
            "& .MuiSelect-icon": { color: colors.blueAccent[400] },
            "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            fontWeight: 600,
          }}
          inputProps={{ "aria-label": "Filter by porter" }}
        >
          <MenuItem value="">All Porters</MenuItem>
          {records.map((porter) => (
            <MenuItem
              key={porter.porter_id}
              value={porter.porter_id}
              sx={{
                color:
                  theme.palette.mode === "dark"
                    ? colors.grey[100]
                    : colors.grey[900],
              }}
            >
              {porter.porter_name}
            </MenuItem>
          ))}
        </Select>

        <TextField
          variant="outlined"
          placeholder="Search by farmer, porter, or slot"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          sx={{
            minWidth: 240,
            backgroundColor:
              theme.palette.mode === "dark" ? colors.primary[400] : "#fff",
            color:
              theme.palette.mode === "dark"
                ? colors.grey[100]
                : colors.grey[900],
            "& .MuiInputBase-input": {
              color:
                theme.palette.mode === "dark"
                  ? colors.grey[100]
                  : colors.grey[900],
            },
          }}
          inputProps={{ "aria-label": "Search records" }}
          disabled={loading}
        />

        {/* ✅ FIXED: Add refresh button */}
        <button
          onClick={fetchData}
          disabled={loading}
          style={{
            padding: "8px 16px",
            borderRadius: "4px",
            border: `1px solid ${colors.blueAccent[400]}`,
            backgroundColor: theme.palette.mode === "dark" ? colors.primary[400] : "#fff",
            color: theme.palette.mode === "dark" ? colors.grey[100] : colors.grey[900],
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </Box>

      {/* Porter Cards */}
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          mt={6}
          aria-label="Loading records"
        >
          <CircularProgress color="primary" />
        </Box>
      ) : filteredRecords.length === 0 ? (
        <Typography
          sx={{
            fontWeight: 600,
            color:
              theme.palette.mode === "dark"
                ? colors.redAccent[300]
                : colors.redAccent[600],
            mt: 2,
          }}
        >
          No records found for this date.
        </Typography>
      ) : (
        filteredRecords.map((porter) => {
          const porterTotal = porter.slots.reduce(
            (sum, slot) => sum + slot.total_litres,
            0
          );

          return (
            <Card
              key={porter.porter_id}
              sx={{
                mb: 2,
                border: `1px solid ${theme.palette.mode === "dark"
                    ? colors.blueAccent[300]
                    : "#ddd"
                  }`,
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? colors.primary[400]
                    : "#fff",
                color:
                  theme.palette.mode === "dark"
                    ? colors.grey[100]
                    : colors.grey[900],
              }}
              elevation={3}
            >
              <Box
                onClick={() => togglePorter(porter.porter_id)}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  p: 2,
                  userSelect: "none",
                }}
                aria-expanded={!!openPorters[porter.porter_id]}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    togglePorter(porter.porter_id);
                  }
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  aria-label={`Porter ${porter.porter_name}`}
                >
                  <User
                    size={20}
                    color={
                      theme.palette.mode === "dark"
                        ? colors.greenAccent[400]
                        : colors.greenAccent[600]
                    }
                  />
                  <Typography fontWeight={700}>{porter.porter_name}</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontWeight: 700,
                    color:
                      theme.palette.mode === "dark"
                        ? colors.greenAccent[400]
                        : colors.greenAccent[600],
                  }}
                >
                  <BoxIcon size={20} />
                  <Typography>{porterTotal} L</Typography>
                  {openPorters[porter.porter_id] ? (
                    <ChevronDown
                      size={20}
                      color={
                        theme.palette.mode === "dark"
                          ? colors.greenAccent[400]
                          : colors.greenAccent[600]
                      }
                    />
                  ) : (
                    <ChevronRight
                      size={20}
                      color={
                        theme.palette.mode === "dark"
                          ? colors.greenAccent[400]
                          : colors.greenAccent[600]
                      }
                    />
                  )}
                </Box>
              </Box>

              <Collapse in={openPorters[porter.porter_id]} timeout="auto" unmountOnExit>
                <Box sx={{ p: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 2,
                      justifyContent: "start",
                    }}
                  >
                    {porter.slots.map((slot, idx) => (
                      <Card
                        key={idx}
                        sx={{
                          minWidth: 280,
                          flex: "1 1 280px",
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? colors.primary[300]
                              : "#fff",
                          border: `1px solid ${theme.palette.mode === "dark"
                              ? colors.blueAccent[300]
                              : "#ddd"
                            }`,
                          color:
                            theme.palette.mode === "dark"
                              ? colors.grey[100]
                              : colors.grey[900],
                          fontWeight: 500,
                        }}
                        elevation={2}
                      >
                        <Box sx={{ p: 1 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              textTransform: "capitalize",
                              color: colors.blueAccent[600],
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 1,
                            }}
                          >
                            <Clock size={18} /> {slot.time_slot}
                          </Typography>
                          <Typography sx={{ fontWeight: 600, mb: 1 }}>
                            <BoxIcon size={16} /> Total: {slot.total_litres} L
                          </Typography>
                          <Box
                            component="ul"
                            sx={{
                              maxHeight: 130,
                              overflowY: "auto",
                              listStyle: "none",
                              p: 0,
                              m: 0,
                              fontWeight: 400,
                              color:
                                theme.palette.mode === "dark"
                                  ? colors.grey[100]
                                  : colors.grey[900],
                            }}
                          >
                            {slot.farmers.map((f, i) => (
                              <Box
                                key={i}
                                component="li"
                                sx={{
                                  borderBottom: "1px solid #ccc",
                                  py: "2px",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  color:
                                    theme.palette.mode === "dark"
                                      ? colors.grey[100]
                                      : colors.grey[900],
                                }}
                              >
                                <Users size={16} />
                                <Typography>
                                  {f.farmer_name} — {f.litres} L
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      </Card>
                    ))}
                  </Box>
                </Box>
              </Collapse>
            </Card>
          );
        })
      )}

      {/* Daily total */}
      <Box
        mt={4}
        sx={{
          fontWeight: 700,
          color: theme.palette.mode === "dark" ? colors.greenAccent[400] : colors.greenAccent[600],
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Database size={24} />
        <Typography variant="h5">Daily Total: {dailyTotal} L</Typography>
      </Box>

      {/* Nivo Line Chart (Below main content) */}
      <Box
        height={320}
        mt={6}
        sx={{
          borderRadius: 2,
          backgroundColor:
            theme.palette.mode === "dark" ? colors.primary[400] : "#fff",
          border: `1px solid ${theme.palette.mode === "dark"
              ? colors.blueAccent[300]
              : colors.grey[300]
            }`,
          boxShadow: theme.shadows[3],
          color: theme.palette.mode === "dark" ? colors.grey[100] : colors.grey[900],
        }}
      >
        <ResponsiveLine
          data={lineChartData}
          theme={{
            axis: {
              domain: { line: { stroke: colors.grey[100] } },
              legend: { text: { fill: colors.grey[100] } },
              ticks: {
                line: { stroke: colors.grey[100], strokeWidth: 1 },
                text: { fill: colors.grey[100] },
              },
            },
            legends: { text: { fill: colors.grey[100] } },
            tooltip: { container: { color: colors.primary[500] } },
          }}
          colors={{ datum: "color" }}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: "point" }}
          yScale={{ type: "linear", min: "auto", max: "auto", stacked: true }}
          curve="catmullRom"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            orient: "bottom",
            tickSize: 0,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Time Slot",
            legendOffset: 36,
            legendPosition: "middle",
          }}
          axisLeft={{
            orient: "left",
            tickValues: 5,
            tickSize: 3,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Litres (L)",
            legendOffset: -40,
            legendPosition: "middle",
          }}
          enableGridX={false}
          enableGridY={false}
          pointSize={8}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          pointLabelYOffset={-12}
          useMesh={true}
          legends={[
            {
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: "left-to-right",
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: "circle",
              symbolBorderColor: "rgba(0, 0, 0, .5)",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemBackground: "rgba(0, 0, 0, .03)",
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
        />
      </Box>
    </Box>
  );
};

export default Records;