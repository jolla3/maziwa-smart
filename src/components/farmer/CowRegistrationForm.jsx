import React, { useState, useContext, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { useTheme } from '@mui/material';
import { tokens } from '../../theme';
import axios from 'axios';
import { AuthContext } from '../../components/PrivateComponents/AuthContext';
import Header from '../scenes/Header';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';
import { ArrowBigLeftDashIcon } from 'lucide-react';

const CowRegistrationForm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    cow_name: '',
    cow_code: '',
    breed_id: '',
    gender: '',
    birth_date: ''
  });
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await axios.get('https://maziwasmart.onrender.com/api/breed', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBreeds(response.data.breeds);
      } catch (err) {
        console.error('Failed to fetch breeds:', err);
        setError('Failed to load breeds. Please try again.');
      }
    };
    fetchBreeds();
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
        cow_code: parseInt(formData.cow_code, 10),
      };
      
      const response = await axios.post('https://maziwasmart.onrender.com/api/cow', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      setSuccess("Cow registered successfully!");
      setFormData({
        cow_name: '',
        cow_code: '',
        breed_id: '',
        gender: '',
        birth_date: ''
      });
    //   setTimeout(() => navigate("/farmerdashboard/cows"), 2000); // Navigate back after 2 seconds
    } catch (err) {
      console.error("Cow registration error:", err.response?.data || err.message);
      setError("Failed to register cow. Please check your data.");
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
        title="REGISTER NEW COW"
        subtitle="Fill out the form to add a new cow to the herd"
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
        onClick={() => navigate("/farmerdashboard/cows")} // <-- Add this onClick handler
      >
        Back
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
          Cow Details
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
            label="Cow Name"
            name="cow_name"
            value={formData.cow_name}
            onChange={handleChange}
            sx={{ gridColumn: "span 2" }}
            required
          />
          <TextField
            fullWidth
            variant="filled"
            type="number"
            label="Cow Code"
            name="cow_code"
            value={formData.cow_code}
            onChange={handleChange}
            sx={{ gridColumn: "span 2" }}
            required
          />
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
            type="date"
            label="Birth Date"
            name="birth_date"
            value={formData.birth_date}
            onChange={handleChange}
            sx={{ gridColumn: "span 4" }}
            InputLabelProps={{ shrink: true }}
            required
          />
        </Box>
        <Box display="flex" justifyContent="flex-end" mt="20px">
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
            sx={{
              backgroundColor: colors.greenAccent[600],
              color: colors.grey[100],
              "&:hover": { backgroundColor: colors.greenAccent[700] },
            }}
          >
            {loading ? "Registering..." : "Register Cow"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CowRegistrationForm;