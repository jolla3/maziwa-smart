import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Container,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Grid,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Chip,
  Card,
  CardContent,
  Divider,
  InputAdornment,
  CircularProgress,
  ThemeProvider,
  createTheme
} from '@mui/material';
import {
  Baby,
  Plus,
  Search,
  Calendar,
  User,
  Hash,
  Heart,
  Save,
  ArrowLeft
} from 'lucide-react';
import { GiCow, GiBull, GiGoat, GiSheep, GiPig } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../PrivateComponents/AuthContext';

// Clean Aqua Theme - White backgrounds, Black text only
const aquaTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#00bcd4',
      light: '#62efff',
      dark: '#008ba3',
    },
    secondary: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    error: {
      main: '#ef4444',
    },
    info: {
      main: '#3b82f6',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#000000',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    allVariants: {
      color: '#000000',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#000000',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#000000',
        },
      },
    },
  },
});

const AddCalf = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [manualForm, setManualForm] = useState({
    species: 'cow',
    animal_name: '',
    gender: '',
    birth_date: '',
    animal_code: '',
    breed_name: '',
    mother_id: '',
    bull_code: '',
    bull_name: ''
  });

  const [pregnancyForm, setPregnancyForm] = useState({
    insemination_id: '',
    cow_name: '',
    gender: '',
    birth_date: '',
    cow_code: ''
  });

  const [mothers, setMothers] = useState([]);
  const [pregnancies, setPregnancies] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [filteredMothers, setFilteredMothers] = useState([]);
  const [selectedSpecies, setSelectedSpecies] = useState('cow');

  const speciesConfig = {
    cow: {
      icon: GiCow,
      label: 'Cattle',
      stages: ['heifer', 'cow'],
      newbornTerm: 'Calf'
    },
    bull: {
      icon: GiBull,
      label: 'Bull',
      stages: ['bull'],
      newbornTerm: 'Calf'
    },
    goat: {
      icon: GiGoat,
      label: 'Goat',
      stages: ['doe'],
      newbornTerm: 'Kid'
    },
    sheep: {
      icon: GiSheep,
      label: 'Sheep',
      stages: ['ewe'],
      newbornTerm: 'Lamb'
    },
    pig: {
      icon: GiPig,
      label: 'Pig',
      stages: ['sow'],
      newbornTerm: 'Piglet'
    }
  };

  useEffect(() => {
    fetchAnimals();
    fetchPregnancies();
    fetchBreeds();
  }, []);

  useEffect(() => {
    filterMothersBySpecies();
  }, [selectedSpecies, mothers]);

  const fetchAnimals = async () => {
    try {
      const response = await axios.get('https://maziwasmart.onrender.com/api/animals', {
        params: { gender: 'female', limit: 1000, page: 1 },
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        const matureFemales = response.data.animals.filter(animal => {
          const config = speciesConfig[animal.species];
          return config && config.stages.includes(animal.stage);
        });
        setMothers(matureFemales);
      }
    } catch (err) {
      console.error('Error fetching animals:', err);
    }
  };

  const fetchPregnancies = async () => {
    try {
      const response = await axios.get('https://maziwasmart.onrender.com/api/insemination', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        const pendingPregnancies = response.data.records.filter(r => !r.has_calved && r.outcome !== 'failed');
        setPregnancies(pendingPregnancies);
      }
    } catch (err) {
      console.error('Error fetching pregnancies:', err);
    }
  };

  const fetchBreeds = async () => {
    try {
      const response = await axios.get('https://maziwasmart.onrender.com/api/breed', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.breeds) {
        setBreeds(response.data.breeds);
      }
    } catch (err) {
      console.error('Error fetching breeds:', err);
    }
  };

  const filterMothersBySpecies = () => {
    const filtered = mothers.filter(m => m.species === selectedSpecies);
    setFilteredMothers(filtered);
  };

  const handleManualChange = (field, value) => {
    setManualForm(prev => ({ ...prev, [field]: value }));
    if (field === 'species') {
      setSelectedSpecies(value);
      setManualForm(prev => ({ ...prev, mother_id: '' }));
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        ...manualForm,
        bull_code: manualForm.bull_code?.trim() || undefined,
        bull_name: manualForm.bull_name?.trim() || undefined,
        animal_code: manualForm.animal_code?.trim() || undefined,
      };

      const response = await axios.post(
        'https://maziwasmart.onrender.com/api/calf',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setSuccess(`${speciesConfig[manualForm.species].newbornTerm} registered successfully!`);
        setTimeout(() => navigate('/farmerdashboard/cows'), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register animal');
    } finally {
      setLoading(false);
    }
  };

  const handlePregnancyChange = (field, value) => {
    setPregnancyForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePregnancySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(
        'https://maziwasmart.onrender.com/api/calf/fromPregnancy',
        pregnancyForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setSuccess('Calf registered from pregnancy successfully!');
        setTimeout(() => navigate('/farmerdashboard/cows'), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register calf');
    } finally {
      setLoading(false);
    }
  };

  const getSpeciesIcon = (species) => {
    const Icon = speciesConfig[species]?.icon || GiCow;
    return <Icon size={20} />;
  };

  return (
    <ThemeProvider theme={aquaTheme}>
      <Box sx={{ bgcolor: '#e0f7fa', minHeight: '100vh', py: 4 }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 4 }}>
            <Button
              startIcon={<ArrowLeft size={20} />}
              onClick={() => navigate('/farmerdashboard/cows')}
              sx={{ mb: 2, color: '#000000' }}
            >
              Back to Animals
            </Button>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#000000', mb: 1 }}>
              Register New Offspring
            </Typography>
            <Typography variant="body1" sx={{ color: '#000000' }}>
              Add a new animal to your farm - manually or from pregnancy records
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
              {success}
            </Alert>
          )}

          <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden', bgcolor: '#ffffff' }}>
            <Box sx={{ bgcolor: '#00bcd4', borderBottom: '2px solid #008ba3' }}>
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                sx={{
                  '& .MuiTab-root': {
                    fontSize: '1rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    minHeight: 64,
                    px: 4,
                    color: '#ffffff',
                    '&.Mui-selected': { color: '#ffffff' }
                  },
                  '& .MuiTabs-indicator': { backgroundColor: '#ffffff' }
                }}
              >
                <Tab icon={<Plus size={20} />} iconPosition="start" label="Manual Entry" />
                <Tab icon={<Heart size={20} />} iconPosition="start" label="From Pregnancy" />
              </Tabs>
            </Box>

            <Box sx={{ p: 4 }}>
              {activeTab === 0 && (
                <form onSubmit={handleManualSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#000000' }}>
                        Animal Type
                      </Typography>
                      <Grid container spacing={2}>
                        {Object.entries(speciesConfig).map(([key, config]) => {
                          const Icon = config.icon;
                          return (
                            <Grid item xs={6} sm={4} md={2.4} key={key}>
                              <Card
                                sx={{
                                  cursor: 'pointer',
                                  border: manualForm.species === key ? '2px solid #10b981' : '2px solid #e2e8f0',
                                  bgcolor: manualForm.species === key ? '#f0fdfa' : 'white',
                                  transition: 'all 0.3s',
                                  '&:hover': { borderColor: '#10b981', transform: 'translateY(-4px)', boxShadow: 3 }
                                }}
                                onClick={() => handleManualChange('species', key)}
                              >
                                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                                  <Box
                                    sx={{
                                      width: 50,
                                      height: 50,
                                      borderRadius: '50%',
                                      bgcolor: manualForm.species === key ? '#10b981' : '#f1f5f9',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      mx: 'auto',
                                      mb: 1.5,
                                      color: manualForm.species === key ? 'white' : '#64748b'
                                    }}
                                  >
                                    <Icon size={24} />
                                  </Box>
                                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#000000' }}>
                                    {config.label}
                                  </Typography>
                                </CardContent>
                              </Card>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </Grid>

                    <Grid item xs={12}><Divider /></Grid>

                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#000000' }}>
                        Basic Information
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        required
                        label="Animal Name"
                        value={manualForm.animal_name}
                        onChange={(e) => handleManualChange('animal_name', e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <User size={20} color="#64748b" />
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Animal Code (Optional)"
                        value={manualForm.animal_code}
                        onChange={(e) => handleManualChange('animal_code', e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Hash size={20} color="#64748b" />
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth required>
                        <InputLabel>Gender</InputLabel>
                        <Select
                          value={manualForm.gender}
                          onChange={(e) => handleManualChange('gender', e.target.value)}
                          label="Gender"
                        >
                          <MenuItem value="male">Male</MenuItem>
                          <MenuItem value="female">Female</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        required
                        type="date"
                        label="Birth Date"
                        value={manualForm.birth_date}
                        onChange={(e) => handleManualChange('birth_date', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Calendar size={20} color="#64748b" />
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}><Divider /></Grid>

                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#000000' }}>
                        Parentage Information
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth>
                        <InputLabel>Mother (Optional)</InputLabel>
                        <Select
                          value={manualForm.mother_id}
                          onChange={(e) => handleManualChange('mother_id', e.target.value)}
                          label="Mother (Optional)"
                        >
                          <MenuItem value=""><em>None</em></MenuItem>
                          {filteredMothers.map((mother) => (
                            <MenuItem key={mother.id} value={mother.id}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {getSpeciesIcon(mother.species)}
                                <span>{mother.name}</span>
                                <Chip label={mother.stage} size="small" sx={{ ml: 1 }} />
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Breed Name"
                        value={manualForm.breed_name}
                        onChange={(e) => handleManualChange('breed_name', e.target.value)}
                        placeholder="e.g., Friesian, Ayrshire"
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Bull Code (Optional)"
                        value={manualForm.bull_code}
                        onChange={(e) => handleManualChange('bull_code', e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Hash size={20} color="#64748b" />
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Bull Name (Optional)"
                        value={manualForm.bull_name}
                        onChange={(e) => handleManualChange('bull_name', e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <GiBull size={20} color="#64748b" />
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                        <Button
                          variant="outlined"
                          size="large"
                          onClick={() => navigate('/farmerdashboard/cows')}
                          sx={{ px: 4, color: '#000000', borderColor: '#000000' }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          size="large"
                          disabled={loading}
                          startIcon={loading ? <CircularProgress size={20} /> : <Save size={20} />}
                          sx={{
                            px: 4,
                            bgcolor: '#10b981',
                            color: '#ffffff',
                            '&:hover': { bgcolor: '#059669' }
                          }}
                        >
                          {loading ? 'Registering...' : `Register ${speciesConfig[manualForm.species].newbornTerm}`}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </form>
              )}

              {activeTab === 1 && (
                <form onSubmit={handlePregnancySubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Alert severity="info" icon={<Heart size={20} />} sx={{ color: '#000000', bgcolor: '#e3f2fd' }}>
                        Register offspring from confirmed pregnancy records
                      </Alert>
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl fullWidth required>
                        <InputLabel>Select Pregnancy Record</InputLabel>
                        <Select
                          value={pregnancyForm.insemination_id}
                          onChange={(e) => handlePregnancyChange('insemination_id', e.target.value)}
                          label="Select Pregnancy Record"
                        >
                          {pregnancies.length === 0 ? (
                            <MenuItem disabled>No pending pregnancies found</MenuItem>
                          ) : (
                            pregnancies.map((preg) => (
                              <MenuItem key={preg.id} value={preg.id}>
                                <Box>
                                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    {preg.animal?.name || 'Unknown'} - {preg.bull?.name || 'Unknown Bull'}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: '#000000' }}>
                                    Inseminated: {new Date(preg.insemination_date).toLocaleDateString()} |
                                    Due: {new Date(preg.expected_due_date).toLocaleDateString()}
                                  </Typography>
                                </Box>
                              </MenuItem>
                            ))
                          )}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        required
                        label="Calf Name"
                        value={pregnancyForm.cow_name}
                        onChange={(e) => handlePregnancyChange('cow_name', e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Baby size={20} color="#64748b" />
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Calf Code (Optional)"
                        value={pregnancyForm.cow_code}
                        onChange={(e) => handlePregnancyChange('cow_code', e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Hash size={20} color="#64748b" />
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth required>
                        <InputLabel>Gender</InputLabel>
                        <Select
                          value={pregnancyForm.gender}
                          onChange={(e) => handlePregnancyChange('gender', e.target.value)}
                          label="Gender"
                        >
                          <MenuItem value="male">Male</MenuItem>
                          <MenuItem value="female">Female</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        required
                        type="date"
                        label="Birth Date"
                        value={pregnancyForm.birth_date}
                        onChange={(e) => handlePregnancyChange('birth_date', e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Calendar size={20} color="#64748b" />
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                        <Button
                          variant="outlined"
                          size="large"
                          onClick={() => navigate('/farmerdashboard/cows')}
                          sx={{ px: 4, color: '#000000', borderColor: '#000000' }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          size="large"
                          disabled={loading}
                          startIcon={loading ? <CircularProgress size={20} /> : <Save size={20} />}
                          sx={{
                            px: 4,
                            bgcolor: '#10b981',
                            color: '#ffffff',
                            '&:hover': { bgcolor: '#059669' }
                          }}
                        >
                          {loading ? 'Registering...' : 'Register Calf'}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </form>
              )}
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default AddCalf;