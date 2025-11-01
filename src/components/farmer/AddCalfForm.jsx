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
  ToggleButtonGroup,
  ToggleButton,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Paper,
} from '@mui/material';
import { useTheme } from '@mui/material';
import { tokens } from '../../theme';
import axios from 'axios';
import { AuthContext } from '../../components/PrivateComponents/AuthContext';
import Header from '../scenes/Header';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  PawPrint, 
  FileText, 
  Baby,
  Fingerprint,
  Calendar,
  Users,
  Beef,
  Leaf,
} from 'lucide-react';

const AddCalfForm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  // Registration type toggle
  const [registrationType, setRegistrationType] = useState('manual');

  // Manual registration form
  const [formData, setFormData] = useState({
    animal_name: '',
    breed_id: '',
    breed_name: '',
    species: 'cow',
    gender: '',
    birth_date: '',
    animal_code: '',
    mother_id: '',
    bull_code: '',
    bull_name: '',
  });

  // Insemination-based registration
  const [inseminationData, setInseminationData] = useState({
    insemination_id: '',
    cow_name: '',
    gender: '',
    birth_date: '',
    cow_code: '',
  });

  const [breeds, setBreeds] = useState([]);
  const [mothers, setMothers] = useState([]);
  const [inseminations, setInseminations] = useState([]);
  const [selectedSpecies, setSelectedSpecies] = useState('cow');
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const speciesOptions = [
    { value: 'cow', label: 'Cattle', icon: '🐄', color: '#FF6B6B' },
    { value: 'goat', label: 'Goat', icon: '🐐', color: '#4ECDC4' },
    { value: 'sheep', label: 'Sheep', icon: '🐑', color: '#95E1D3' },
    { value: 'pig', label: 'Pig', icon: '🐷', color: '#FFB6B9' },
  ];

  const stageLabels = {
    cow: { newborn: 'Calf', female: 'Heifer', male: 'Bull', mature: ['cow'] },
    goat: { newborn: 'Kid', female: 'Doe', male: 'Buck', mature: ['doe'] },
    sheep: { newborn: 'Lamb', female: 'Ewe', male: 'Ram', mature: ['ewe'] },
    pig: { newborn: 'Piglet', female: 'Sow', male: 'Boar', mature: ['sow'] },
  };

  useEffect(() => {
    fetchData();
  }, [token, selectedSpecies, registrationType]);

  const fetchData = async () => {
    if (!token) {
      setError('Authentication token not found.');
      return;
    }

    setDataLoading(true);
    try {
      // Fetch breeds
      const breedsRes = await axios.get('https://maziwasmart.onrender.com/api/breed', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allBreeds = breedsRes.data.breeds || [];
      setBreeds(allBreeds.filter(b => !b.species || b.species === selectedSpecies));

      // Fetch animals for the selected species
      const animalsRes = await axios.get('https://maziwasmart.onrender.com/api/animals', {
        params: { species: selectedSpecies, gender: 'female' },
        headers: { Authorization: `Bearer ${token}` },
      });

      // Filter for mature females based on species
      const matureStages = stageLabels[selectedSpecies]?.mature || [];
      const potentialMothers = (animalsRes.data.animals || []).filter(animal => 
        matureStages.includes(animal.stage)
      );
      setMothers(potentialMothers);

      // Fetch insemination records if in insemination mode
      if (registrationType === 'insemination') {
        try {
          const inseminationsRes = await axios.get('https://maziwasmart.onrender.com/api/insemination', {
            params: { species: selectedSpecies },
            headers: { Authorization: `Bearer ${token}` },
          });
          
          // Filter for pregnant/confirmed pregnancies
          const pregnantInseminations = (inseminationsRes.data.inseminations || []).filter(
            ins => ins.pregnancy_confirmed === true || ins.status === 'pregnant'
          );
          setInseminations(pregnantInseminations);
        } catch (insErr) {
          console.error('Failed to fetch inseminations:', insErr);
          setInseminations([]);
        }
      }

    } catch (err) {
      console.error('Failed to fetch data:', err.response?.data || err.message);
      setError('Failed to load form data. Please try again.');
    } finally {
      setDataLoading(false);
    }
  };

  const handleRegistrationTypeChange = (event, newType) => {
    if (newType !== null) {
      setRegistrationType(newType);
    }
  };

  const handleSpeciesChange = (newSpecies) => {
    setSelectedSpecies(newSpecies);
    setFormData({ ...formData, species: newSpecies, mother_id: '', breed_id: '' });
  };

  const handleManualChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleInseminationChange = (e) => {
    const { name, value } = e.target;
    setInseminationData({ ...inseminationData, [name]: value });
  };

  const handleManualSubmit = async (e) => {
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
        animal_name: formData.animal_name,
        species: formData.species,
        gender: formData.gender,
        birth_date: formData.birth_date,
        animal_code: formData.animal_code || undefined,
        breed_id: formData.breed_id || undefined,
        breed_name: formData.breed_name || undefined,
        mother_id: formData.mother_id || undefined,
        bull_code: formData.bull_code || undefined,
        bull_name: formData.bull_name || undefined,
      };

      const response = await axios.post('https://maziwasmart.onrender.com/api/calf', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const speciesEmoji = speciesOptions.find(s => s.value === formData.species)?.icon || '🐾';
      setSuccess(`${speciesEmoji} ${response.data.message || 'Animal registered successfully!'}`);
      
      // Reset form
      setFormData({
        animal_name: '',
        breed_id: '',
        breed_name: '',
        species: selectedSpecies,
        gender: '',
        birth_date: '',
        animal_code: '',
        mother_id: '',
        bull_code: '',
        bull_name: '',
      });
    } catch (err) {
      console.error('Registration error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to register animal. Please check the data and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInseminationSubmit = async (e) => {
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
        insemination_id: inseminationData.insemination_id,
        cow_name: inseminationData.cow_name,
        gender: inseminationData.gender,
        birth_date: inseminationData.birth_date,
        cow_code: inseminationData.cow_code || undefined,
      };

      const response = await axios.post('https://maziwasmart.onrender.com/api/calf/from-pregnancy', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const speciesEmoji = speciesOptions.find(s => s.value === selectedSpecies)?.icon || '🐾';
      setSuccess(`${speciesEmoji} ${response.data.message || 'Offspring registered successfully from insemination!'}`);
      
      // Reset form
      setInseminationData({
        insemination_id: '',
        cow_name: '',
        gender: '',
        birth_date: '',
        cow_code: '',
      });
      
      // Refresh data
      fetchData();
    } catch (err) {
      console.error('Registration error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to register offspring. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess(null);
    setError(null);
  };

  const currentSpeciesColor = speciesOptions.find(s => s.value === selectedSpecies)?.color || '#4CAF50';

  return (
    <Box 
      m="20px" 
      sx={{ 
        minHeight: '100vh',
        pb: 4,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Header
        title="REGISTER NEW OFFSPRING"
        subtitle="Add new animals to your farm - manual entry or from insemination records"
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
          background: 'white',
          color: '#667eea',
          fontWeight: 700,
          px: 3,
          py: 1.5,
          borderRadius: 3,
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          "&:hover": { 
            background: '#f8f9fa',
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
          },
          transition: 'all 0.3s ease',
          mb: 3
        }}
        startIcon={<ArrowLeft size={20} />}
        onClick={() => navigate("/farmerdashboard/cows")}
      >
        Back to Animals
      </Button>

      {/* Registration Type Selection */}
      <Paper 
        elevation={6} 
        sx={{ 
          mb: 3, 
          borderRadius: 4, 
          overflow: 'hidden',
          background: 'white'
        }}
      >
        <Box sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', p: 2 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <FileText size={24} color="white" />
            <Typography variant="h5" fontWeight="700" color="white">
              Choose Registration Method
            </Typography>
          </Box>
        </Box>
        <CardContent sx={{ p: 3 }}>
          <ToggleButtonGroup
            value={registrationType}
            exclusive
            onChange={handleRegistrationTypeChange}
            fullWidth
            sx={{ 
              '& .MuiToggleButton-root': {
                py: 2.5,
                fontSize: '1rem',
                fontWeight: 600,
                border: '2px solid #e0e0e0',
                '&.Mui-selected': {
                  borderColor: currentSpeciesColor,
                }
              }
            }}
          >
            <ToggleButton 
              value="manual"
              sx={{
                '&.Mui-selected': {
                  background: `linear-gradient(135deg, ${currentSpeciesColor} 0%, ${currentSpeciesColor}dd 100%)`,
                  color: 'white',
                  '&:hover': {
                    background: `linear-gradient(135deg, ${currentSpeciesColor}dd 0%, ${currentSpeciesColor}bb 100%)`,
                  }
                }
              }}
            >
              <PawPrint size={22} style={{ marginRight: 10 }} />
              Manual Entry - All Details
            </ToggleButton>
            <ToggleButton 
              value="insemination"
              sx={{
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #FF5252 0%, #FF7043 100%)',
                  }
                }
              }}
            >
              <Baby size={22} style={{ marginRight: 10 }} />
              From Insemination Record
            </ToggleButton>
          </ToggleButtonGroup>
        </CardContent>
      </Paper>

      {/* Species Selection */}
      <Paper 
        elevation={6} 
        sx={{ 
          mb: 3, 
          borderRadius: 4, 
          overflow: 'hidden',
          background: 'white'
        }}
      >
        <Box sx={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', p: 2 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Leaf size={24} color="white" />
            <Typography variant="h5" fontWeight="700" color="white">
              Select Animal Species
            </Typography>
          </Box>
        </Box>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2}>
            {speciesOptions.map((species) => (
              <Grid item xs={6} sm={3} key={species.value}>
                <Button
                  fullWidth
                  variant={selectedSpecies === species.value ? "contained" : "outlined"}
                  onClick={() => handleSpeciesChange(species.value)}
                  sx={{
                    py: 3,
                    flexDirection: 'column',
                    gap: 1.5,
                    background: selectedSpecies === species.value 
                      ? `linear-gradient(135deg, ${species.color} 0%, ${species.color}dd 100%)`
                      : 'white',
                    color: selectedSpecies === species.value ? 'white' : species.color,
                    borderColor: species.color,
                    borderWidth: 2,
                    fontWeight: 700,
                    borderRadius: 3,
                    boxShadow: selectedSpecies === species.value ? '0 4px 15px rgba(0,0,0,0.2)' : 'none',
                    '&:hover': {
                      background: selectedSpecies === species.value
                        ? `linear-gradient(135deg, ${species.color}dd 0%, ${species.color}bb 100%)`
                        : `${species.color}11`,
                      transform: 'translateY(-4px)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <span style={{ fontSize: '48px' }}>{species.icon}</span>
                  <Typography variant="h6" fontWeight="700">
                    {species.label}
                  </Typography>
                </Button>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Paper>

      {/* Manual Registration Form */}
      {registrationType === 'manual' && (
        <Paper 
          elevation={6} 
          sx={{ 
            borderRadius: 4, 
            overflow: 'hidden',
            background: 'white'
          }}
        >
          <Box sx={{ background: `linear-gradient(135deg, ${currentSpeciesColor} 0%, ${currentSpeciesColor}dd 100%)`, p: 2 }}>
            <Box display="flex" alignItems="center" gap={2}>
              <PawPrint size={24} color="white" />
              <Typography variant="h5" fontWeight="700" color="white">
                {stageLabels[selectedSpecies]?.newborn || 'Animal'} Registration Details
              </Typography>
            </Box>
          </Box>
          <CardContent sx={{ p: 4 }}>
            <Box component="form" onSubmit={handleManualSubmit}>
              <Grid container spacing={3}>
                {/* Animal Name */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    label={`${stageLabels[selectedSpecies]?.newborn || 'Animal'} Name *`}
                    name="animal_name"
                    value={formData.animal_name}
                    onChange={handleManualChange}
                    required
                    InputProps={{
                      sx: { 
                        borderRadius: 2, 
                        bgcolor: '#f8f9fa',
                        '& fieldset': { borderWidth: 2 }
                      }
                    }}
                  />
                </Grid>

                {/* Animal Code */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    label="Animal ID/Tag Code (Optional)"
                    name="animal_code"
                    value={formData.animal_code}
                    onChange={handleManualChange}
                    InputProps={{
                      startAdornment: <Fingerprint size={20} style={{ marginRight: 8, color: '#757575' }} />,
                      sx: { 
                        borderRadius: 2, 
                        bgcolor: '#f8f9fa',
                        '& fieldset': { borderWidth: 2 }
                      }
                    }}
                  />
                </Grid>

                {/* Gender */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    select
                    label="Gender *"
                    name="gender"
                    value={formData.gender}
                    onChange={handleManualChange}
                    required
                    InputProps={{
                      sx: { 
                        borderRadius: 2, 
                        bgcolor: '#f8f9fa',
                        '& fieldset': { borderWidth: 2 }
                      }
                    }}
                  >
                    <MenuItem value="male">
                      🔵 Male ({stageLabels[selectedSpecies]?.male})
                    </MenuItem>
                    <MenuItem value="female">
                      🔴 Female ({stageLabels[selectedSpecies]?.female})
                    </MenuItem>
                  </TextField>
                </Grid>

                {/* Birth Date */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="date"
                    label="Birth Date *"
                    name="birth_date"
                    value={formData.birth_date}
                    onChange={handleManualChange}
                    required
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: <Calendar size={20} style={{ marginRight: 8, color: '#757575' }} />,
                      sx: { 
                        borderRadius: 2, 
                        bgcolor: '#f8f9fa',
                        '& fieldset': { borderWidth: 2 }
                      }
                    }}
                  />
                </Grid>

                {/* Breed Selection */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    select
                    label="Select Existing Breed (Optional)"
                    name="breed_id"
                    value={formData.breed_id}
                    onChange={handleManualChange}
                    InputProps={{
                      startAdornment: <Beef size={20} style={{ marginRight: 8, color: '#757575' }} />,
                      sx: { 
                        borderRadius: 2, 
                        bgcolor: '#f8f9fa',
                        '& fieldset': { borderWidth: 2 }
                      }
                    }}
                  >
                    <MenuItem value="">
                      <em>Select a breed</em>
                    </MenuItem>
                    {breeds.map((breed) => (
                      <MenuItem key={breed._id} value={breed._id}>
                        {breed.breed_name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* New Breed Name */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    label="Or Enter New Breed Name"
                    name="breed_name"
                    value={formData.breed_name}
                    onChange={handleManualChange}
                    disabled={!!formData.breed_id}
                    helperText={formData.breed_id ? "Clear breed selection to enter new breed" : ""}
                    InputProps={{
                      sx: { 
                        borderRadius: 2, 
                        bgcolor: '#f8f9fa',
                        '& fieldset': { borderWidth: 2 }
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }}>
                    <Chip label="Optional Parent Information" sx={{ fontWeight: 600, bgcolor: '#e3f2fd' }} />
                  </Divider>
                </Grid>

                {/* Mother Selection */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    select
                    label="Mother (Optional)"
                    name="mother_id"
                    value={formData.mother_id}
                    onChange={handleManualChange}
                    InputProps={{
                      startAdornment: <Users size={20} style={{ marginRight: 8, color: '#757575' }} />,
                      sx: { 
                        borderRadius: 2, 
                        bgcolor: '#f8f9fa',
                        '& fieldset': { borderWidth: 2 }
                      }
                    }}
                  >
                    <MenuItem value="">
                      <em>No mother selected</em>
                    </MenuItem>
                    {mothers.map((mother) => (
                      <MenuItem key={mother.id} value={mother.id}>
                        {mother.name} - {mother.stage} {mother.breed && `(${mother.breed})`}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Bull Information */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    label="Bull/Sire Code (Optional)"
                    name="bull_code"
                    value={formData.bull_code}
                    onChange={handleManualChange}
                    InputProps={{
                      sx: { 
                        borderRadius: 2, 
                        bgcolor: '#f8f9fa',
                        '& fieldset': { borderWidth: 2 }
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    label="Bull/Sire Name (Optional)"
                    name="bull_name"
                    value={formData.bull_name}
                    onChange={handleManualChange}
                    InputProps={{
                      sx: { 
                        borderRadius: 2, 
                        bgcolor: '#f8f9fa',
                        '& fieldset': { borderWidth: 2 }
                      }
                    }}
                  />
                </Grid>
              </Grid>

              <Box display="flex" justifyContent="flex-end" mt={4} gap={2}>
                <Button
                  variant="outlined"
                  onClick={() => setFormData({
                    animal_name: '',
                    breed_id: '',
                    breed_name: '',
                    species: selectedSpecies,
                    gender: '',
                    birth_date: '',
                    animal_code: '',
                    mother_id: '',
                    bull_code: '',
                    bull_name: '',
                  })}
                  sx={{
                    borderWidth: 2,
                    borderColor: '#e0e0e0',
                    color: '#757575',
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                  }}
                >
                  Clear Form
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PawPrint size={20} />}
                  sx={{
                    background: loading 
                      ? '#ccc' 
                      : `linear-gradient(135deg, ${currentSpeciesColor} 0%, ${currentSpeciesColor}dd 100%)`,
                    color: 'white',
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                    "&:hover": loading ? {} : { 
                      background: `linear-gradient(135deg, ${currentSpeciesColor}dd 0%, ${currentSpeciesColor}bb 100%)`,
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {loading ? "Registering..." : `Register ${stageLabels[selectedSpecies]?.newborn || 'Animal'}`}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Paper>
      )}

      {/* Insemination-Based Registration Form */}
      {registrationType === 'insemination' && (
        <Paper 
          elevation={6} 
          sx={{ 
            borderRadius: 4, 
            overflow: 'hidden',
            background: 'white'
          }}
        >
          <Box sx={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)', p: 2 }}>
            <Box display="flex" alignItems="center" gap={2}>
              <Baby size={24} color="white" />
              <Typography variant="h5" fontWeight="700" color="white">
                Register from Insemination Record
              </Typography>
            </Box>
          </Box>
          <CardContent sx={{ p: 4 }}>
            {dataLoading ? (
              <Box display="flex" justifyContent="center" alignItems="center" py={8}>
                <CircularProgress size={60} />
              </Box>
            ) : inseminations.length === 0 ? (
              <Alert 
                severity="info" 
                sx={{ 
                  borderRadius: 2, 
                  fontSize: '1rem',
                  '& .MuiAlert-icon': { fontSize: 28 }
                }}
              >
                <Typography variant="body1" fontWeight={600}>
                  No pregnant {selectedSpecies} found with insemination records.
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Make sure you have insemination records marked as pregnant for {selectedSpecies}.
                </Typography>
              </Alert>
            ) : (
              <>
                <Alert 
                  severity="success" 
                  sx={{ 
                    borderRadius: 2, 
                    mb: 3,
                    fontSize: '1rem',
                    '& .MuiAlert-icon': { fontSize: 28 }
                  }}
                >
                  <Typography variant="body1" fontWeight={600}>
                    ✅ Found {inseminations.length} pregnant {selectedSpecies} ready for offspring registration
                  </Typography>
                </Alert>

                <Box component="form" onSubmit={handleInseminationSubmit}>
                  <Grid container spacing={3}>
                    {/* Insemination Record Selection */}
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        select
                        label="Select Insemination Record *"
                        name="insemination_id"
                        value={inseminationData.insemination_id}
                        onChange={handleInseminationChange}
                        required
                        InputProps={{
                          startAdornment: <FileText size={20} style={{ marginRight: 8, color: '#757575' }} />,
                          sx: { 
                            borderRadius: 2, 
                            bgcolor: '#fff3e0',
                            '& fieldset': { borderWidth: 2, borderColor: '#FF6B6B' }
                          }
                        }}
                      >
                        <MenuItem value="">
                          <em>Select an insemination record</em>
                        </MenuItem>
                        {inseminations.map((ins) => (
                          <MenuItem key={ins._id} value={ins._id}>
                            <Box>
                              <Typography variant="body1" fontWeight={600}>
                                Mother: {ins.cow_name || 'Unknown'}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Bull: {ins.bull_name || ins.bull_code || 'Not specified'} 
                                {ins.bull_breed && ` | Breed: ${ins.bull_breed}`}
                                {ins.expected_due_date && ` | Due: ${new Date(ins.expected_due_date).toLocaleDateString()}`}
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    {/* Offspring Name */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        type="text"
                        label={`${stageLabels[selectedSpecies]?.newborn || 'Offspring'} Name *`}
                        name="cow_name"
                        value={inseminationData.cow_name}
                        onChange={handleInseminationChange}
                        required
                        InputProps={{
                          sx: { 
                            borderRadius: 2, 
                            bgcolor: '#f8f9fa',
                            '& fieldset': { borderWidth: 2 }
                          }
                        }}
                      />
                    </Grid>

                    {/* Offspring Code */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        type="text"
                        label="Animal ID/Tag Code (Optional)"
                        name="cow_code"
                        value={inseminationData.cow_code}
                        onChange={handleInseminationChange}
                        InputProps={{
                          startAdornment: <Fingerprint size={20} style={{ marginRight: 8, color: '#757575' }} />,
                          sx: { 
                            borderRadius: 2, 
                            bgcolor: '#f8f9fa',
                            '& fieldset': { borderWidth: 2 }
                          }
                        }}
                      />
                    </Grid>

                    {/* Gender */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        select
                        label="Gender *"
                        name="gender"
                        value={inseminationData.gender}
                        onChange={handleInseminationChange}
                        required
                        InputProps={{
                          sx: { 
                            borderRadius: 2, 
                            bgcolor: '#f8f9fa',
                            '& fieldset': { borderWidth: 2 }
                          }
                        }}
                      >
                        <MenuItem value="male">
                          🔵 Male ({stageLabels[selectedSpecies]?.male})
                        </MenuItem>
                        <MenuItem value="female">
                          🔴 Female ({stageLabels[selectedSpecies]?.female})
                        </MenuItem>
                      </TextField>
                    </Grid>

                    {/* Birth Date */}
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        type="date"
                        label="Birth Date *"
                        name="birth_date"
                        value={inseminationData.birth_date}
                        onChange={handleInseminationChange}
                        required
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          startAdornment: <Calendar size={20} style={{ marginRight: 8, color: '#757575' }} />,
                          sx: { 
                            borderRadius: 2, 
                            bgcolor: '#f8f9fa',
                            '& fieldset': { borderWidth: 2 }
                          }
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Box display="flex" justifyContent="flex-end" mt={4} gap={2}>
                    <Button
                      variant="outlined"
                      onClick={() => setInseminationData({
                        insemination_id: '',
                        cow_name: '',
                        gender: '',
                        birth_date: '',
                        cow_code: '',
                      })}
                      sx={{
                        borderWidth: 2,
                        borderColor: '#e0e0e0',
                        color: '#757575',
                        fontWeight: 600,
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                      }}
                    >
                      Clear Form
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Baby size={20} />}
                      sx={{
                        background: loading 
                          ? '#ccc' 
                          : 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
                        color: 'white',
                        fontWeight: 700,
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                        "&:hover": loading ? {} : { 
                          background: 'linear-gradient(135deg, #FF5252 0%, #FF7043 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {loading ? "Registering..." : `Register ${stageLabels[selectedSpecies]?.newborn || 'Offspring'}`}
                    </Button>
                  </Box>
                </Box>
              </>
            )}
          </CardContent>
        </Paper>
      )}
    </Box>
  );
};

export default AddCalfForm;