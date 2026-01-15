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
  Card,
  CardContent,
  Grid,
  Skeleton
} from '@mui/material';
import { useTheme } from '@mui/material';
import { tokens } from '../../../theme';
import axios from 'axios';
import { AuthContext } from '../../PrivateComponents/AuthContext';
import Header from '../../scenes/Header';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import PetsIcon from '@mui/icons-material/Pets';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import GrassIcon from '@mui/icons-material/Grass';

const AnimalRegistration = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [formData, setFormData] = useState({});
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [breedsLoading, setBreedsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const Base_API = process.env.REACT_APP_API_BASE


  const species = [
    { name: 'cow', label: 'Cow', icon: <AgricultureIcon sx={{ fontSize: 40 }} /> },
    { name: 'goat', label: 'Goat', icon: <PetsIcon sx={{ fontSize: 40 }} /> },
    { name: 'sheep', label: 'Sheep', icon: <GrassIcon sx={{ fontSize: 40 }} /> },
    { name: 'pig', label: 'Pig', icon: <PetsIcon sx={{ fontSize: 40 }} /> },
    { name: 'bull', label: 'Bull', icon: <AgricultureIcon sx={{ fontSize: 40 }} /> }
  ];

  useEffect(() => {
    const fetchBreeds = async () => {
      setBreedsLoading(true);
      try {
        const response = await axios.get(`${Base_API}/breed`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBreeds(response.data.breeds || []);
      } catch (err) {
        console.error('Failed to fetch breeds:', err);
        setError('Failed to load breeds. Please try again.');
      } finally {
        setBreedsLoading(false);
      }
    };
    if (token) {
      fetchBreeds();
    }
  }, [token]);

  const getInitialFormData = (speciesName) => {
    const baseData = {
      breed_id: '',
      gender: '',
      birth_date: ''
    };

    switch (speciesName) {
      case 'cow':
        return {
          ...baseData,
          cow_name: '',
          cow_code: '',
          mother_id: ''
        };
      case 'goat':
        return {
          ...baseData,
          goat_name: ''
        };
      case 'sheep':
        return {
          ...baseData,
          sheep_name: ''
        };
      case 'pig':
        return {
          ...baseData,
          pig_name: ''
        };
      case 'bull':
        return {
          breed_id: '',
          birth_date: '',
          bull_name: ''
        };
      default:
        return baseData;
    }
  };

  const handleSpeciesSelect = (speciesName) => {
    setSelectedSpecies(speciesName);
    setFormData(getInitialFormData(speciesName));
    setError(null);
    setSuccess(null);
  };

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
      let payload = {
        ...formData,
        species: selectedSpecies
      };

      // Convert cow_code to integer if it exists
      if (payload.cow_code) {
        payload.cow_code = parseInt(payload.cow_code, 10);
      }

      // Set gender to male for bulls
      if (selectedSpecies === 'bull') {
        payload.gender = 'male';
      }

      // Remove empty optional fields
      if (payload.mother_id === '') {
        delete payload.mother_id;
      }

      await axios.post(
        `${Base_API}/animals`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setSuccess(`${selectedSpecies.charAt(0).toUpperCase() + selectedSpecies.slice(1)} registered successfully!`);

      // Reset form without navigation
      setFormData(getInitialFormData(selectedSpecies));

    } catch (err) {
      console.error('Animal registration error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to register animal. Please check your data.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess(null);
    setError(null);
  };

  const renderFormFields = () => {
    if (!selectedSpecies) return null;

    const commonFields = (
      <>
        <TextField
          fullWidth
          variant="filled"
          select
          label="Breed"
          name="breed_id"
          value={formData.breed_id || ''}
          onChange={handleChange}
          sx={{ gridColumn: "span 2" }}
          required
          disabled={breedsLoading}
        >
          {breedsLoading ? (
            <MenuItem disabled>Loading breeds...</MenuItem>
          ) : breeds.length === 0 ? (
            <MenuItem disabled>No breeds available</MenuItem>
          ) : (
            breeds.map((option) => (
              <MenuItem key={option._id} value={option._id}>
                {option.breed_name}
              </MenuItem>
            ))
          )}
        </TextField>
        {selectedSpecies !== 'bull' && (
          <TextField
            fullWidth
            variant="filled"
            select
            label="Gender"
            name="gender"
            value={formData.gender || ''}
            onChange={handleChange}
            sx={{ gridColumn: "span 2" }}
            required
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
          </TextField>
        )}
        <TextField
          fullWidth
          variant="filled"
          type="date"
          label="Birth Date"
          name="birth_date"
          value={formData.birth_date || ''}
          onChange={handleChange}
          sx={{ gridColumn: selectedSpecies === 'bull' ? "span 2" : "span 4" }}
          InputLabelProps={{ shrink: true }}
          required
        />
      </>
    );

    switch (selectedSpecies) {
      case 'cow':
        return (
          <>
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Cow Name"
              name="cow_name"
              value={formData.cow_name || ''}
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
              value={formData.cow_code || ''}
              onChange={handleChange}
              sx={{ gridColumn: "span 2" }}
              required
            />
            {commonFields}
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Mother ID (Optional)"
              name="mother_id"
              value={formData.mother_id || ''}
              onChange={handleChange}
              sx={{ gridColumn: "span 4" }}
            />
          </>
        );
      case 'goat':
        return (
          <>
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Goat Name"
              name="goat_name"
              value={formData.goat_name || ''}
              onChange={handleChange}
              sx={{ gridColumn: "span 4" }}
              required
            />
            {commonFields}
          </>
        );
      case 'sheep':
        return (
          <>
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Sheep Name"
              name="sheep_name"
              value={formData.sheep_name || ''}
              onChange={handleChange}
              sx={{ gridColumn: "span 4" }}
              required
            />
            {commonFields}
          </>
        );
      case 'pig':
        return (
          <>
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Pig Name"
              name="pig_name"
              value={formData.pig_name || ''}
              onChange={handleChange}
              sx={{ gridColumn: "span 4" }}
              required
            />
            {commonFields}
          </>
        );
      case 'bull':
        return (
          <>
            <TextField
              fullWidth
              variant="filled"
              type="text"
              label="Bull Name"
              name="bull_name"
              value={formData.bull_name || ''}
              onChange={handleChange}
              sx={{ gridColumn: "span 4" }}
              required
            />
            {commonFields}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Box m="20px">
      <Header
        title="REGISTER NEW ANIMAL"
        subtitle="Select a species and fill out the form to add a new animal"
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
          mb: 3
        }}
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/fmr.drb/animals")}
      >
        Back
      </Button>

      {/* Species Selection Cards */}
      <Grid container spacing={2} mb={4}>
        {species.map((spec) => (
          <Grid item xs={12} sm={6} md={2.4} key={spec.name}>
            <Card
              sx={{
                background: selectedSpecies === spec.name
                  ? colors.greenAccent[600]
                  : colors.primary[400],
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 4px 20px ${colors.greenAccent[700]}40`
                },
                border: selectedSpecies === spec.name
                  ? `2px solid ${colors.greenAccent[400]}`
                  : `1px solid ${colors.primary[300]}`
              }}
              onClick={() => handleSpeciesSelect(spec.name)}
            >
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  py: 3
                }}
              >
                {spec.icon}
                <Typography
                  variant="h5"
                  fontWeight="600"
                  color={colors.grey[100]}
                  mt={1}
                >
                  {spec.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Registration Form */}
      {selectedSpecies ? (
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            background: colors.primary[400],
            borderRadius: "16px",
            p: 4,
          }}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            color={colors.grey[100]}
            mb={2}
          >
            {selectedSpecies.charAt(0).toUpperCase() + selectedSpecies.slice(1)} Details
          </Typography>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          >
            {breedsLoading ? (
              <>
                <Skeleton variant="rectangular" height={56} sx={{ gridColumn: "span 2", borderRadius: 1 }} />
                <Skeleton variant="rectangular" height={56} sx={{ gridColumn: "span 2", borderRadius: 1 }} />
                <Skeleton variant="rectangular" height={56} sx={{ gridColumn: "span 2", borderRadius: 1 }} />
                <Skeleton variant="rectangular" height={56} sx={{ gridColumn: "span 2", borderRadius: 1 }} />
              </>
            ) : (
              renderFormFields()
            )}
          </Box>
          <Box display="flex" justifyContent="flex-end" mt="20px">
            <Button
              type="submit"
              variant="contained"
              disabled={loading || breedsLoading}
              startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
              sx={{
                backgroundColor: colors.greenAccent[600],
                color: colors.grey[100],
                "&:hover": { backgroundColor: colors.greenAccent[700] },
              }}
            >
              {loading ? "Registering..." : `Register ${selectedSpecies.charAt(0).toUpperCase() + selectedSpecies.slice(1)}`}
            </Button>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            background: colors.primary[400],
            borderRadius: "16px",
            p: 4,
            textAlign: 'center'
          }}
        >
          <Typography
            variant="h5"
            color={colors.grey[300]}
          >
            Select a species above to begin registration
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default AnimalRegistration;