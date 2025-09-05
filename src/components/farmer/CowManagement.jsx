import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Fade,
  Alert,
  Snackbar,
  Divider,
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
import BarChartIcon from '@mui/icons-material/BarChart'; // 📊 New icon for the button
import { useNavigate } from 'react-router-dom';

// Utility function to calculate age in a human-readable format
const calculateAge = (birthDate) => {
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

// Utility function to format numbers
const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num || 0);
};

// Get health status color
const getHealthStatusColor = (stage, age) => {
  if (stage === 'calf' && age < 30) return 'success';
  if (stage === 'heifer') return 'warning';
  if (stage === 'cow') return 'info';
  return 'default';
};

const CowManagement = () => {
  const navigate = useNavigate(); 
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { token } = useContext(AuthContext);

  // State management
  const [cows, setCows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedOffspring, setExpandedOffspring] = useState({});
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // API call with better error handling
  const fetchCows = useCallback(async (showRefreshing = false) => {
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
      const response = await axios.get('https://maziwasmart.onrender.com/api/cow', {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000, // 10 second timeout
      });
      
      if (response.data?.cows) {
        setCows(response.data.cows);
        if (showRefreshing) {
          setSuccess('Herd data refreshed successfully!');
        }
      }
    } catch (err) {
      console.error('Failed to fetch cows:', err.response?.data || err.message);
      const errorMessage = err.code === 'ECONNABORTED' 
        ? 'Request timed out. Please check your connection and try again.'
        : err.response?.data?.message || 'Failed to fetch cows. Please try again later.';
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCows();
  }, [fetchCows]);

  const handleRefresh = () => {
    fetchCows(true);
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
  
  // ✅ New handler for the navigation button

const handleViewDetails = (cowId) => {
  navigate('/farmerdashboard/dairysummaries', { state: { cowId } });
};

  // Memoized filtering and sorting
  const processedCows = useMemo(() => {
    let filtered = cows.filter((cow) => {
      const matchesSearch = cow.cow_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cow.cow_code && cow.cow_code.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
        (cow.breed_id?.breed_name && cow.breed_id.breed_name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesFilter = filterBy === 'all' || 
        (filterBy === 'male' && cow.gender === 'male') ||
        (filterBy === 'female' && cow.gender === 'female') ||
        (filterBy === 'has_offspring' && cow.offspring_ids?.length > 0) ||
        (filterBy === 'high_yield' && cow.stage === 'cow' && 
          (cow.litres_records?.reduce((total, record) => total + record.litres, 0) || 0) > 1000);
      
      return matchesSearch && matchesFilter;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.cow_name.localeCompare(b.cow_name);
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
  }, [cows, searchTerm, filterBy, sortBy]);

  const calves = useMemo(() => processedCows.filter(cow => cow.stage === 'calf'), [processedCows]);
  const heifers = useMemo(() => processedCows.filter(cow => cow.stage === 'heifer'), [processedCows]);
  const matureCows = useMemo(() => processedCows.filter(cow => cow.stage === 'cow'), [processedCows]);

  // Enhanced cow card component
  const renderCowCard = useCallback((cow) => {
    const lifetimeYield = cow.litres_records?.reduce((total, record) => total + record.litres, 0) || 0;
    const age = cow.birth_date ? calculateAge(cow.birth_date) : 'N/A';
    const healthStatus = getHealthStatusColor(cow.stage, age);

    return (
      <Card key={cow._id} sx={{ 
        background: colors.primary[500],
        borderRadius: '12px',
        mb: 2,
        border: `1px solid ${colors.primary[300]}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 25px ${colors.primary[700]}`,
          border: `1px solid ${colors.greenAccent[500]}`,
        }
      }}>
        <CardContent sx={{ p: 3 }}>
          {/* Header with avatar and status */}
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ 
                bgcolor: colors.greenAccent[600], 
                color: colors.grey[100],
                width: 48,
                height: 48
              }}>
                <PetsIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold" color={colors.greenAccent[400]}>
                  {cow.cow_name}
                </Typography>
                <Typography variant="body2" color={colors.grey[300]}>
                  Code: {cow.cow_code || 'N/A'}
                </Typography>
              </Box>
            </Box>
            <Chip 
              label={cow.stage.toUpperCase()} 
              color={healthStatus}
              size="small"
              variant="outlined"
            />
          </Box>

          {/* Quick stats */}
          <Grid container spacing={2} mb={2}>
            <Grid item xs={6}>
              <Box display="flex" alignItems="center" gap={1}>
                {cow.gender === 'male' ? <MaleIcon color="info" /> : <FemaleIcon color="secondary" />}
                <Typography variant="body2" color={colors.grey[300]}>
                  {cow.breed_id?.breed_name || 'Unknown breed'}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="flex" alignItems="center" gap={1}>
                <CakeIcon color="warning" />
                <Typography variant="body2" color={colors.grey[300]}>
                  {age}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Offspring section */}
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
            <Box display="flex" alignItems="center" gap={1}>
              <FamilyRestroomIcon color="info" />
              <Typography variant="body2" color={colors.grey[300]}>
                Offspring
              </Typography>
              <Badge badgeContent={cow.offspring_ids?.length || 0} color="primary" />
            </Box>
            {cow.offspring_ids?.length > 0 && (
              <IconButton 
                onClick={() => toggleOffspring(cow._id)} 
                size="small"
                sx={{ color: colors.greenAccent[400] }}
              >
                {expandedOffspring[cow._id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            )}
          </Box>

          {/* Expandable offspring list */}
          <Collapse in={expandedOffspring[cow._id]} timeout="auto" unmountOnExit>
            <Box sx={{ 
              mt: 2, 
              p: 2, 
              border: `1px solid ${colors.grey[700]}`, 
              borderRadius: '8px',
              bgcolor: colors.primary[600]
            }}>
              {cow.offspring_ids?.length > 0 ? (
                <Grid container spacing={1}>
                  {cow.offspring_ids.map((offspring) => (
                    <Grid item xs={12} key={offspring._id}>
                      <Chip
                        label={`${offspring.cow_name} (${calculateAge(offspring.birth_date)})`}
                        variant="outlined"
                        size="small"
                        sx={{ color: colors.grey[300], borderColor: colors.grey[600] }}
                      />
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

          {/* Yield information for mature cows */}
          {cow.stage === 'cow' && (
            <Box display="flex" flexDirection="column" gap={2} mt={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <LocalDrinkIcon color="success" />
                <Typography variant="body2" color={colors.grey[300]}>
                  Lifetime Yield: {formatNumber(lifetimeYield)} litres
                </Typography>
              </Box>
              
              {/* ✅ New "View Details" button for mature cows */}
              <Button
                variant="contained"
                onClick={() => handleViewDetails(cow._id)}
                sx={{
                  backgroundColor: colors.blueAccent[600],
                  color: colors.grey[100],
                  '&:hover': { backgroundColor: colors.blueAccent[700] },
                  mt: 1
                }}
                startIcon={<BarChartIcon />}
              >
                View Dairy Details
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  }, [colors, expandedOffspring, toggleOffspring, navigate]);

  const renderCowsSection = (cowsArray, title) => (
    <Box sx={{ 
      background: colors.primary[400], 
      borderRadius: '16px', 
      p: 4, 
      flex: '1', 
      maxHeight: '75vh', 
      overflowY: 'auto',
      '&::-webkit-scrollbar': {
        width: '8px',
      },
      '&::-webkit-scrollbar-track': {
        background: colors.primary[500],
        borderRadius: '4px',
      },
      '&::-webkit-scrollbar-thumb': {
        background: colors.greenAccent[600],
        borderRadius: '4px',
        '&:hover': {
          background: colors.greenAccent[500],
        },
      },
    }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h5" fontWeight="600" color={colors.greenAccent[400]}>
          {title}
        </Typography>
        <Chip 
          label={cowsArray.length} 
          color="primary" 
          variant="outlined"
          sx={{ fontWeight: 'bold' }}
        />
      </Box>
      <Divider sx={{ mb: 3, bgcolor: colors.grey[600] }} />
      
      {cowsArray.length > 0 ? (
        cowsArray.map(renderCowCard)
      ) : (
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          minHeight="200px"
          color={colors.grey[400]}
        >
          <PetsIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
          <Typography fontStyle="italic">
            No animals found in this category
          </Typography>
        </Box>
      )}
    </Box>
  );

  return (
    <Box m="20px">
      <Header
        title="FARM ANIMALS"
        subtitle="View and manage all your farm animals"
      />
      
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

      <Fade in timeout={800}>
        <Box>
          {/* Enhanced controls section */}
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
                onClick={() => navigate('/farmerdashboard/register-calf')}
              >
                Add Calf
              </Button>

              <Button
                variant="contained"
                sx={{
                  backgroundColor: colors.greenAccent[600],
                  color: colors.grey[100],
                  '&:hover': { backgroundColor: colors.greenAccent[700] },
                }}
                startIcon={<AddIcon />}
                onClick={() => navigate('/farmerdashboard/register-cow')}
              >
                Add Cow
              </Button>
            </Box>
          </Box>

          {/* Stats summary */}
          <Grid container spacing={2} mb={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: colors.primary[500], textAlign: 'center', p: 2 }}>
                <Typography variant="h4" color={colors.greenAccent[400]} fontWeight="bold">
                  {cows.length}
                </Typography>
                <Typography variant="body2" color={colors.grey[300]}>
                  Total Animals
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: colors.primary[500], textAlign: 'center', p: 2 }}>
                <Typography variant="h4" color={colors.blueAccent[400]} fontWeight="bold">
                  {matureCows.reduce((total, cow) => 
                    total + (cow.litres_records?.reduce((sum, record) => sum + record.litres, 0) || 0), 0
                  )}L
                </Typography>
                <Typography variant="body2" color={colors.grey[300]}>
                  Total Yield
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: colors.primary[500], textAlign: 'center', p: 2 }}>
                <Typography variant="h4" color={colors.redAccent[400]} fontWeight="bold">
                  {cows.reduce((total, cow) => total + (cow.offspring_ids?.length || 0), 0)}
                </Typography>
                <Typography variant="body2" color={colors.grey[300]}>
                  Total Offspring
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: colors.primary[500], textAlign: 'center', p: 2 }}>
                <Typography variant="h4" color={colors.grey[100]} fontWeight="bold">
                  {Math.round(cows.filter(cow => cow.gender === 'female').length / cows.length * 100) || 0}%
                </Typography>
                <Typography variant="body2" color={colors.grey[300]}>
                  Female Ratio
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Fade>

      {loading ? (
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress color="success" size={60} />
          <Typography variant="h6" color={colors.grey[300]} mt={2}>
            Loading your herd...
          </Typography>
        </Box>
      ) : (
        <Box display="flex" flexDirection={{ xs: 'column', lg: 'row' }} gap="20px">
          {renderCowsSection(calves, `Calves (${calves.length})`)}
          {renderCowsSection(heifers, `Heifers (${heifers.length})`)}
          {renderCowsSection(matureCows, `Cows (${matureCows.length})`)}
        </Box>
      )}
    </Box>
  );
};

export default CowManagement;