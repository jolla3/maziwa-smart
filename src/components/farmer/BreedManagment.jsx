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
  Chip,
  CardActions,
} from '@mui/material';
import { useTheme } from '@mui/material';
import { tokens } from '../../theme';
import axios from 'axios';
import { AuthContext } from '../../components/PrivateComponents/AuthContext';
import Header from '../scenes/Header';
import AddIcon from '@mui/icons-material/Add';
import GrassIcon from '@mui/icons-material/Grass';
import PetsIcon from '@mui/icons-material/Pets';

const BreedManagement = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { token } = useContext(AuthContext);

  const [breeds, setBreeds] = useState([]);
  const [newBreed, setNewBreed] = useState({
    breed_name: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchBreeds = async () => {
    if (!token) {
      setError('Authentication token not found. Please log in.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://maziwasmart.onrender.com/api/breed', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBreeds(response.data.breeds);
    } catch (err) {
      console.error('Failed to fetch breeds:', err.response?.data || err.message);
      setError('Failed to fetch breeds. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBreeds();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBreed({ ...newBreed, [name]: value });
  };

  const handleCreateBreed = async (e) => {
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
        breed_name: newBreed.breed_name,
        description: newBreed.description,
      };

      const response = await axios.post('https://maziwasmart.onrender.com/api/breed', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess(response.data.message);
      setNewBreed({
        breed_name: '',
        description: '',
      });
      fetchBreeds();
    } catch (err) {
      console.error('Failed to create breed:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to create breed.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess(null);
    setError(null);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Box m="20px">
      <Header
        title="BREED MANAGEMENT"
        subtitle="Register new breeds to use in your cow records"
      />
      <Snackbar open={!!success || !!error} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={success ? "success" : "error"} variant="filled" sx={{ width: '100%' }}>
          {success || error}
        </Alert>
      </Snackbar>

      <Grid container spacing={4} mt={2}>
        {/* Create Breed Form */}
        <Grid item xs={12} md={5}>
          <Fade in timeout={800}>
            <Card sx={{ background: colors.primary[400], border: `1px solid ${colors.primary[300]}`, borderRadius: '16px', p: 2, height: '100%' }}>
              <CardContent>
                <Typography variant="h5" fontWeight="600" color={colors.grey[100]} mb={2}>
                  Register New Breed
                </Typography>
                <Box component="form" onSubmit={handleCreateBreed}>
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Breed Name"
                    name="breed_name"
                    value={newBreed.breed_name}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                    required
                    placeholder="e.g., Holstein Friesian"
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Description"
                    name="description"
                    value={newBreed.description}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                    required
                    multiline
                    rows={4}
                    placeholder="Describe the breed characteristics, milk production, etc."
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
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
                      {loading ? 'Registering...' : 'Register Breed'}
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>

        {/* Breeds List */}
        <Grid item xs={12} md={7}>
          <Fade in timeout={1000}>
            <Card sx={{ background: colors.primary[400], border: `1px solid ${colors.primary[300]}`, borderRadius: '16px', p: 2, maxHeight: '600px', overflowY: 'auto' }}>
              <CardContent>
                <Typography variant="h5" fontWeight="600" color={colors.grey[100]} mb={2}>
                  Your Registered Breeds ({breeds.length})
                </Typography>
                {loading ? (
                  <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <CircularProgress color="success" />
                  </Box>
                ) : breeds.length === 0 ? (
                  <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="200px">
                    <PetsIcon sx={{ fontSize: 60, color: colors.grey[400], mb: 2 }} />
                    <Typography color={colors.grey[300]} variant="h6">No breeds registered yet</Typography>
                    <Typography color={colors.grey[400]} variant="body2">Add your first breed to get started</Typography>
                  </Box>
                ) : (
                  <Grid container spacing={2}>
                    {breeds.map((breed) => (
                      <Grid item xs={12} key={breed._id}>
                        <Card sx={{
                          background: colors.primary[500],
                          border: `1px solid ${colors.primary[300]}`,
                          borderRadius: '12px',
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }
                        }}>
                          <CardContent sx={{ p: 2 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                              <Box flex={1}>
                                <Typography variant="h6" fontWeight="bold" color={colors.greenAccent[400]} mb={1}>
                                  <GrassIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                  {breed.breed_name}
                                </Typography>
                                <Typography variant="body2" color={colors.grey[300]} sx={{ mb: 1 }}>
                                  {breed.description}
                                </Typography>
                                <Typography variant="caption" color={colors.grey[400]}>
                                  Created: {formatDate(breed.created_at || Date.now())}
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                          {/* ❌ REMOVED: CardActions for editing/deleting breeds */}
                          {/* <CardActions sx={{ p: 2, pt: 0, justifyContent: 'flex-end' }}>
                            ...
                          </CardActions> */}
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Fade>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BreedManagement;