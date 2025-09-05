import React, { useState, useEffect, useContext } from 'react';
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
} from '@mui/material';
import { useTheme } from '@mui/material';
import { tokens } from '../../theme';
import axios from 'axios';
import { AuthContext } from '../../components/PrivateComponents/AuthContext';
import Header from '../scenes/Header';
import AddIcon from '@mui/icons-material/Add';
import GrassIcon from '@mui/icons-material/Grass';

const AddCalf = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { token } = useContext(AuthContext);

  const [newCalf, setNewCalf] = useState({
    cow_name: '',
    gender: 'Male', // Default to Male, can be changed
    breed_id: '',
    birth_date: '',
    mother_id: '',
  });
  const [breeds, setBreeds] = useState([]);
  const [femaleCows, setFemaleCows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchDependencies = async () => {
    if (!token) {
      setError('Authentication token not found. Please log in.');
      return;
    }
    setLoading(true);
    try {
      // Fetch all cows to find potential mothers
      const cowsRes = await axios.get('https://maziwasmart.onrender.com/api/cow', {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Filter for female cows
      const females = cowsRes.data.cows.filter(cow => cow.gender === 'Female' && cow.is_active);
      setFemaleCows(females);

      // Fetch all breeds for the dropdown
      const breedsRes = await axios.get('https://maziwasmart.onrender.com/api/breed', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBreeds(breedsRes.data.breeds);
    } catch (err) {
      console.error('Failed to fetch data:', err.response?.data || err.message);
      setError('Failed to load required data. Please try again later.');
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

  const handleAddCalf = async (e) => {
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
        cow_name: newCalf.cow_name,
        gender: newCalf.gender,
        breed_id: newCalf.breed_id,
        birth_date: newCalf.birth_date,
        mother_id: newCalf.mother_id || null, // Ensure null if no mother is selected
      };

      // ⚠️ Note: I am using '/api/calf' as a placeholder. Please replace this
      // with the correct endpoint for your `addCalf` function.
      const response = await axios.post('https://maziwasmart.onrender.com/api/calf', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess(response.data.message);
      setNewCalf({
        cow_name: '',
        gender: 'female',
        breed_id: '',
        birth_date: '',
        mother_id: '',
      });
    } catch (err) {
      console.error('Failed to register calf:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to register calf.');
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
        title="REGISTER A NEW CALF"
        subtitle="Add a new calf to your herd and link it to its mother"
      />
      
      <Snackbar open={!!success || !!error} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={success ? "success" : "error"} variant="filled" sx={{ width: '100%' }}>
          {success || error}
        </Alert>
      </Snackbar>

      <Grid container justifyContent="center" mt={2}>
        <Grid item xs={12} sm={10} md={8} lg={6}>
          <Fade in timeout={800}>
            <Card sx={{ background: colors.primary[400], border: `1px solid ${colors.primary[300]}`, borderRadius: '16px', p: 2 }}>
              <CardContent>
                {loading ? (
                  <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                    <CircularProgress color="success" />
                  </Box>
                ) : (
                  <Box component="form" onSubmit={handleAddCalf}>
                    <Typography variant="h5" fontWeight="600" color={colors.grey[100]} mb={2}>
                      Calf Details
                    </Typography>
                    <TextField
                      fullWidth
                      variant="filled"
                      label="Calf Name"
                      name="cow_name"
                      value={newCalf.cow_name}
                      onChange={handleInputChange}
                      sx={{ mb: 2 }}
                      required
                    />
                    <FormControl fullWidth variant="filled" sx={{ mb: 2 }} required>
                      <InputLabel>Gender</InputLabel>
                      <Select
                        name="gender"
                        value={newCalf.gender}
                        onChange={handleInputChange}
                      >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                      </Select>
                    </FormControl>
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
                              {breed.breed_name}
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
                      label="Birth Date"
                      name="birth_date"
                      type="date"
                      value={newCalf.birth_date}
                      onChange={handleInputChange}
                      sx={{ mb: 2 }}
                      InputLabelProps={{ shrink: true }}
                      required
                    />
                    <FormControl fullWidth variant="filled" sx={{ mb: 2 }}>
                      <InputLabel>Mother (optional)</InputLabel>
                      <Select
                        name="mother_id"
                        value={newCalf.mother_id}
                        onChange={handleInputChange}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {femaleCows.map((cow) => (
                          <MenuItem key={cow._id} value={cow._id}>
                            {cow.cow_name} ({cow.cow_code})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        backgroundColor: colors.greenAccent[600],
                        color: colors.grey[100],
                        '&:hover': { backgroundColor: colors.greenAccent[700] },
                      }}
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
                    >
                      Register Calf
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Fade>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddCalf;