import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, CircularProgress, Tooltip, Fade, Grow, TextField, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { AuthContext } from "../PrivateComponents/AuthContext";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PersonIcon from "@mui/icons-material/Person";

// Import for Date Picker
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const MonthlyPorterSummary = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { token } = useContext(AuthContext);

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        setError(null);

        // Format the selected month for the API query
        const year = selectedMonth.getFullYear();
        const month = String(selectedMonth.getMonth() + 1).padStart(2, '0');
        const monthParam = `${year}-${month}`;

        const res = await fetch(
          `https://maziwasmart.onrender.com/api/summary/monthlyPorterSummary?month=${monthParam}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch monthly summary: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        setSummary(data);
      } catch (error) {
        console.error("Error fetching summary:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchSummary();
    }
  }, [token, selectedMonth]);

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="60vh"
        gap={2}
      >
        <CircularProgress size={60} sx={{ color: colors.blueAccent[500] }} />
        <Typography variant="h6" sx={{ color: theme.palette.text.secondary }}>
          Loading porter summary...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
        <Typography variant="h6" sx={{ color: colors.redAccent[500] }} align="center" mb={2}>
          Error loading summary data
        </Typography>
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }} align="center">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!summary) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
        <Typography variant="h6" sx={{ color: colors.yellowAccent[500] }} align="center">
          No summary data available.
        </Typography>
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }} align="center" mt={1}>
          Please try again later or contact support.
        </Typography>
      </Box>
    );
  }

  // Enhanced columns with better styling and functionality
  const columns = [
    {
      field: "farmer_code",
      headerName: "Farmer Code",
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ value }) => (
        <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
          <PersonIcon sx={{ color: colors.blueAccent[300], fontSize: 16 }} />
          <Typography variant="body2" fontWeight="bold" sx={{ color: theme.palette.text.primary }}>
            {value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "farmer_name",
      headerName: "Farmer Name",
      flex: 2,
      cellClassName: "name-column--cell",
      renderCell: ({ value }) => (
        <Tooltip title={`View ${value}'s detailed records`} arrow>
          <Typography
            variant="body2"
            sx={{
              color: colors.greenAccent[300],
              fontWeight: "bold",
              cursor: "pointer",
              "&:hover": {
                color: colors.greenAccent[200],
                textDecoration: "underline"
              }
            }}
          >
            {value}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: "total_litres",
      headerName: "Total Litres",
      flex: 1.2,
      headerAlign: 'center',
      renderCell: ({ row }) => {
        const isHighProducer = row.total_litres > 100;
        const isVeryHighProducer = row.total_litres > 200;

        return (
          <Tooltip title={`${row.farmer_name} produced ${row.total_litres} litres this month`} arrow>
            <Box
              width="85%"
              m="0 auto"
              p="8px 12px"
              display="flex"
              justifyContent="center"
              alignItems="center"
              backgroundColor={
                isVeryHighProducer
                  ? colors.greenAccent[500]
                  : isHighProducer
                  ? colors.greenAccent[600]
                  : colors.greenAccent[700]
              }
              borderRadius="8px"
              sx={{
                transition: "all 0.3s ease",
                cursor: "pointer",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: `0 4px 12px ${colors.greenAccent[800]}40`,
                },
                color: theme.palette.getContrastText(
                  isVeryHighProducer
                    ? colors.greenAccent[500]
                    : isHighProducer
                    ? colors.greenAccent[600]
                    : colors.greenAccent[700]
                )
              }}
            >
              <AgricultureIcon sx={{ fontSize: 18 }} />
              <Typography
                sx={{ ml: "8px", fontWeight: 'bold', fontSize: '0.85rem' }}
              >
                {row.total_litres}L
              </Typography>
              {isVeryHighProducer && (
                <TrendingUpIcon sx={{ fontSize: 16, ml: 0.5 }} />
              )}
            </Box>
          </Tooltip>
        );
      },
    },
  ];

  const rows = summary.farmers.map((farmer, index) => ({
    id: index + 1,
    ...farmer,
  }));

  // Calculate additional stats
  const averageLitresPerFarmer = summary.total_litres_for_month / summary.farmers.length;
  const highProducers = summary.farmers.filter(f => f.total_litres > 100).length;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Fade in timeout={800}>
        <Box m="20px" sx={{ minHeight: '100vh', bgcolor: theme.palette.background.default }}>
          {/* Enhanced Header with Date Picker */}
          <Grow in timeout={1000}>
            <Box mb={4} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
              <Box>
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{
                    color: theme.palette.text.primary,
                    background: `linear-gradient(135deg, ${colors.blueAccent[400]}, ${colors.greenAccent[400]})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    mb: 1
                  }}
                >
                  Monthly Porter Summary
                </Typography>
                <Typography variant="h6" sx={{ color: theme.palette.text.secondary }}>
                  {summary.month}
                </Typography>
              </Box>
              <Box sx={{ minWidth: 200, mt: { xs: 2, sm: 0 } }}>
                <DatePicker
                  views={['year', 'month']}
                  label="Select Month"
                  value={selectedMonth}
                  onChange={(newValue) => {
                    setSelectedMonth(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: theme.palette.background.paper,
                          "& fieldset": {
                            borderColor: theme.palette.divider,
                          },
                          "&:hover fieldset": {
                            borderColor: colors.blueAccent[500],
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: colors.blueAccent[500],
                          },
                          "& input": {
                            color: theme.palette.text.primary,
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: theme.palette.text.secondary,
                        },
                        "& .MuiSvgIcon-root": {
                          color: theme.palette.text.secondary,
                        },
                      }}
                    />
                  )}
                />
              </Box>
            </Box>
          </Grow>

          {/* Stats Cards */}
          <Box display="flex" flexWrap="wrap" gap={2} mb={4}>
            <Grow in timeout={600}>
              <Box
                p="20px"
                borderRadius="16px"
                bgcolor={colors.blueAccent[700]}
                display="flex"
                alignItems="center"
                gap={2}
                minWidth="250px"
                sx={{
                  transition: 'all 0.4s ease',
                  cursor: "pointer",
                  color: theme.palette.getContrastText(colors.blueAccent[700]),
                  '&:hover': {
                    transform: 'translateY(-4px) scale(1.02)',
                    boxShadow: `0 8px 25px ${colors.blueAccent[900]}60`,
                    bgcolor: colors.blueAccent[600],
                  }
                }}
              >
                <Box
                  p="12px"
                  borderRadius="50%"
                  bgcolor={colors.blueAccent[500]}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  sx={{ color: theme.palette.getContrastText(colors.blueAccent[500]) }}
                >
                  <LocalShippingIcon sx={{ fontSize: 32 }} />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>Porter</Typography>
                  <Typography variant="h5" fontWeight="bold">{summary.porter}</Typography>
                </Box>
              </Box>
            </Grow>

            <Grow in timeout={800}>
              <Box
                p="20px"
                borderRadius="16px"
                bgcolor={colors.greenAccent[600]}
                minWidth="250px"
                sx={{
                  transition: 'all 0.4s ease',
                  cursor: "pointer",
                  color: theme.palette.getContrastText(colors.greenAccent[600]),
                  '&:hover': {
                    transform: 'translateY(-4px) scale(1.02)',
                    boxShadow: `0 8px 25px ${colors.greenAccent[800]}60`,
                    bgcolor: colors.greenAccent[500],
                  }
                }}
              >
                <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>Total Litres</Typography>
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                  {summary.total_litres_for_month.toLocaleString()}L
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.7, fontSize: '0.75rem' }}>
                  Avg: {averageLitresPerFarmer.toFixed(1)}L per farmer
                </Typography>
              </Box>
            </Grow>

            <Grow in timeout={1000}>
              <Box
                p="20px"
                borderRadius="16px"
                bgcolor={colors.yellowAccent[600]}
                display="flex"
                alignItems="center"
                gap={2}
                minWidth="250px"
                sx={{
                  transition: 'all 0.4s ease',
                  cursor: "pointer",
                  color: theme.palette.getContrastText(colors.yellowAccent[600]),
                  '&:hover': {
                    transform: 'translateY(-4px) scale(1.02)',
                    boxShadow: `0 8px 25px ${colors.yellowAccent[800]}60`,
                    bgcolor: colors.yellowAccent[500],
                  }
                }}
              >
                <Box
                  p="12px"
                  borderRadius="50%"
                  bgcolor={colors.yellowAccent[700]}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  sx={{ color: theme.palette.getContrastText(colors.yellowAccent[700]) }}
                >
                  <DeliveryDiningIcon sx={{ fontSize: 32 }} />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>Deliveries</Typography>
                  <Typography variant="h5" fontWeight="bold">{summary.total_deliveries}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.7, fontSize: '0.75rem' }}>
                    {highProducers} high producers ({'>100L'})
                  </Typography>
                </Box>
              </Box>
            </Grow>
          </Box>

          {/* DataGrid */}
          <Grow in timeout={1200}>
            <Box
              m="20px 0 0 0"
              height="65vh"
              sx={{
                "& .MuiDataGrid-root": {
                  border: "none",
                  borderRadius: "16px",
                  overflow: "hidden",
                  backgroundColor: theme.palette.background.paper,
                  boxShadow: theme.shadows[3],
                },
                "& .MuiDataGrid-cell": {
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  padding: "16px 12px",
                  color: theme.palette.text.primary,
                },
                "& .name-column--cell": {
                  color: colors.greenAccent[300],
                  fontWeight: "bold",
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: colors.blueAccent[700],
                  borderBottom: "none",
                  fontSize: "14px",
                  fontWeight: "bold",
                  minHeight: "60px !important",
                },
                "& .MuiDataGrid-virtualScroller": {
                  backgroundColor: theme.palette.background.paper,
                },
                "& .MuiDataGrid-footerContainer": {
                  borderTop: "none",
                  backgroundColor: colors.blueAccent[700],
                  minHeight: "60px",
                },
                "& .MuiDataGrid-row": {
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                    cursor: "pointer",
                  },
                  '&:nth-of-type(odd)': {
                    backgroundColor: theme.palette.action.hover,
                  },
                  '&:nth-of-type(even)': {
                    backgroundColor: theme.palette.action.selected,
                  }
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  color: theme.palette.getContrastText(colors.blueAccent[700]),
                  fontWeight: "bold",
                  fontSize: "0.95rem",
                },
                "& .MuiDataGrid-selectedRowCount": {
                  color: theme.palette.getContrastText(colors.blueAccent[700]),
                },
                "& .MuiDataGrid-toolbarContainer": {
                  color: theme.palette.text.primary,
                }
              }}
            >
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[5, 10, 20]}
                disableSelectionOnClick
                sx={{
                  '& .MuiDataGrid-cell:focus': {
                    outline: `2px solid ${colors.blueAccent[500]}`,
                  },
                }}
              />
            </Box>
          </Grow>

          <style jsx>{`
            @keyframes loadBar {
              0% { width: 0%; }
              100% { width: 60%; }
            }
          `}</style>
        </Box>
      </Fade>
    </LocalizationProvider>
  );
};

export default MonthlyPorterSummary;