import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Skeleton,
  IconButton,
} from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../../PrivateComponents/AuthContext';
import Header from '../../scenes/Header';

import AddIcon from '@mui/icons-material/Add';
import GrassIcon from '@mui/icons-material/Grass';
import PetsIcon from '@mui/icons-material/Pets';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PublicIcon from '@mui/icons-material/Public';
import BusinessIcon from '@mui/icons-material/Business';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import CloseIcon from '@mui/icons-material/Close';

// ============================================================================
// BREED MANAGEMENT - MODAL FORM + BIGGER CARDS
// ============================================================================

const BreedManagement = () => {
  const { token } = useContext(AuthContext);

  const [breeds, setBreeds] = useState([]);
  const [newBreed, setNewBreed] = useState({
    breed_name: '',
    animal_species: 'cow',
    description: '',
    bull_code: '',
    bull_name: '',
    origin_farm: '',
    country: '',
  });
  const [editBreed, setEditBreed] = useState(null);
  const [deleteBreed, setDeleteBreed] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_BASE;

  // ============================================================================
  // THEME COLORS
  // ============================================================================

  const colors = {
    white: '#ffffff',
    aqua: '#17a2b8',
    aquaDark: '#138496',
    aquaLight: '#e0f7fa',
    black: '#212529',
    lightGrey: '#f8f9fa',
    borderGrey: '#e0e0e0',
    green: '#28a745',
    greenLight: '#e6f4ea',
    red: '#dc3545',
    redLight: '#f8d7da',
    blue: '#0056b3',
    orange: '#fd7e14',
    pink: '#e83e8c',
  };

  // ============================================================================
  // SPECIES CONFIGURATION
  // ============================================================================

  const speciesOptions = [
    { value: 'cow', label: 'Cattle', color: colors.green },
    { value: 'goat', label: 'Goats', color: colors.orange },
    { value: 'sheep', label: 'Sheep', color: colors.blue },
    { value: 'pig', label: 'Pigs', color: colors.pink },
  ];

  const maleRoleMap = {
    'cow': 'Bull',
    'goat': 'Buck',
    'sheep': 'Ram',
    'pig': 'Boar'
  };

  const getSpeciesColor = (species) => {
    const option = speciesOptions.find(opt => opt.value === species);
    return option ? option.color : colors.green;
  };

  const getSpeciesLabel = (species) => {
    const option = speciesOptions.find(opt => opt.value === species);
    return option ? option.label : species;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    try {
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      return 'Invalid Date';
    }
  };

  // ============================================================================
  // SNACKBAR
  // ============================================================================

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  // ============================================================================
  // API CALLS
  // ============================================================================

  const fetchBreeds = useCallback(async () => {
    if (!token) {
      showSnackbar('Authentication token not found.', 'error');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/breed`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBreeds(response.data.breeds || []);
    } catch (err) {
      console.error('Failed to fetch breeds:', err);
      showSnackbar('Failed to fetch breeds.', 'error');
    } finally {
      setLoading(false);
    }
  }, [token, API_BASE_URL]);

  useEffect(() => {
    fetchBreeds();
  }, [fetchBreeds]);

  // ============================================================================
  // INPUT HANDLERS
  // ============================================================================

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBreed({ ...newBreed, [name]: value });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditBreed({ ...editBreed, [name]: value });
  };

  // ============================================================================
  // CRUD OPERATIONS
  // ============================================================================

  const handleCreateBreed = async (e) => {
    e.preventDefault();

    if (!token) {
      showSnackbar('Authentication token not found.', 'error');
      return;
    }

    if (!newBreed.breed_name.trim()) {
      showSnackbar('Breed name is required.', 'error');
      return;
    }

    if (!newBreed.description.trim()) {
      showSnackbar('Description is required.', 'error');
      return;
    }

    setSubmitting(true);

    const payload = {
      breed_name: newBreed.breed_name.trim(),
      animal_species: newBreed.animal_species,
      description: newBreed.description.trim(),
    };

    if (newBreed.bull_code?.trim()) payload.bull_code = newBreed.bull_code.trim();
    if (newBreed.bull_name?.trim()) payload.bull_name = newBreed.bull_name.trim();
    if (newBreed.origin_farm?.trim()) payload.origin_farm = newBreed.origin_farm.trim();
    if (newBreed.country?.trim()) payload.country = newBreed.country.trim();

    try {
      const response = await axios.post(`${API_BASE_URL}/breed`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Refetch breeds to get the updated list with server-provided IDs
      await fetchBreeds();

      showSnackbar(response.data.message || 'Breed registered successfully!', 'success');

      setNewBreed({
        breed_name: '',
        animal_species: 'cow',
        description: '',
        bull_code: '',
        bull_name: '',
        origin_farm: '',
        country: '',
      });

      setOpenAddDialog(false);

    } catch (err) {
      console.error('Failed to create breed:', err);
      showSnackbar(err.response?.data?.message || 'Failed to create breed.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateBreed = async () => {
    if (!token || !editBreed) return;

    if (!editBreed.breed_name.trim()) {
      showSnackbar('Breed name is required.', 'error');
      return;
    }

    if (!editBreed.description.trim()) {
      showSnackbar('Description is required.', 'error');
      return;
    }

    setSubmitting(true);

    const payload = {
      breed_name: editBreed.breed_name.trim(),
      animal_species: editBreed.animal_species,
      description: editBreed.description.trim(),
    };

    if (editBreed.bull_code?.trim()) payload.bull_code = editBreed.bull_code.trim();
    if (editBreed.bull_name?.trim()) payload.bull_name = editBreed.bull_name.trim();
    if (editBreed.origin_farm?.trim()) payload.origin_farm = editBreed.origin_farm.trim();
    if (editBreed.country?.trim()) payload.country = editBreed.country.trim();

    try {
      const response = await axios.put(
        `${API_BASE_URL}/breed/${editBreed._id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBreeds(prevBreeds => prevBreeds.map(b =>
        b._id === editBreed._id ? { ...editBreed, ...payload } : b
      ));

      showSnackbar(response.data.message || 'Breed updated successfully!', 'success');
      handleCloseEditDialog();

    } catch (err) {
      console.error('Failed to update breed:', err);
      showSnackbar(err.response?.data?.message || 'Failed to update breed.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBreed = async () => {
    if (!token || !deleteBreed) return;

    setSubmitting(true);

    try {
      const response = await axios.delete(
        `${API_BASE_URL}/breed/${deleteBreed._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBreeds(prevBreeds => prevBreeds.filter(b => b._id !== deleteBreed._id));
      showSnackbar(response.data.message || 'Breed deleted successfully!', 'success');
      handleCloseDeleteDialog();

    } catch (err) {
      console.error('Failed to delete breed:', err);
      showSnackbar(err.response?.data?.message || 'Failed to delete breed.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================================
  // DIALOG HANDLERS
  // ============================================================================

  const handleOpenAddDialog = () => {
    setNewBreed({
      breed_name: '',
      animal_species: 'cow',
      description: '',
      bull_code: '',
      bull_name: '',
      origin_farm: '',
      country: '',
    });
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleOpenEditDialog = (breed) => {
    setEditBreed({
      _id: breed._id,
      breed_name: breed.breed_name,
      animal_species: breed.animal_species || breed.species,
      description: breed.description || '',
      bull_code: breed.bull_code || '',
      bull_name: breed.bull_name || '',
      origin_farm: breed.origin_farm || '',
      country: breed.country || '',
    });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditBreed(null);
  };

  const handleOpenDeleteDialog = (breed) => {
    setDeleteBreed(breed);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setDeleteBreed(null);
  };

  // ============================================================================
  // UI COMPONENTS
  // ============================================================================

  const SkeletonCard = () => (
    <Card sx={{
      background: colors.white,
      border: `1px solid ${colors.borderGrey}`,
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      height: '280px',
    }}>
      <CardContent sx={{ p: 2.5 }}>
        <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
        <Skeleton variant="rectangular" width="100px" height={28} sx={{ borderRadius: '4px', mb: 1.5 }} />
        <Skeleton variant="text" width="100%" height={18} sx={{ mb: 0.75 }} />
        <Skeleton variant="text" width="90%" height={18} sx={{ mb: 0.75 }} />
        <Skeleton variant="text" width="40%" height={16} sx={{ mt: 2 }} />
      </CardContent>
    </Card>
  );

  const EmptyStateCard = () => (
    <Card sx={{
      background: colors.greenLight,
      border: `2px dashed ${colors.green}`,
      borderRadius: '12px',
      textAlign: 'center',
      p: 5,
      mt: 2,
    }}>
      <GrassIcon sx={{ fontSize: 56, color: colors.green, mb: 2 }} />
      <Typography variant="h6" color={colors.black} fontWeight="600" gutterBottom>
        No Breeds Registered Yet
      </Typography>
      <Typography variant="body2" color={colors.black}>
        Click the "Add Breed" button to register your first breed.
      </Typography>
    </Card>
  );

  const SireDetailsCard = ({ breed }) => (
    <Box sx={{
      mt: 2,
      p: 1.5,
      background: colors.aquaLight,
      borderRadius: '8px',
      border: `1px solid ${colors.aqua}`
    }}>
      <Typography
        variant="caption"
        color={colors.aqua}
        fontWeight="700"
        display="block"
        mb={1}
      >
        {(() => {
          const resolvedSpecies = breed.animal_species ?? breed.species ?? 'unknown';
          return (maleRoleMap[resolvedSpecies] ?? 'Unknown');
        })()} Details:
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
        {(breed.bull_code || breed.bull_name) && (
          <Typography variant="caption" color={colors.black} display="flex" alignItems="center">
            <FingerprintIcon sx={{ fontSize: 14, mr: 0.75, color: colors.aqua }} />
            <strong>Code:</strong>&nbsp;{breed.bull_code || 'Not provided'}
          </Typography>
        )}
        {breed.bull_name && (
          <Typography variant="caption" color={colors.black} display="flex" alignItems="center">
            <strong>Name:</strong>&nbsp;{breed.bull_name}
          </Typography>
        )}
        {breed.origin_farm && (
          <Typography variant="caption" color={colors.black} display="flex" alignItems="center">
            <BusinessIcon sx={{ fontSize: 14, mr: 0.75, color: colors.aqua }} />
            <strong>Farm:</strong>&nbsp;{breed.origin_farm}
          </Typography>
        )}
        {breed.country && (
          <Typography variant="caption" color={colors.black} display="flex" alignItems="center">
            <PublicIcon sx={{ fontSize: 14, mr: 0.75, color: colors.aqua }} />
            <strong>Country:</strong>&nbsp;{breed.country}
          </Typography>
        )}
      </Box>
    </Box>
  );

  // Group breeds by species (with fallback for old data without animal_species)
  const breedsBySpecies = useMemo(() => {
    return speciesOptions.reduce((acc, option) => {
      acc[option.value] = breeds.filter(b => {
        const species = b.animal_species || b.species;
        return species === option.value;
      });
      return acc;
    }, {});
  }, [breeds]);

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <Box sx={{ background: colors.white, minHeight: '100vh', py: 4 }}>
      <Box sx={{ px: 3 }}>
        {/* Header with Add Button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ color: colors.black, fontWeight: 700, mb: 0.5 }}>
              BREED MANAGEMENT
            </Typography>
            <Typography variant="body1" sx={{ color: colors.black, fontWeight: 500 }}>
              Register and manage sire/dam genetics for your livestock
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
            sx={{
              background: colors.aqua,
              color: colors.white,
              fontWeight: 700,
              padding: '12px 28px',
              borderRadius: '8px',
              textTransform: 'none',
              fontSize: '1rem',
              whiteSpace: 'nowrap',
              '&:hover': { background: colors.aquaDark },
            }}
          >
            Add Breed
          </Button>
        </Box>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            variant="filled"
            sx={{
              width: '100%',
              background: snackbar.severity === 'success' ? colors.green : colors.red,
              color: colors.white,
            }}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={handleCloseSnackbar}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Breeds organized by species */}
        {loading ? (
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {[1, 2, 3, 4].map((i) => (
              <Grid item xs={12} sm={6} md={6} lg={3} key={i}>
                <SkeletonCard />
              </Grid>
            ))}
          </Grid>
        ) : Object.values(breedsBySpecies).every(b => b.length === 0) ? (
          <EmptyStateCard />
        ) : (
          <Box>
            {speciesOptions.map((speciesOption) => {
              const speciesBreeds = breedsBySpecies[speciesOption.value];
              if (speciesBreeds.length === 0) return null;

              return (
                <Box key={speciesOption.value} sx={{ mb: 5 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: speciesOption.color,
                      fontWeight: 700,
                      mb: 2.5,
                      paddingLeft: 1,
                      borderLeft: `4px solid ${speciesOption.color}`
                    }}
                  >
                    {speciesOption.label}
                  </Typography>

                  <Grid container spacing={3}>
                    {speciesBreeds.map((breed) => (
                      <Grid item xs={12} sm={6} md={6} lg={3} key={breed._id}>
                        <Card sx={{
                          background: colors.white,
                          border: `2px solid ${speciesOption.color}`,
                          borderRadius: '12px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                          transition: 'all 0.3s ease-in-out',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.12)',
                          }
                        }}>
                          <CardContent sx={{ p: 2.5, flex: 1 }}>
                            {/* Species Badge */}
                            <Chip
                              label={speciesOption.label}
                              size="small"
                              sx={{
                                background: speciesOption.color,
                                color: colors.white,
                                fontWeight: 700,
                                mb: 1.5,
                                height: '28px',
                              }}
                            />

                            {/* Breed Name */}
                            <Typography
                              variant="h6"
                              fontWeight="700"
                              color={colors.black}
                              sx={{ mb: 1, lineHeight: 1.3 }}
                            >
                              {breed.breed_name}
                            </Typography>

                            {/* Description */}
                            <Typography
                              variant="body2"
                              color={colors.black}
                              sx={{
                                mb: 2,
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                minHeight: '3em'
                              }}
                            >
                              {breed.description}
                            </Typography>

                            {/* Sire Details */}
                            {(breed.bull_code || breed.bull_name || breed.origin_farm || breed.country) && (
                              <SireDetailsCard breed={breed} />
                            )}

                            {/* Created Date */}
                            <Typography
                              variant="caption"
                              color={colors.borderGrey}
                              display="block"
                              sx={{ mt: 2 }}
                            >
                              Created: {formatDate(breed.createdAt || breed.created_at)}
                            </Typography>
                          </CardContent>

                          {/* Action Buttons */}
                          <CardActions sx={{ p: 1.5, pt: 0, justifyContent: 'flex-end', gap: 0.5 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleOpenEditDialog(breed)}
                              type="button"
                              aria-label={`Edit ${breed.breed_name || 'breed'}`}
                              sx={{
                                color: colors.aqua,
                                '&:hover': { background: colors.aquaLight },
                                padding: '8px'
                              }}
                            >
                              <EditIcon sx={{ fontSize: '20px' }} />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDeleteDialog(breed)}
                              type="button"
                              aria-label={`Delete ${breed.breed_name || 'breed'}`}
                              sx={{
                                color: colors.red,
                                '&:hover': { background: colors.redLight },
                                padding: '8px'
                              }}
                            >
                              <DeleteIcon sx={{ fontSize: '20px' }} />
                            </IconButton>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>

      {/* ===== ADD BREED MODAL ===== */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{
          background: colors.aqua,
          color: colors.white,
          fontWeight: 700,
          fontSize: '1.2rem'
        }}>
          Register New Breed
        </DialogTitle>
        <DialogContent sx={{ background: colors.white, mt: 2.5 }}>
          <Box component="form" onSubmit={handleCreateBreed}>
            <TextField
              fullWidth
              variant="outlined"
              label="Breed Name"
              name="breed_name"
              value={newBreed.breed_name}
              onChange={handleInputChange}
              placeholder="e.g., Holstein Friesian"
              required
              sx={{ mb: 2.5, mt: 1 }}
            />

            <TextField
              fullWidth
              select
              variant="outlined"
              label="Species"
              name="animal_species"
              value={newBreed.animal_species}
              onChange={handleInputChange}
              sx={{ mb: 2.5 }}
              required
            >
              {speciesOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              variant="outlined"
              label="Description"
              name="description"
              value={newBreed.description}
              onChange={handleInputChange}
              placeholder="Describe breed characteristics..."
              required
              multiline
              rows={4}
              sx={{ mb: 2.5 }}
            />

            {/* Sire Details */}
            <Box sx={{
              mt: 2.5,
              p: 2,
              background: colors.aquaLight,
              borderRadius: '8px',
              border: `1px solid ${colors.aqua}`
            }}>
              <Typography variant="subtitle2" color={colors.aqua} fontWeight="700" mb={1.5}>
                {maleRoleMap[newBreed.animal_species]} Information (Optional)
              </Typography>

              <TextField
                fullWidth
                variant="outlined"
                label={`${maleRoleMap[newBreed.animal_species]} Code`}
                name="bull_code"
                value={newBreed.bull_code}
                onChange={handleInputChange}
                placeholder="e.g., STD-2024-001"
                size="small"
                sx={{ mb: 1.5 }}
              />

              <TextField
                fullWidth
                variant="outlined"
                label={`${maleRoleMap[newBreed.animal_species]} Name`}
                name="bull_name"
                value={newBreed.bull_name}
                onChange={handleInputChange}
                placeholder="Traceable name"
                size="small"
                sx={{ mb: 1.5 }}
              />

              <TextField
                fullWidth
                variant="outlined"
                label="Origin Farm"
                name="origin_farm"
                value={newBreed.origin_farm}
                onChange={handleInputChange}
                placeholder="Farm name"
                size="small"
                sx={{ mb: 1.5 }}
              />

              <TextField
                fullWidth
                variant="outlined"
                label="Country"
                name="country"
                value={newBreed.country}
                onChange={handleInputChange}
                placeholder="Country of origin"
                size="small"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ background: colors.white, p: 2 }}>
          <Button onClick={handleCloseAddDialog} type="button" sx={{ color: colors.black }}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateBreed}
            variant="contained"
            disabled={submitting}
            type="button"
            sx={{
              background: colors.aqua,
              color: colors.white,
              '&:hover': { background: colors.aquaDark },
            }}
          >
            {submitting ? 'Registering...' : 'Register'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===== EDIT DIALOG ===== */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{
          background: colors.aqua,
          color: colors.white,
          fontWeight: 700,
          fontSize: '1.2rem'
        }}>
          Edit: {editBreed?.breed_name}
        </DialogTitle>
        <DialogContent sx={{ background: colors.white, mt: 2.5 }}>
          {editBreed && (
            <Box>
              <TextField
                fullWidth
                variant="outlined"
                label="Breed Name"
                name="breed_name"
                value={editBreed.breed_name}
                onChange={handleEditInputChange}
                sx={{ mb: 2.5, mt: 1 }}
              />
              <TextField
                fullWidth
                select
                variant="outlined"
                label="Species"
                name="animal_species"
                value={editBreed.animal_species || editBreed.species}
                onChange={handleEditInputChange}
                sx={{ mb: 2.5 }}
              >
                {speciesOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                variant="outlined"
                label="Description"
                name="description"
                value={editBreed.description}
                onChange={handleEditInputChange}
                multiline
                rows={4}
                sx={{ mb: 2.5 }}
              />

              <Box sx={{
                mt: 2.5,
                p: 2,
                background: colors.aquaLight,
                borderRadius: '8px',
                border: `1px solid ${colors.aqua}`
              }}>
                <Typography variant="subtitle2" color={colors.aqua} fontWeight="700" mb={1.5}>
                  {maleRoleMap[editBreed.animal_species || editBreed.species]} Details (Optional)
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  label={`${maleRoleMap[editBreed.animal_species || editBreed.species]} Code`}
                  name="bull_code"
                  value={editBreed.bull_code}
                  onChange={handleEditInputChange}
                  size="small"
                  sx={{ mb: 1 }}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  label={`${maleRoleMap[editBreed.animal_species || editBreed.species]} Name`}
                  name="bull_name"
                  value={editBreed.bull_name}
                  onChange={handleEditInputChange}
                  size="small"
                  sx={{ mb: 1 }}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Origin Farm"
                  name="origin_farm"
                  value={editBreed.origin_farm}
                  onChange={handleEditInputChange}
                  size="small"
                  sx={{ mb: 1 }}
                />
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Country"
                  name="country"
                  value={editBreed.country}
                  onChange={handleEditInputChange}
                  size="small"
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ background: colors.white, p: 2 }}>
          <Button onClick={handleCloseEditDialog} type="button" sx={{ color: colors.black }}>
            Cancel
          </Button>
          <Button
            onClick={handleUpdateBreed}
            variant="contained"
            disabled={submitting}
            type="button"
            sx={{
              background: colors.aqua,
              color: colors.white,
              '&:hover': { background: colors.aquaDark },
            }}
          >
            {submitting ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ===== DELETE CONFIRMATION DIALOG ===== */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog} maxWidth="xs" fullWidth>
        <DialogTitle sx={{
          background: colors.red,
          color: colors.white,
          fontWeight: 700,
          fontSize: '1.1rem'
        }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent sx={{ background: colors.white, mt: 2 }}>
          <Typography color={colors.black}>
            Are you sure you want to delete "<strong>{deleteBreed?.breed_name}</strong>"?
            <br />
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ background: colors.white, p: 2 }}>
          <Button onClick={handleCloseDeleteDialog} type="button" sx={{ color: colors.black }}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteBreed}
            variant="contained"
            disabled={submitting}
            type="button"
            sx={{
              background: colors.red,
              color: colors.white,
              '&:hover': { background: colors.red, opacity: 0.9 }
            }}
          >
            {submitting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BreedManagement;