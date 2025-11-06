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
import { tokens } from '../../../theme';
import axios from 'axios';
import { AuthContext } from '../../PrivateComponents/AuthContext';
import Header from '../../scenes/Header';
import AddIcon from '@mui/icons-material/Add';
import GrassIcon from '@mui/icons-material/Grass';

const MilkRecording = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { token } = useContext(AuthContext);

  const [cows, setCows] = useState([]);
  const [formData, setFormData] = useState({
    cowId: '',
    litres: '',
    // ❌ Removed the 'date' field from the state
  });
  const [loading, setLoading] = useState(false);
  const [fetchCowsLoading, setFetchCowsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchCows = async () => {
    if (!token) {
      setError('Authentication token not found. Please log in.');
      setFetchCowsLoading(false);
      return;
    }
    setFetchCowsLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://maziwasmart.onrender.com/api/cow', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          gender: 'female',
          stage: 'cow',
        },
      });
      setCows(response.data.cows);
    } catch (err) {
      console.error('Failed to fetch cows:', err.response?.data || err.message);
      setError('Failed to fetch cows. Please try again later.');
    } finally {
      setFetchCowsLoading(false);
    }
  };

  useEffect(() => {
    fetchCows();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRecordMilk = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Authentication token not found. Please log in.');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      // ✅ Payload now only contains 'litres'
      const payload = {
        litres: parseFloat(formData.litres),
      };

      const response = await axios.post(
        `https://maziwasmart.onrender.com/api/cow/${formData.cowId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess(response.data.message);
      setFormData({
        ...formData,
        litres: '', // Clear the litres field for a new entry
      });
    } catch (err) {
      console.error('Failed to record milk:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to record milk.');
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
        title="MILK RECORDING"
        subtitle="Add daily milk production records for your cows"
      />
      <Snackbar open={!!success || !!error} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={success ? "success" : "error"} variant="filled" sx={{ width: '100%' }}>
          {success || error}
        </Alert>
      </Snackbar>

      <Grid container spacing={4} mt={2}>
        {/* Milk Recording Form */}
        <Grid item xs={12} md={6}>
          <Fade in timeout={800}>
            <Card sx={{ background: colors.primary[400], border: `1px solid ${colors.primary[300]}`, borderRadius: '16px', p: 2, height: '100%' }}>
              <CardContent>
                <Typography variant="h5" fontWeight="600" color={colors.grey[100]} mb={2}>
                  Record Milk Production
                </Typography>
                <Box component="form" onSubmit={handleRecordMilk}>
                  {fetchCowsLoading ? (
                    <Box display="flex" justifyContent="center" p={2}>
                      <CircularProgress color="success" />
                    </Box>
                  ) : (
                    <FormControl fullWidth variant="filled" sx={{ mb: 2 }} required>
                      <InputLabel>Select Cow</InputLabel>
                      <Select
                        name="cowId"
                        value={formData.cowId}
                        onChange={handleInputChange}
                      >
                        {cows.length > 0 ? (
                          cows.map((cow) => (
                            <MenuItem key={cow._id} value={cow._id}>
                              {cow.cow_name} ({cow.cow_id})
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled>No female cows found in 'cow' stage</MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  )}

                  <TextField
                    fullWidth
                    variant="filled"
                    label="Litres of Milk"
                    name="litres"
                    type="number"
                    value={formData.litres}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                    required
                    inputProps={{ step: "0.1" }}
                    placeholder="e.g., 15.5"
                  />

                  {/* ❌ Removed the date input field */}

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        backgroundColor: colors.greenAccent[600],
                        color: colors.grey[100],
                        '&:hover': { backgroundColor: colors.greenAccent[700] },
                      }}
                      disabled={loading || !formData.cowId}
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
                    >
                      {loading ? 'Recording...' : 'Record Milk'}
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MilkRecording;