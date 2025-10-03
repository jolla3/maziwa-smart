import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Fade,
  Alert,
  Snackbar,
  Collapse,
  Chip,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Badge,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton,
  CardMedia,
  FormHelperText,
} from '@mui/material';
import { useTheme } from '@mui/material';
import { tokens } from '../../theme';
import axios from 'axios';
import { AuthContext } from '../../components/PrivateComponents/AuthContext';
import Header from '../scenes/Header';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import PetsIcon from '@mui/icons-material/Pets';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import CakeIcon from '@mui/icons-material/Cake';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import BarChartIcon from '@mui/icons-material/BarChart';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import WarningIcon from '@mui/icons-material/Warning';
import PregnantWomanIcon from '@mui/icons-material/PregnantWoman';
import { useNavigate } from 'react-router-dom';

// ========================
// UTILITY FUNCTIONS
// ========================

// Calculate age in human-readable format
const calculateAge = (birthDate) => {
  if (!birthDate) return 'N/A';
  const today = new Date();
  const birth = new Date(birthDate);
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }
  
  const parts = [];
  if (years > 0) parts.push(`${years} years`);
  if (months > 0) parts.push(`${months} months`);
  if (days > 0) parts.push(`${days} days`);

  return parts.length > 0 ? parts.join(', ') : 'Less than a day';
};

// Format numbers with commas
const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num || 0);
};

// Get species icon component
const getSpeciesIcon = (species) => {
  const iconProps = { fontSize: 'large' };
  switch (species?.toLowerCase()) {
    case 'cow':
    case 'bull':
      return <PetsIcon {...iconProps} />;
    case 'goat':
      return <PetsIcon {...iconProps} />;
    case 'sheep':
      return <PetsIcon {...iconProps} />;
    case 'pig':
      return <PetsIcon {...iconProps} />;
    default:
      return <PetsIcon {...iconProps} />;
  }
};

// Get health status color based on stage
const getHealthStatusColor = (stage) => {
  switch (stage?.toLowerCase()) {
    case 'calf':
    case 'kid':
    case 'lamb':
    case 'piglet':
      return 'success';
    case 'heifer':
    case 'yearling':
      return 'warning';
    case 'cow':
    case 'bull':
    case 'doe':
    case 'ram':
    case 'sow':
    case 'boar':
      return 'info';
    default:
      return 'default';
  }
};

// ========================
// MAIN COMPONENT
// ========================

const AnimalDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { token } = useContext(AuthContext);

  // ========================
  // STATE MANAGEMENT
  // ========================
  
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedOffspring, setExpandedOffspring] = useState({});
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [selectedSpecies, setSelectedSpecies] = useState('all');
  
  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    species: 'cow',
    breed: '',
    gender: 'female',
    birth_date: '',
    stage: 'calf',
    bull_code: '',
    bull_name: '',
    origin_farm: '',
    country: '',
    photo: null,
  });
  
  const [photoPreview, setPhotoPreview] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Species configuration
  const speciesConfig = [
    { value: 'all', label: 'All Animals', color: colors.grey[500] },
    { value: 'cow', label: 'Cows', color: colors.blueAccent[500] },
    { value: 'bull', label: 'Bulls', color: colors.redAccent[500] },
    { value: 'goat', label: 'Goats', color: colors.greenAccent[500] },
    { value: 'sheep', label: 'Sheep', color: colors.primary[300] },
    { value: 'pig', label: 'Pigs', color: colors.primary[400] },
  ];

  // ========================
  // API CALLS
  // ========================

  // Fetch all animals
  const fetchAnimals = useCallback(async (showRefreshing = false) => {
    if (!token) {
      setError('Authentication token not found. Please log in.');
      return;
    }

    if (showRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    setError(null);
    
    try {
      const params = {};
      if (selectedSpecies !== 'all') params.species = selectedSpecies;
      if (filterBy !== 'all') params.filter = filterBy;
      if (sortBy) params.sort = sortBy;

      const response = await axios.get('https://maziwasmart.onrender.com/api/animals', {
        headers: { Authorization: `Bearer ${token}` },
        params,
        timeout: 10000,
      });
      
      if (response.data?.animals) {
        setAnimals(response.data.animals);
        checkForAnomalies(response.data.animals);
        if (showRefreshing) {
          setSuccess('Animal data refreshed successfully!');
        }
      }
    } catch (err) {
      console.error('Failed to fetch animals:', err);
      const errorMessage = err.code === 'ECONNABORTED' 
        ? 'Request timed out. Please check your connection and try again.'
        : err.response?.data?.message || 'Failed to fetch animals. Please try again later.';
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token, selectedSpecies, filterBy, sortBy]);

  // Add new animal
  const addAnimal = async () => {
    if (!formData.name || !formData.species) {
      setError('Name and species are required');
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] && key !== 'photo') {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      if (formData.photo) {
        formDataToSend.append('photo', formData.photo);
      }

      const response = await axios.post(
        'https://maziwasmart.onrender.com/api/animals',
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data?.animal) {
        setAnimals(prev => [...prev, response.data.animal]);
        setSuccess(`${formData.species} added successfully!`);
        handleCloseAddDialog();
      }
    } catch (err) {
      console.error('Failed to add animal:', err);
      setError(err.response?.data?.message || 'Failed to add animal');
    }
  };

  // Update animal
  const updateAnimal = async () => {
    if (!selectedAnimal?._id) return;

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined && key !== 'photo') {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      if (formData.photo instanceof File) {
        formDataToSend.append('photo', formData.photo);
      }

      const response = await axios.put(
        `https://maziwasmart.onrender.com/api/animals/${selectedAnimal._id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data?.animal) {
        setAnimals(prev => prev.map(a => 
          a._id === selectedAnimal._id ? response.data.animal : a
        ));
        setSuccess('Animal updated successfully!');
        handleCloseUpdateDialog();
      }
    } catch (err) {
      console.error('Failed to update animal:', err);
      setError(err.response?.data?.message || 'Failed to update animal');
    }
  };

  // Delete animal
  const deleteAnimal = async (id) => {
    if (!window.confirm('Are you sure you want to delete this animal?')) return;

    try {
      await axios.delete(`https://maziwasmart.onrender.com/api/animals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAnimals(prev => prev.filter(a => a._id !== id));
      setSuccess('Animal deleted successfully!');
    } catch (err) {
      console.error('Failed to delete animal:', err);
      setError(err.response?.data?.message || 'Failed to delete animal');
    }
  };

  // ========================
  // EFFECTS
  // ========================

  useEffect(() => {
    fetchAnimals();
  }, [fetchAnimals]);

  // ========================
  // EVENT HANDLERS
  // ========================

  const handleRefresh = () => {
    fetchAnimals(true);
  };

  const handleCloseSnackbar = () => {
    setSuccess(null);
    setError(null);
  };

  const toggleOffspring = (id) => {
    setExpandedOffspring(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleViewDetails = (animalId) => {
    navigate('/farmerdashboard/dairysummaries', { state: { cowId: animalId } });
  };

  const handleAddcalf = ()=>{
    navigate('/farmerdashboard/calf')
  }
  const handleOpenAddDialog = () => {
    setFormData({
      name: '',
      code: '',
      species: 'cow',
      breed: '',
      gender: 'female',
      birth_date: '',
      stage: 'calf',
      bull_code: '',
      bull_name: '',
      origin_farm: '',
      country: '',
      photo: null,
    });
    setPhotoPreview(null);
    setAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
    setFormData({
      name: '',
      code: '',
      species: 'cow',
      breed: '',
      gender: 'female',
      birth_date: '',
      stage: 'calf',
      bull_code: '',
      bull_name: '',
      origin_farm: '',
      country: '',
      photo: null,
    });
    setPhotoPreview(null);
  };

  const handleOpenUpdateDialog = (animal) => {
    setSelectedAnimal(animal);
    setFormData({
      name: animal.name || '',
      code: animal.code || '',
      species: animal.species || 'cow',
      breed: animal.breed || '',
      gender: animal.gender || 'female',
      birth_date: animal.birth_date ? animal.birth_date.split('T')[0] : '',
      stage: animal.stage || 'calf',
      bull_code: animal.bull_code || '',
      bull_name: animal.bull_name || '',
      origin_farm: animal.origin_farm || '',
      country: animal.country || '',
      photo: null,
    });
    setPhotoPreview(animal.photo_url || null);
    setUpdateDialogOpen(true);
  };

  const handleCloseUpdateDialog = () => {
    setUpdateDialogOpen(false);
    setSelectedAnimal(null);
    setFormData({
      name: '',
      code: '',
      species: 'cow',
      breed: '',
      gender: 'female',
      birth_date: '',
      stage: 'calf',
      bull_code: '',
      bull_name: '',
      origin_farm: '',
      country: '',
      photo: null,
    });
    setPhotoPreview(null);
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, photo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Check for anomalies and pregnancy alerts
  const checkForAnomalies = (animalList) => {
    const alerts = [];
    
    animalList.forEach(animal => {
      // Check for low milk yield anomaly
      if (animal.species === 'cow' && animal.stage === 'cow') {
        const lifetimeYield = animal.litres_records?.reduce((total, record) => total + record.litres, 0) || 0;
        if (lifetimeYield < 500) {
          alerts.push({
            type: 'warning',
            message: `${animal.name} has low lifetime milk yield (${lifetimeYield}L)`,
          });
        }
      }
      
      // Check for pregnancy status
      if (animal.gender === 'female' && animal.is_pregnant) {
        alerts.push({
          type: 'info',
          message: `${animal.name} is currently pregnant`,
        });
      }
    });
    
    setNotifications(alerts);
  };

  // ========================
  // FILTERING & SORTING
  // ========================

  const processedAnimals = useMemo(() => {
    let filtered = animals.filter((animal) => {
      const matchesSearch = 
        animal.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.code?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.breed?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSpecies = selectedSpecies === 'all' || animal.species === selectedSpecies;
      
      const matchesFilter = 
        filterBy === 'all' || 
        (filterBy === 'male' && animal.gender === 'male') ||
        (filterBy === 'female' && animal.gender === 'female') ||
        (filterBy === 'has_offspring' && animal.offspring_ids?.length > 0) ||
        (filterBy === 'high_yield' && animal.species === 'cow' && 
          (animal.litres_records?.reduce((total, record) => total + record.litres, 0) || 0) > 1000);
      
      return matchesSearch && matchesSpecies && matchesFilter;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'age':
          return new Date(a.birth_date || 0) - new Date(b.birth_date || 0);
        case 'yield':
          const aYield = a.litres_records?.reduce((total, record) => total + record.litres, 0) || 0;
          const bYield = b.litres_records?.reduce((total, record) => total + record.litres, 0) || 0;
          return bYield - aYield;
        case 'offspring':
          return (b.offspring_ids?.length || 0) - (a.offspring_ids?.length || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [animals, searchTerm, selectedSpecies, filterBy, sortBy]);

  // ========================
  // STATS CALCULATIONS
  // ========================

  const stats = useMemo(() => {
    const totalMilk = animals
      .filter(a => a.species === 'cow')
      .reduce((total, animal) => 
        total + (animal.litres_records?.reduce((sum, record) => sum + record.litres, 0) || 0), 0
      );
    
    const totalOffspring = animals.reduce((total, animal) => 
      total + (animal.offspring_ids?.length || 0), 0
    );
    
    const femaleCount = animals.filter(a => a.gender === 'female').length;
    const femaleRatio = animals.length > 0 ? Math.round((femaleCount / animals.length) * 100) : 0;
    
    return {
      total: animals.length,
      totalMilk,
      totalOffspring,
      femaleRatio,
    };
  }, [animals]);

  // ========================
  // RENDER COMPONENTS
  // ========================

  // Render skeleton cards for loading state
  const renderSkeletonCards = () => (
    <Grid container spacing={2}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Grid item xs={12} sm={6} md={4} key={i}>
          <Card sx={{ background: colors.primary[500], p: 2 }}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Skeleton variant="circular" width={48} height={48} />
              <Box flex={1}>
                <Skeleton variant="text" width="60%" height={30} />
                <Skeleton variant="text" width="40%" height={20} />
              </Box>
            </Box>
            <Skeleton variant="rectangular" height={150} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="80%" />
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  // Render individual animal card
  const renderAnimalCard = useCallback((animal) => {
    const lifetimeYield = animal.litres_records?.reduce((total, record) => total + record.litres, 0) || 0;
    const age = calculateAge(animal.birth_date);
    const healthStatus = getHealthStatusColor(animal.stage);

    return (
      <Grid item xs={12} sm={6} md={4} key={animal._id}>
        <Card sx={{ 
          background: colors.primary[500],
          borderRadius: '12px',
          border: `1px solid ${colors.primary[300]}`,
          transition: 'all 0.3s ease',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 8px 25px ${colors.primary[700]}`,
            border: `1px solid ${colors.greenAccent[500]}`,
          }
        }}>
          <CardContent sx={{ p: 3, flexGrow: 1 }}>
            {/* Header with avatar and status */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar 
                  src={animal.photo_url} 
                  sx={{ 
                    bgcolor: colors.greenAccent[600], 
                    color: colors.grey[100],
                    width: 48,
                    height: 48
                  }}
                >
                  {getSpeciesIcon(animal.species)}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold" color={colors.greenAccent[400]}>
                    {animal.name}
                  </Typography>
                  <Typography variant="body2" color={colors.grey[300]}>
                    Code: {animal.code || 'N/A'}
                  </Typography>
                </Box>
              </Box>
              <Chip 
                label={animal.stage?.toUpperCase() || 'N/A'} 
                color={healthStatus}
                size="small"
                variant="outlined"
              />
            </Box>

            {/* Photo preview */}
            {animal.photo_url && (
              <CardMedia
                component="img"
                height="140"
                image={animal.photo_url}
                alt={animal.name}
                sx={{ borderRadius: '8px', mb: 2, objectFit: 'cover' }}
              />
            )}

            {/* Quick stats */}
            <Grid container spacing={1} mb={2}>
              <Grid item xs={12}>
                <Box display="flex" alignItems="center" gap={1}>
                  {animal.gender === 'male' ? <MaleIcon color="info" /> : <FemaleIcon color="secondary" />}
                  <Typography variant="body2" color={colors.grey[300]}>
                    {animal.breed || 'Unknown breed'} • {animal.species}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" alignItems="center" gap={1}>
                  <CakeIcon color="warning" />
                  <Typography variant="body2" color={colors.grey[300]}>
                    {age}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Bull details when species is bull */}
            {animal.species === 'bull' && (animal.bull_code || animal.bull_name || animal.origin_farm || animal.country) && (
              <Box 
                sx={{ 
                  p: 1.5, 
                  mb: 2, 
                  border: `1px solid ${colors.grey[700]}`, 
                  borderRadius: '8px',
                  bgcolor: colors.primary[600]
                }}
              >
                <Typography variant="caption" color={colors.grey[400]} fontWeight="bold">
                  Bull Details
                </Typography>
                {animal.bull_name || animal.bull_code ? (
                  <Typography variant="body2" color={colors.grey[300]}>
                    {animal.bull_name} {animal.bull_code ? `(${animal.bull_code})` : ''}
                  </Typography>
                ) : null}
                {(animal.origin_farm || animal.country) && (
                  <Typography variant="caption" color={colors.grey[400]} display="block">
                    {animal.origin_farm ? `Origin: ${animal.origin_farm}` : ''}{animal.origin_farm && animal.country ? ' • ' : ''}{animal.country || ''}
                  </Typography>
                )}
              </Box>
            )}

            {/* Bull information for offspring linkage on any species */}
            {animal.bull_code && animal.bull_name && (
              <Box 
                sx={{ 
                  p: 1.5, 
                  mb: 2, 
                  border: `1px solid ${colors.grey[700]}`, 
                  borderRadius: '8px',
                  bgcolor: colors.primary[600]
                }}
              >
                <Typography variant="caption" color={colors.grey[400]} fontWeight="bold">
                  Bull Information
                </Typography>
                <Typography variant="body2" color={colors.grey[300]}>
                  {animal.bull_name} ({animal.bull_code})
                </Typography>
              </Box>
            )}

            {/* Offspring section */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
              <Box display="flex" alignItems="center" gap={1}>
                <FamilyRestroomIcon color="info" />
                <Typography variant="body2" color={colors.grey[300]}>
                  Offspring
                </Typography>
                <Badge badgeContent={animal.offspring_ids?.length || 0} color="primary" />
              </Box>
              {animal.offspring_ids?.length > 0 && (
                <IconButton 
                  onClick={() => toggleOffspring(animal._id)} 
                  size="small"
                  sx={{ color: colors.greenAccent[400] }}
                >
                  {expandedOffspring[animal._id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              )}
            </Box>

            {/* Expandable offspring list */}
            <Collapse in={expandedOffspring[animal._id]} timeout="auto" unmountOnExit>
              <Box sx={{ 
                mt: 2, 
                p: 2, 
                border: `1px solid ${colors.grey[700]}`, 
                borderRadius: '8px',
                bgcolor: colors.primary[600]
              }}>
                {animal.offspring_ids?.length > 0 ? (
                  <Grid container spacing={1}>
                    {animal.offspring_ids.map((offspring) => (
                      <Grid item xs={12} key={offspring._id}>
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="body2" color={colors.grey[200]} fontWeight="bold">
                            {offspring.name}
                          </Typography>
                          <Typography variant="caption" color={colors.grey[400]}>
                            {offspring.species} • {offspring.breed || 'Unknown breed'} • {calculateAge(offspring.birth_date)}
                          </Typography>
                          {(offspring.bull_name || offspring.bull_code) && (
                            <Typography variant="caption" color={colors.grey[400]} display="block">
                              Bull: {offspring.bull_name || 'N/A'} {offspring.bull_code ? `(${offspring.bull_code})` : ''}
                            </Typography>
                          )}
                          {(offspring.origin_farm || offspring.country) && (
                            <Typography variant="caption" color={colors.grey[400]} display="block">
                              Sire Origin: {offspring.origin_farm || 'N/A'} {offspring.country ? `• ${offspring.country}` : ''}
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography variant="body2" color={colors.grey[400]} fontStyle="italic">
                    No offspring recorded
                  </Typography>
                )}
              </Box>
            </Collapse>

            {/* Milk yield for cows */}
            {animal.species === 'cow' && (
              <Box display="flex" alignItems="center" gap={1} mt={2}>
                <LocalDrinkIcon color="success" />
                <Typography variant="body2" color={colors.grey[300]}>
                  Lifetime Yield: {formatNumber(lifetimeYield)} litres
                </Typography>
              </Box>
            )}
          </CardContent>

          {/* Action buttons */}
          <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<EditIcon />}
              onClick={() => handleOpenUpdateDialog(animal)}
              sx={{
                color: colors.blueAccent[400],
                borderColor: colors.blueAccent[400],
                '&:hover': { 
                  borderColor: colors.blueAccent[300],
                  bgcolor: colors.blueAccent[700] 
                },
              }}
            >
              Update
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={() => deleteAnimal(animal._id)}
              sx={{
                color: colors.redAccent[400],
                borderColor: colors.redAccent[400],
                '&:hover': { 
                  borderColor: colors.redAccent[300],
                  bgcolor: colors.redAccent[700] 
                },
              }}
            >
              Delete
            </Button>
            {animal.species === 'cow' && (
              <Button
                variant="contained"
                size="small"
                startIcon={<BarChartIcon />}
                onClick={() => handleViewDetails(animal._id)}
                sx={{
                  backgroundColor: colors.greenAccent[600],
                  color: colors.grey[100],
                  '&:hover': { backgroundColor: colors.greenAccent[700] },
                }}
              >
                Dairy Details
              </Button>
            )}
          </Box>
        </Card>
      </Grid>
    );
  }, [colors, expandedOffspring, navigate]);

  // Render form dialog (for add/update)
  const renderFormDialog = (isUpdate = false) => (
    <Dialog 
      open={isUpdate ? updateDialogOpen : addDialogOpen} 
      onClose={isUpdate ? handleCloseUpdateDialog : handleCloseAddDialog}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ bgcolor: colors.primary[400] }}>
        {isUpdate ? 'Update Animal' : 'Add New Animal'}
      </DialogTitle>
      <DialogContent sx={{ bgcolor: colors.primary[400], pt: 3 }}>
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            if (isUpdate) {
              updateAnimal();
            } else {
              addAnimal();
            }
          }}
          noValidate
        >
          <Grid container spacing={2}>
            {/* Photo upload */}
            <Grid item xs={12}>
              <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                {photoPreview && (
                  <Avatar
                    src={photoPreview}
                    sx={{ width: 120, height: 120 }}
                    variant="rounded"
                  />
                )}
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<PhotoCamera />}
                  sx={{ color: colors.grey[100] }}
                >
                  {photoPreview ? 'Change Photo' : 'Upload Photo'}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                </Button>
                {formData.photo instanceof File && (
                  <FormHelperText sx={{ color: colors.grey[300] }}>
                    Selected: {formData.photo.name}
                  </FormHelperText>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name *"
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                variant="filled"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Code"
                value={formData.code}
                onChange={(e) => handleFormChange('code', e.target.value)}
                variant="filled"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="filled">
                <InputLabel>Species *</InputLabel>
                <Select
                  value={formData.species}
                  onChange={(e) => handleFormChange('species', e.target.value)}
                >
                  <MenuItem value="cow">Cow</MenuItem>
                  <MenuItem value="bull">Bull</MenuItem>
                  <MenuItem value="goat">Goat</MenuItem>
                  <MenuItem value="sheep">Sheep</MenuItem>
                  <MenuItem value="pig">Pig</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Breed"
                value={
                  formData.breed}
                onChange={(e) => handleFormChange('breed', e.target.value)}
                variant="filled"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="filled">
                <InputLabel>Gender</InputLabel>
                <Select
                  value={formData.gender}
                  onChange={(e) => handleFormChange('gender', e.target.value)}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Birth Date"
                type="date"
                value={formData.birth_date}
                onChange={(e) => handleFormChange('birth_date', e.target.value)}
                variant="filled"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="filled">
                <InputLabel>Stage</InputLabel>
                <Select
                  value={formData.stage}
                  onChange={(e) => handleFormChange('stage', e.target.value)}
                >
                  <MenuItem value="calf">Calf</MenuItem>
                  <MenuItem value="heifer">Heifer</MenuItem>
                  <MenuItem value="cow">Cow</MenuItem>
                  <MenuItem value="bull">Bull</MenuItem>
                  <MenuItem value="kid">Kid</MenuItem>
                  <MenuItem value="yearling">Yearling</MenuItem>
                  <MenuItem value="doe">Doe</MenuItem>
                  <MenuItem value="ram">Ram</MenuItem>
                  <MenuItem value="lamb">Lamb</MenuItem>
                  <MenuItem value="piglet">Piglet</MenuItem>
                  <MenuItem value="sow">Sow</MenuItem>
                  <MenuItem value="boar">Boar</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Bull Code"
                value={formData.bull_code}
                onChange={(e) => handleFormChange('bull_code', e.target.value)}
                variant="filled"
                helperText="For offspring tracking"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Bull Name"
                value={formData.bull_name}
                onChange={(e) => handleFormChange('bull_name', e.target.value)}
                variant="filled"
                helperText="Name of the bull (if applicable)"
              />
            </Grid>

            {/* Bull-specific fields */}
            {formData.species === 'bull' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Origin Farm"
                    value={formData.origin_farm}
                    onChange={(e) => handleFormChange('origin_farm', e.target.value)}
                    variant="filled"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Country"
                    value={formData.country}
                    onChange={(e) => handleFormChange('country', e.target.value)}
                    variant="filled"
                  />
                </Grid>
              </>
            )}
          </Grid>
          <DialogActions sx={{ bgcolor: colors.primary[400], p: 2 }}>
            <Button 
              onClick={isUpdate ? handleCloseUpdateDialog : handleCloseAddDialog}
              sx={{ color: colors.grey[300] }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
              sx={{
                backgroundColor: colors.greenAccent[600],
                color: colors.grey[100],
                '&:hover': { backgroundColor: colors.greenAccent[700] },
              }}
            >
              {isUpdate ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );

  // ========================
  // MAIN RENDER
  // ========================

  return (
    <Box m="20px">
      <Header
        title="ANIMAL DASHBOARD"
        subtitle="Manage all your farm animals across species"
      />
      
      {/* Snackbar notifications */}
      <Snackbar 
        open={!!success || !!error} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar} 
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={success ? "success" : "error"} 
          variant="filled" 
          sx={{ width: '100%' }}
        >
          {success || error}
        </Alert>
      </Snackbar>

      {/* Notification alerts for anomalies and pregnancy */}
      {notifications.length > 0 && (
        <Box mb={2}>
          {notifications.map((notification, index) => (
            <Alert 
              key={index}
              severity={notification.type}
              icon={notification.type === 'info' ? <PregnantWomanIcon /> : <WarningIcon />}
              sx={{ mb: 1 }}
            >
              {notification.message}
            </Alert>
          ))}
        </Box>
      )}

      <Fade in timeout={800}>
        <Box>
          {/* Species filter buttons */}
          <Box 
            display="flex" 
            gap={1} 
            mb={3} 
            flexWrap="wrap"
            sx={{
              background: colors.primary[400],
              borderRadius: '12px',
              p: 2,
            }}
          >
            {speciesConfig.map((species) => (
              <Button
                key={species.value}
                variant={selectedSpecies === species.value ? 'contained' : 'outlined'}
                onClick={() => setSelectedSpecies(species.value)}
                sx={{
                  backgroundColor: selectedSpecies === species.value ? species.color : 'transparent',
                  color: selectedSpecies === species.value ? colors.grey[100] : colors.grey[300],
                  borderColor: species.color,
                  '&:hover': {
                    backgroundColor: species.color,
                    color: colors.grey[100],
                  },
                }}
              >
                {species.label}
              </Button>
            ))}
          </Box>

          {/* Controls section */}
          <Box 
            display="flex" 
            flexDirection={{ xs: 'column', md: 'row' }}
            gap={2}
            alignItems={{ xs: 'stretch', md: 'center' }}
            mb={3}
            p={3}
            sx={{
              background: colors.primary[400],
              borderRadius: '12px',
              border: `1px solid ${colors.primary[300]}`
            }}
          >
            {/* Search */}
            <TextField
              variant="filled"
              label="Search animals..."
              placeholder="Name, code, or breed"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: colors.grey[400], mr: 1 }} />,
              }}
              sx={{ flex: 1, maxWidth: { xs: '100%', md: '300px' } }}
            />

            {/* Filter */}
            <FormControl variant="filled" sx={{ minWidth: 150 }}>
              <InputLabel>Filter</InputLabel>
              <Select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                startAdornment={<FilterListIcon sx={{ color: colors.grey[400], mr: 1 }} />}
              >
                <MenuItem value="all">All Animals</MenuItem>
                <MenuItem value="male">Males</MenuItem>
                <MenuItem value="female">Females</MenuItem>
                <MenuItem value="has_offspring">With Offspring</MenuItem>
                <MenuItem value="high_yield">High Yield</MenuItem>
              </Select>
            </FormControl>

            {/* Sort */}
            <FormControl variant="filled" sx={{ minWidth: 150 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="age">Age</MenuItem>
                <MenuItem value="yield">Yield</MenuItem>
                <MenuItem value="offspring">Offspring</MenuItem>
              </Select>
            </FormControl>

            {/* Action buttons */}
            <Box display="flex" gap={1} flexWrap="wrap">
              <Tooltip title="Refresh data">
                <IconButton 
                  onClick={handleRefresh}
                  disabled={refreshing}
                  sx={{ 
                    color: colors.grey[100],
                    bgcolor: colors.primary[500],
                    '&:hover': { bgcolor: colors.primary[600] }
                  }}
                >
                  <RefreshIcon sx={{ 
                    animation: refreshing ? 'spin 1s linear infinite' : 'none',
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' },
                    }
                  }} />
                </IconButton>
              </Tooltip>

              <Button
                variant="contained"
                sx={{
                  backgroundColor: colors.greenAccent[600],
                  color: colors.grey[100],
                  '&:hover': { backgroundColor: colors.greenAccent[700] },
                }}
                startIcon={<AddIcon />}
                onClick={handleOpenAddDialog}
              >
                Add Animal
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: colors.greenAccent[600],
                  color: colors.grey[100],
                  '&:hover': { backgroundColor: colors.greenAccent[700] },
                }}
                startIcon={<AddIcon />}
                onClick={handleAddcalf}
              >
                Add Calf
              </Button>
            </Box>
          </Box>

          {/* Stats summary */}
          <Grid container spacing={2} mb={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                background: colors.primary[500], 
                textAlign: 'center', 
                p: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: `0 4px 20px ${colors.primary[700]}`,
                }
              }}>
                {loading ? (
                  <>
                    <Skeleton variant="text" width="40%" sx={{ mx: 'auto' }} height={36} />
                    <Skeleton variant="text" width="60%" sx={{ mx: 'auto' }} height={20} />
                  </>
                ) : (
                  <>
                    <Typography variant="h4" color={colors.greenAccent[400]} fontWeight="bold">
                      {formatNumber(stats.total)}
                    </Typography>
                    <Typography variant="body2" color={colors.grey[300]}>
                      Total Animals
                    </Typography>
                  </>
                )}
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                background: colors.primary[500], 
                textAlign: 'center', 
                p: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: `0 4px 20px ${colors.primary[700]}`,
                }
              }}>
                {loading ? (
                  <>
                    <Skeleton variant="text" width="40%" sx={{ mx: 'auto' }} height={36} />
                    <Skeleton variant="text" width="60%" sx={{ mx: 'auto' }} height={20} />
                  </>
                ) : (
                  <>
                    <Typography variant="h4" color={colors.blueAccent[400]} fontWeight="bold">
                      {formatNumber(stats.totalMilk)}L
                    </Typography>
                    <Typography variant="body2" color={colors.grey[300]}>
                      Total Milk Yield
                    </Typography>
                  </>
                )}
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                background: colors.primary[500], 
                textAlign: 'center', 
                p: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: `0 4px 20px ${colors.primary[700]}`,
                }
              }}>
                {loading ? (
                  <>
                    <Skeleton variant="text" width="40%" sx={{ mx: 'auto' }} height={36} />
                    <Skeleton variant="text" width="60%" sx={{ mx: 'auto' }} height={20} />
                  </>
                ) : (
                  <>
                    <Typography variant="h4" color={colors.redAccent[400]} fontWeight="bold">
                      {formatNumber(stats.totalOffspring)}
                    </Typography>
                    <Typography variant="body2" color={colors.grey[300]}>
                      Total Offspring
                    </Typography>
                  </>
                )}
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                background: colors.primary[500], 
                textAlign: 'center', 
                p: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: `0 4px 20px ${colors.primary[700]}`,
                }
              }}>
                {loading ? (
                  <>
                    <Skeleton variant="text" width="40%" sx={{ mx: 'auto' }} height={36} />
                    <Skeleton variant="text" width="60%" sx={{ mx: 'auto' }} height={20} />
                  </>
                ) : (
                  <>
                    <Typography variant="h4" color={colors.grey[100]} fontWeight="bold">
                      {stats.femaleRatio}%
                    </Typography>
                    <Typography variant="body2" color={colors.grey[300]}>
                      Female Ratio
                    </Typography>
                  </>
                )}
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Fade>

      {/* Animal cards grid */}
      {loading ? (
        <Box>
          {renderSkeletonCards()}
        </Box>
      ) : processedAnimals.length > 0 ? (
        <Grid container spacing={2}>
          {processedAnimals.map(renderAnimalCard)}
        </Grid>
      ) : (
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          minHeight="400px"
          sx={{
            background: colors.primary[400],
            borderRadius: '12px',
            p: 4,
          }}
        >
          <PetsIcon sx={{ fontSize: 80, color: colors.grey[500], mb: 2, opacity: 0.5 }} />
          <Typography variant="h5" color={colors.grey[400]} fontStyle="italic" mb={2}>
            No animals found
          </Typography>
          <Typography variant="body2" color={colors.grey[500]} mb={3}>
            Try adjusting your filters or add a new animal to get started
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
            sx={{
              backgroundColor: colors.greenAccent[600],
              color: colors.grey[100],
              '&:hover': { backgroundColor: colors.greenAccent[700] },
            }}
          >
            Add Your First Animal
          </Button>
        </Box>
      )}

      {/* Add/Update dialogs */}
      {renderFormDialog(false)}
      {renderFormDialog(true)}
    </Box>
  );
};

export default AnimalDashboard;

