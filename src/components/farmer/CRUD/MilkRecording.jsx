import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
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
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../PrivateComponents/AuthContext";
import Header from "../../scenes/Header";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
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
  }, [token]);

  const submitMilk = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(
        `${BASE_API}/cow/${cowId}`,
        { litres: Number(litres) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(res.data.message);
      setLitres("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to record milk");
    } finally {
      setLoading(false);
    }
  };


  const handleBack = () => {
    navigate("/fmr.drb/animal-milk-summary");
  };

  return (
    <Box px={2} py={2} maxWidth={420} mx="auto">
      {/* Header with back button */}
      <Box display="flex" alignItems="center" mb={1}>
        <IconButton onClick={handleBack}>
          <ArrowBackIosNewOutlinedIcon sx={{ color: "#0369a1" }} />
        </IconButton>
        <Typography variant="h5" fontWeight={800} color="#0f172a">
          Milk Recording
        </Typography>
      </Box>

      <Typography mb={2} color="#075985">
        Quick daily milk entry per cow
      </Typography>

      <Snackbar open={!!error || !!success} autoHideDuration={5000}>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
      </Snackbar>

      <Card
        sx={{
          mt: 2,
          borderRadius: 4,
          background: "linear-gradient(180deg, #ecfeff, #e0f2fe)",
          border: "1px solid #bae6fd",
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <LocalDrinkOutlinedIcon sx={{ color: "#0284c7" }} />
            <Typography variant="h6" fontWeight={700} color="#0f172a">
              Record Milk
            </Typography>
          </Box>

          <Box component="form" onSubmit={submitMilk}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel sx={{ color: "#0369a1" }}>Select Cow</InputLabel>
              <Select
                value={cowId}
                onChange={(e) => setCowId(e.target.value)}
                sx={{ backgroundColor: "#ffffff" }}
              >
                {fetching ? (
                  <MenuItem disabled>Loading cows...</MenuItem>
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
              value={litres}
              onChange={(e) => setLitres(e.target.value)}
              inputProps={{ step: 0.1 }}
              sx={{
                mb: 3,
                backgroundColor: "#ffffff",
              }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              startIcon={loading ? <CircularProgress size={18} /> : <AddIcon />}
              disabled={loading || !cowId}
              sx={{
                background: "linear-gradient(90deg, #22d3ee, #38bdf8)",
                color: "#083344",
                fontWeight: 800,
                py: 1.4,
                borderRadius: 3,
                '&:hover': { background: '#0ea5e9' },
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
