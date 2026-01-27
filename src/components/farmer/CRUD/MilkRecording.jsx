import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../PrivateComponents/AuthContext";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalDrinkOutlinedIcon from "@mui/icons-material/LocalDrinkOutlined";

const MilkRecording = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [cows, setCows] = useState([]);
  const [cowId, setCowId] = useState("");
  const [litres, setLitres] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const BASE_API = process.env.REACT_APP_API_BASE;

  // Fetch cows on component mount
  useEffect(() => {
    const fetchCows = async () => {
      try {
        const res = await axios.get(`${BASE_API}/cow`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { gender: "female", stage: "cow" },
        });
        setCows(res.data.cows || []);
      } catch (err) {
        setError("Failed to load cows");
      } finally {
        setFetching(false);
      }
    };

    fetchCows();
  }, [token, BASE_API]);

  const submitMilk = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await axios.post(
        `${BASE_API}/cow/${cowId}`,
        { litres: Number(litres) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(res.data.message || "Milk recorded successfully!");
      setLitres("");
      setCowId("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to record milk");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/fmr.drb/animal-milk-summary");
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setError(null);
    setSuccess(null);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, minHeight: "100vh" }}>
      {/* Header with back button */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <IconButton
          onClick={handleBack}
          sx={{
            backgroundColor: "#0284c7",
            color: "#ffffff",
            borderRadius: "12px",
            width: 44,
            height: 44,
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "#0369a1",
              transform: "translateX(-4px)",
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight={800} color="#0f172a">
          Milk Recording
        </Typography>
      </Box>

      <Typography mb={3} color="#075985" variant="body1">
        Quick daily milk entry per cow
      </Typography>

      {/* Snackbar */}
      <Snackbar
        open={!!error || !!success}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={error ? "error" : "success"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {error || success}
        </Alert>
      </Snackbar>

      <Card
        sx={{
          borderRadius: { xs: 3, md: 4 },
          background: "linear-gradient(180deg, #ecfeff, #e0f2fe)",
          border: "1px solid #bae6fd",
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.1)",
          },
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Box display="flex" alignItems="center" gap={1.5} mb={3}>
            <LocalDrinkOutlinedIcon sx={{ color: "#0284c7", fontSize: 28 }} />
            <Typography variant="h6" fontWeight={700} color="#0f172a">
              Record Milk
            </Typography>
          </Box>

          <Box component="form" onSubmit={submitMilk}>
            <FormControl fullWidth sx={{ mb: 2.5 }}>
              <InputLabel sx={{ color: "#0369a1", fontWeight: 500 }}>
                Select Cow
              </InputLabel>
              <Select
                value={cowId}
                label="Select Cow"
                onChange={(e) => setCowId(e.target.value)}
                sx={{
                  backgroundColor: "#ffffff",
                  "& .MuiOutlinedInput-root": {
                    transition: "all 0.2s ease",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(2, 132, 199, 0.1)",
                    },
                  },
                }}
                disabled={fetching}
              >
                {fetching ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} sx={{ mr: 1 }} /> Loading cows...
                  </MenuItem>
                ) : cows.length ? (
                  cows.map((cow) => (
                    <MenuItem key={cow._id} value={cow._id}>
                      {cow.cow_name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No cows found</MenuItem>
                )}
              </Select>
            </FormControl>

            <TextField
              label="Litres Collected"
              type="number"
              fullWidth
              required
              value={litres}
              onChange={(e) => setLitres(e.target.value)}
              inputProps={{ step: 0.1, min: 0 }}
              sx={{
                mb: 3.5,
                backgroundColor: "#ffffff",
                "& .MuiOutlinedInput-root": {
                  transition: "all 0.2s ease",
                  "&:hover": {
                    boxShadow: "0 4px 12px rgba(2, 132, 199, 0.1)",
                  },
                },
              }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <AddIcon />}
              disabled={loading || !cowId || !litres}
              sx={{
                background: "linear-gradient(90deg, #22d3ee, #38bdf8)",
                color: "#083344",
                fontWeight: 800,
                py: { xs: 1.2, md: 1.4 },
                borderRadius: 3,
                fontSize: { xs: "0.9rem", md: "1rem" },
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "linear-gradient(90deg, #06b6d4, #0ea5e9)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 20px rgba(2, 132, 199, 0.3)",
                },
                "&.Mui-disabled": {
                  background: "linear-gradient(90deg, #d1d5db, #e5e7eb)",
                  color: "#9ca3af",
                },
              }}
            >
              {loading ? "Recording…" : "Save Milk Entry"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MilkRecording;