import React, { useState, useContext, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import { useTheme } from '@mui/material';
import { tokens } from '../../theme';
import axios from 'axios';
import { AuthContext } from '../../components/PrivateComponents/AuthContext';
import Header from '../scenes/Header';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';
import { ArrowBigLeftDashIcon } from 'lucide-react';
import { AgricultureOutlined as CalfIcon } from '@mui/icons-material';

const AddCalfForm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    cow_name: '',
    breed_id: '',
    gender: '',
    birth_date: '',
    mother_id: '',
  });
  const [breeds, setBreeds] = useState([]);
  const [cows, setCows] = useState([]); // State to store potential mother cows
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError('Authentication token not found.');
        return;
      }

      try {
        const [breedsRes, cowsRes] = await Promise.all([
          axios.get('https://maziwasmart.onrender.com/api/breed', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('https://maziwasmart.onrender.com/api/cow', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // Set fetched breeds
        setBreeds(breedsRes.data.breeds);

        // Filter cows to show only those with the stage 'cow' to serve as mothers
        const potentialMothers = cowsRes.data.cows.filter(cow => cow.stage === 'cow' && cow.gender === 'female');
        setCows(potentialMothers);

      } catch (err) {
        console.error('Failed to fetch data:', err.response?.data || err.message);
        setError('Failed to load form data. Please try again.');
      }
    };
    fetchData();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Authentication token not found. Please log in.');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        ...formData,
        // The `mother_id` should be optional; don't send an empty string
        mother_id: formData.mother_id || undefined,
      };

      const response = await axios.post('https://maziwasmart.onrender.com/api/calf', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess("🐄 Calf registered successfully!");
      setFormData({
        cow_name: '',
        breed_id: '',
        gender: '',
        birth_date: '',
        mother_id: '',
      });
      // setTimeout(() => navigate("/farmerdashboard/cows"), 2000);
    } catch (err) {
      console.error("Calf registration error:", err.response?.data || err.message);
      setError("Failed to register calf. Please check the data and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess(null);
    setError(null);
  };

  return (
    <Box m="20px">
      <Header
        title="REGISTER NEW CALF"
        subtitle="Fill out the form to add a new calf to the herd"
      />
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
      <Button
        variant="contained"
        sx={{
          backgroundColor: colors.greenAccent[600],
          color: colors.grey[100],
          "&:hover": { backgroundColor: colors.greenAccent[700] },
        }}
        startIcon={<ArrowBigLeftDashIcon />}
        onClick={() => navigate("/farmerdashboard/cows")}
      >
        Back to Cows
      </Button>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          background: colors.primary[400],
          borderRadius: "16px",
          p: 4,
          mt: 4,
        }}
      >
        <Typography
          variant="h5"
          fontWeight="600"
          color={colors.grey[100]}
          mb={2}
        >
          Calf Details
        </Typography>
        <Box
          display="grid"
          gap="30px"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
        >
          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="Calf Name"
            name="cow_name"
            value={formData.cow_name}
            onChange={handleChange}
            sx={{ gridColumn: "span 2" }}
            required
          />
          <TextField
            fullWidth
            variant="filled"
            select
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            sx={{ gridColumn: "span 2" }}
            required
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
          </TextField>
          <TextField
            fullWidth
            variant="filled"
            select
            label="Breed"
            name="breed_id"
            value={formData.breed_id}
            onChange={handleChange}
            sx={{ gridColumn: "span 2" }}
            required
          >
            {breeds.map((option) => (
              <MenuItem key={option._id} value={option._id}>
                {option.breed_name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            variant="filled"
            type="date"
            label="Birth Date"
            name="birth_date"
            value={formData.birth_date}
            onChange={handleChange}
            sx={{ gridColumn: "span 2" }}
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            fullWidth
            variant="filled"
            select
            label="Mother (Optional)"
            name="mother_id"
            value={formData.mother_id}
            onChange={handleChange}
            sx={{ gridColumn: "span 4" }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {cows.map((option) => (
              <MenuItem key={option._id} value={option._id}>
                {option.cow_name}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box display="flex" justifyContent="flex-end" mt="20px">
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <CalfIcon />}
            sx={{
              backgroundColor: colors.greenAccent[600],
              color: colors.grey[100],
              "&:hover": { backgroundColor: colors.greenAccent[700] },
            }}
          >
            {loading ? "Registering..." : "Register Calf"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddCalfForm;