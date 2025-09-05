import React, { useEffect, useState } from "react"
import {
  Box,
  Typography,
  useTheme,
  CircularProgress,
  Grid,
} from "@mui/material";
import { tokens } from "../../theme";
import StatBox from "../scenes/StatBox";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import CalculateIcon from "@mui/icons-material/Calculate";
import QueryStatsIcon from "@mui/icons-material/QueryStats"
import axios from "axios"

export default function AdminMilkSummary() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [summary, setSummary] = useState(null);
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [loading, setLoading] = useState(false)

  const [year, monthNum] = month.split("-")

   const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://maziwasmart.onrender.com/api/summary/monthly?year=${year}&month=${monthNum}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      setSummary(res.data)
    } catch (error) {
      console.error("Error fetching milk summary:", error);
      setSummary(null);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSummary()
  }, [month])

  return (
    <Box m="20px">
      <Typography variant="h4" fontWeight="bold" mb={2}>
        Porters' Monthly Milk Summary
      </Typography>

      {/* Month picker */}
      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        style={{
          padding: "8px",
          borderRadius: "6px",
          border: `1px solid ${colors.grey[400]}`,
          marginBottom: "20px",
        }}
      />

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress color="success" />
        </Box>
      ) : !summary || summary.porters.length === 0 ? (
        <Typography textAlign="center" color={colors.grey[300]}>
          No records found for this month
        </Typography>
      ) : (
        <>
          {/* Summary cards grid */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Box
                bgcolor={colors.primary[400]}
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="12px"
                height="140px"
              >
                <StatBox
                  title={`${summary.total_milk_litres_collected_by_admin_porters} L`}
                  subtitle="Total Litres"
                  progress="0.85"
                  increase="%"
                  icon={
                    <LocalShippingIcon
                      sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                    />
                  }
                />
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box
                bgcolor={colors.primary[400]}
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="12px"
                height="140px"
              >
                <StatBox
                  title={summary.total_deliveries_by_admin_porters}
                  subtitle="Total Deliveries"
                  progress="0.6"
                  increase="%"
                  icon={
                    <DeliveryDiningIcon
                      sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                    />
                  }
                />
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box
                bgcolor={colors.primary[400]}
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="12px"
                height="140px"
              >
                <StatBox
                  title={summary.porters.length}
                  subtitle="Total Porters"
                  progress="0.9"
                  increase="%"
                  icon={
                    <CalculateIcon
                      sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                    />
                  }
                />
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box
                bgcolor={colors.primary[400]}
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="12px"
                height="140px"
              >
                <StatBox
                  title="Stats"
                  subtitle="Overview"
                  progress="0.7"
                  increase="+10%"
                  icon={
                    <QueryStatsIcon
                      sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                    />
                  }
                />
              </Box>
            </Grid>
          </Grid>

          {/* Porters list grid */}
          <Grid container spacing={3}>
            {summary.porters.map((porter) => (
              <Grid key={porter.porter_id} item xs={12} sm={6} md={3}>
                <Box
                  bgcolor={colors.primary[400]}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="12px"
                  height="140px"
                >
                  <StatBox
                    title={`${porter.total_litres} L`}
                    subtitle={porter.porter_name}
                    progress={porter.total_litres > 0 ? "0.7" : "0"}
                    increase={`${porter.total_deliveries} deliveries`}
                    icon={
                      <LocalShippingIcon
                        sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                      />
                    }
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
}
