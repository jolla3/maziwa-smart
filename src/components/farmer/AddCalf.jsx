import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  CircularProgress,
  Fade,
  Grid,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import axios from "axios";
import { AuthContext } from "../../components/PrivateComponents/AuthContext";
import Header from "../scenes/Header";
import AddIcon from "@mui/icons-material/Add";

const API_URL = "https://maziwasmart.onrender.com/api";

const AddCalf = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { token } = useContext(AuthContext);

  const [mode, setMode] = useState("insemination"); // insemination | manual
  const [newCalf, setNewCalf] = useState({
    insemination_id: "",
    animal_name: "",
    gender: "male",
    birth_date: "",
    animal_code: "",
    breed_id: "",
    mother_id: "",
  });

  const [inseminations, setInseminations] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [cows, setCows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchDependencies = async () => {
    if (!token) {
      setError("Authentication token not found. Please log in.");
      return;
    }
    setLoading(true);
    try {
      const [inseminationsRes, breedsRes, cowsRes] = await Promise.all([
        axios.get(`${API_URL}/insemination`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/breed`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/cow`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const availableInseminations =
        inseminationsRes.data.inseminations?.filter(
          (insem) => !insem.has_calved
        ) || [];

      setInseminations(availableInseminations);
      setBreeds(breedsRes.data.breeds || []);
      setCows(cowsRes.data.cows || []);
    } catch (err) {
      console.error("Failed to fetch data:", err.response?.data || err.message);
      setError("Failed to load dependencies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDependencies();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCalf({ ...newCalf, [name]: value });
  };

  const handleModeChange = (_, value) => {
    if (value) setMode(value);
  };

  const handleAddCalf = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("Authentication token not found. Please log in.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        animal_name: newCalf.animal_name,
        gender: newCalf.gender,
        birth_date: newCalf.birth_date,
        animal_code: newCalf.animal_code || null,
        breed_id: newCalf.breed_id,
        mother_id: mode === "manual" ? newCalf.mother_id : null,
        insemination_id: mode === "insemination" ? newCalf.insemination_id : null,
      };

      const response = await axios.post(`${API_URL}/calf`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess(response.data.message || "Offspring registered successfully");
      setNewCalf({
        insemination_id: "",
        animal_name: "",
        gender: "male",
        birth_date: "",
        animal_code: "",
        breed_id: "",
        mother_id: "",
      });

      fetchDependencies();
    } catch (err) {
      console.error("Failed to register offspring:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to register offspring.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess(null);
    setError(null);
  };

  const selectedInsemination = inseminations.find(
    (insem) => insem._id === newCalf.insemination_id
  );

  return (
    <Box m="20px">
      <Header title="REGISTER OFFSPRING" subtitle="Register a new offspring" />

      <Snackbar
        open={!!success || !!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={success ? "success" : "error"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {success || error}
        </Alert>
      </Snackbar>

      <Grid container justifyContent="center" mt={2}>
        <Grid item xs={12} sm={10} md={8} lg={6}>
          <Fade in timeout={800}>
            <Card
              sx={{
                background: colors.primary[400],
                border: `1px solid ${colors.primary[300]}`,
                borderRadius: "16px",
                p: 2,
              }}
            >
              <CardContent>
                <ToggleButtonGroup
                  value={mode}
                  exclusive
                  onChange={handleModeChange}
                  sx={{ mb: 2 }}
                >
                  <ToggleButton value="insemination">Insemination-Based</ToggleButton>
                  <ToggleButton value="manual">Manual</ToggleButton>
                </ToggleButtonGroup>

                <Box component="form" onSubmit={handleAddCalf}>
                  {mode === "insemination" && (
                    <FormControl fullWidth variant="filled" sx={{ mb: 2 }} required>
                      <InputLabel>Insemination Record</InputLabel>
                      <Select
                        name="insemination_id"
                        value={newCalf.insemination_id}
                        onChange={handleInputChange}
                      >
                        {inseminations.length > 0 ? (
                          inseminations.map((insem) => (
                            <MenuItem key={insem._id} value={insem._id}>
                              {insem.cow_name || "Unknown"} -{" "}
                              {insem.bull_name || "Unknown Bull"}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>No available insemination records</MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  )}

                  {mode === "manual" && (
                    <FormControl fullWidth variant="filled" sx={{ mb: 2 }} required>
                      <InputLabel>Mother</InputLabel>
                      <Select
                        name="mother_id"
                        value={newCalf.mother_id}
                        onChange={handleInputChange}
                      >
                        {cows.length > 0 ? (
                          cows.map((cow) => (
                            <MenuItem key={cow._id} value={cow._id}>
                              {cow.cow_name || "Unnamed"} ({cow.species})
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>No cows available</MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  )}

                  {/* Common fields */}
                  <FormControl fullWidth variant="filled" sx={{ mb: 2 }} required>
                    <InputLabel>Breed</InputLabel>
                    <Select
                      name="breed_id"
                      value={newCalf.breed_id}
                      onChange={handleInputChange}
                    >
                      {breeds.length > 0 ? (
                        breeds.map((breed) => (
                          <MenuItem key={breed._id} value={breed._id}>
                            {breed.breed_name} ({breed.species})
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No breeds available</MenuItem>
                      )}
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    variant="filled"
                    label="Offspring Name"
                    name="animal_name"
                    value={newCalf.animal_name}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                    required
                  />

                  <TextField
                    fullWidth
                    variant="filled"
                    label="Animal Code (optional)"
                    name="animal_code"
                    value={newCalf.animal_code}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                    placeholder="e.g., COW-2025-0001"
                  />

                  <FormControl fullWidth variant="filled" sx={{ mb: 2 }} required>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      name="gender"
                      value={newCalf.gender}
                      onChange={handleInputChange}
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="unknown">Unknown</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    variant="filled"
                    label="Birth Date"
                    name="birth_date"
                    type="date"
                    value={newCalf.birth_date}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                    InputLabelProps={{ shrink: true }}
                    required
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      backgroundColor: colors.greenAccent[600],
                      color: colors.grey[100],
                      "&:hover": { backgroundColor: colors.greenAccent[700] },
                    }}
                    disabled={loading}
                    startIcon={
                      loading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />
                    }
                  >
                    Register Offspring
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddCalf;
