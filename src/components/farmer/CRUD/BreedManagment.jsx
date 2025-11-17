import React, { useState, useEffect, useContext, useCallback } from 'react';
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
import { useTheme } from '@mui/material';
// Assuming the path to your theme/tokens is correct
import { tokens } from '../../../theme';
import axios from 'axios';
// Assuming the path to your AuthContext is correct
import { AuthContext } from '../../PrivateComponents/AuthContext';
// Assuming the path to your Header component is correct
import Header from '../../scenes/Header';

// MUI Icons
import AddIcon from '@mui/icons-material/Add';
import GrassIcon from '@mui/icons-material/Grass';
import PetsIcon from '@mui/icons-material/Pets';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PublicIcon from '@mui/icons-material/Public';
import BusinessIcon from '@mui/icons-material/Business';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import CloseIcon from '@mui/icons-material/Close';


// --- BREED MANAGEMENT COMPONENT ---
const BreedManagement = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { token } = useContext(AuthContext);

  // State for data and CRUD operations
  const [breeds, setBreeds] = useState([]);
  const [newBreed, setNewBreed] = useState({
    breed_name: '',
    species: 'cow',
    description: '',
    bull_code: '',
    bull_name: '',
    origin_farm: '',
    country: '',
  });
  const [editBreed, setEditBreed] = useState(null);
  const [deleteBreed, setDeleteBreed] = useState(null);

  // State for UI/UX
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);


   const Base_API = process.env.REACT_APP_API_BASE


  // --- Constants and Utility Functions ---

  const speciesOptions = [
    { value: 'cow', label: 'Cow', color: colors.greenAccent[400] },
    { value: 'bull', label: 'Bull', color: colors.blueAccent[400] },
    { value: 'goat', label: 'Goat', color: colors.grey[400] },
    { value: 'pig', label: 'Pig', color: colors.redAccent[400] },
  ];

  const getSpeciesIcon = (species) => {
    switch (species) {
      case 'bull':
        return <GrassIcon />;
      case 'cow':
        return <PetsIcon />;
      case 'goat':
        return <PetsIcon />;
      case 'pig':
        return <PetsIcon />;
      default:
        return <GrassIcon />;
    }
  };

  const getSpeciesColor = (species) => {
    if (!species) return colors.grey[400];
    const option = speciesOptions.find(opt => opt.value === species);
    return option ? option.color : colors.grey[400];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    try {
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      return 'Invalid Date';
    }
  };

  // --- Snackbar Handlers ---

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  // --- API Call & Data Fetching (Fallback) ---

  const fetchBreeds = useCallback(async () => {
    if (!token) {
      showSnackbar('Authentication token not found. Please log in.', 'error');
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(`${Base_API}/breed`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Ensure we use the API's response data structure
      setBreeds(response.data.breeds || []);
    } catch (err) {
      console.error('Failed to fetch breeds:', err.response?.data || err.message);
      showSnackbar('Failed to fetch breeds. Displaying stale data or placeholders.', 'error');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchBreeds();
  }, [fetchBreeds]);

  // --- Input Change Handlers ---

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBreed({ ...newBreed, [name]: value });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditBreed({ ...editBreed, [name]: value });
  };

  // --- CRUD Operations ---

  const handleCreateBreed = async (e) => {
    // REQUIREMENT: No full-page reloads -> e.preventDefault()
    e.preventDefault();
    if (!token) {
      showSnackbar('Authentication token not found. Please log in.', 'error');
      return;
    }
    setSubmitting(true);

    const payload = {
      breed_name: newBreed.breed_name,
      species: newBreed.species,
      description: newBreed.description,
    };

    // Add optional bull-specific fields
    if (newBreed.species === 'bull') {
      // Only include if they have a value (backend handles required/optional logic)
      if (newBreed.bull_code) payload.bull_code = newBreed.bull_code;
      if (newBreed.bull_name) payload.bull_name = newBreed.bull_name;
      if (newBreed.origin_farm) payload.origin_farm = newBreed.origin_farm;
      if (newBreed.country) payload.country = newBreed.country;
    }

    try {
      const response = await axios.post(`${Base_API}/breed`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // REQUIREMENT: After creating -> append new breed to breeds state.
      const newCreatedBreed = response.data.breed || { ...payload, _id: Date.now().toString(), created_at: new Date().toISOString() };
      setBreeds(prevBreeds => [newCreatedBreed, ...prevBreeds]);

      showSnackbar(response.data.message || 'Breed registered successfully!', 'success');

      // Reset form state
      setNewBreed({
        breed_name: '',
        species: 'cow',
        description: '',
        bull_code: '',
        bull_name: '',
        origin_farm: '',
        country: '',
      });

    } catch (err) {
      console.error('Failed to create breed:', err.response?.data || err.message);
      showSnackbar(err.response?.data?.message || 'Failed to create breed.', 'error');
    } finally {
      setSubmitting(false);
      // Fallback/refresh after successful local state update (optional but good practice)
      // We are relying on the instant local update, so this fetch can be commented out 
      // or kept as a slower, final consistency check. Keeping it commented for instant UI.
      // fetchBreeds(); 
    }
  };

  const handleUpdateBreed = async () => {
    if (!token || !editBreed) return;
    setSubmitting(true);

    const payload = {
      breed_name: editBreed.breed_name,
      species: editBreed.species,
      description: editBreed.description,
    };

    if (editBreed.species === 'bull') {
      if (editBreed.bull_code) payload.bull_code = editBreed.bull_code;
      if (editBreed.bull_name) payload.bull_name = editBreed.bull_name;
      if (editBreed.origin_farm) payload.origin_farm = editBreed.origin_farm;
      if (editBreed.country) payload.country = editBreed.country;
    }
    // We get all fields from the edit state to use for the update
    const updatedBreedData = { ...editBreed, ...payload };

    try {
      const response = await axios.put(
        `${Base_API}/breed/${editBreed._id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // REQUIREMENT: After updating -> replace that one breed in the list.
      setBreeds(prevBreeds => prevBreeds.map(b =>
        b._id === editBreed._id ? updatedBreedData : b
      ));

      showSnackbar(response.data.message || 'Breed updated successfully!', 'success');
      handleCloseEditDialog();

    } catch (err) {
      console.error('Failed to update breed:', err.response?.data || err.message);
      showSnackbar(err.response?.data?.message || 'Failed to update breed.', 'error');
    } finally {
      setSubmitting(false);
      // Fallback/refresh after successful local state update
      // fetchBreeds();
    }
  };

  const handleDeleteBreed = async () => {
    if (!token || !deleteBreed) return;
    setSubmitting(true);

    try {
      const response = await axios.delete(
        `${Base_API}/breed/${deleteBreed._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // REQUIREMENT: After deleting -> filter it out from the list.
      setBreeds(prevBreeds => prevBreeds.filter(b => b._id !== deleteBreed._id));

      showSnackbar(response.data.message || 'Breed deleted successfully!', 'success');
      handleCloseDeleteDialog();

    } catch (err) {
      console.error('Failed to delete breed:', err.response?.data || err.message);
      showSnackbar(err.response?.data?.message || 'Failed to delete breed.', 'error');
    } finally {
      setSubmitting(false);
      // Fallback/refresh after successful local state update
      // fetchBreeds();
    }
  };

  // --- Dialog Handlers (Using type="button" for all dialog actions) ---

  const handleOpenEditDialog = (breed) => {
    // Ensure all optional fields are initialized to avoid uncontrolled component warnings
    setEditBreed({
      _id: breed._id,
      breed_name: breed.breed_name,
      species: breed.species,
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

  // --- UI/UX Components ---

  const SkeletonCard = () => (
    <Card sx={{
      background: colors.primary[500],
      border: `1px solid ${colors.primary[300]}`,
      borderRadius: '12px',
      height: '200px', // Fixed height for consistency
    }}>
      <CardContent sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box flex={1}>
            <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" width="80px" height={24} sx={{ borderRadius: '12px', mb: 1 }} />
            <Skeleton variant="text" width="100%" height={20} />
            <Skeleton variant="text" width="90%" height={20} />
            <Skeleton variant="text" width="40%" height={16} sx={{ mt: 1 }} />
          </Box>
        </Box>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0, justifyContent: 'flex-end' }}>
        <Skeleton variant="circular" width={36} height={36} sx={{ mr: 1 }} />
        <Skeleton variant="circular" width={36} height={36} />
      </CardActions>
    </Card>
  );

  const EmptyStateCard = () => (
    <Card sx={{
      background: colors.primary[500],
      border: `1px solid ${colors.primary[300]}`,
      borderRadius: '16px',
      textAlign: 'center',
      p: 4,
      mt: 2,
    }}>
      <GrassIcon sx={{ fontSize: 60, color: colors.greenAccent[400], mb: 2 }} />
      <Typography variant="h5" color={colors.grey[100]} gutterBottom>
        No Breeds Registered Yet
      </Typography>
      <Typography variant="body1" color={colors.grey[400]}>
        Start by using the "Register New Breed" form to the left.
      </Typography>
    </Card>
  );

  const BullDetailsSubCard = ({ breed }) => (
    <Box sx={{ mt: 2, p: 1.5, background: colors.blueAccent[900], borderRadius: '8px' }}>
      <Typography
        variant="caption"
        color={colors.blueAccent[300]}
        fontWeight="600"
        display="block"
        mb={0.5}
      >
        Bull Details:
      </Typography>

      <Typography variant="caption" color={colors.grey[300]} display="block">
        <FingerprintIcon sx={{ fontSize: 12, mr: 0.5, verticalAlign: 'middle' }} />
        Code: {breed.bull_code || 'Not provided'}
      </Typography>

      <Typography variant="caption" color={colors.grey[300]} display="block">
        Name: {breed.bull_name || 'Not provided'}
      </Typography>

      <Typography variant="caption" color={colors.grey[300]} display="block">
        <BusinessIcon sx={{ fontSize: 12, mr: 0.5, verticalAlign: 'middle' }} />
        Farm: {breed.origin_farm || 'Not provided'}
      </Typography>

      <Typography variant="caption" color={colors.grey[300]} display="block">
        <PublicIcon sx={{ fontSize: 12, mr: 0.5, verticalAlign: 'middle' }} />
        Country: {breed.country || 'Not provided'}
      </Typography>
    </Box>
  );


  // --- Main Render ---
  return (
    <Box m="20px">
      <Header
        title="BREED MANAGEMENT"
        subtitle="Register and manage breeds for your livestock records"
      />

      {/* REQUIREMENT: Error and success messages → Use Snackbar + Alert */}
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
          sx={{ width: '100%' }}
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

      <Grid container spacing={4} mt={2}>

        {/* Create Breed Form */}
        <Grid item xs={12} md={5}>
          <Fade in timeout={800}>
            <Card sx={{ background: colors.primary[400], border: `1px solid ${colors.primary[300]}`, borderRadius: '16px', p: 2 }}>
              <CardContent>
                <Typography variant="h5" fontWeight="600" color={colors.grey[100]} mb={2}>
                  Register New Breed
                </Typography>
                {/* REQUIREMENT: Only the "Add Breed" form should use type="submit" */}
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
                    select
                    variant="filled"
                    label="Species"
                    name="species"
                    value={newBreed.species}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
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
                    variant="filled"
                    label="Description"
                    name="description"
                    value={newBreed.description}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                    required
                    multiline
                    rows={4}
                    placeholder="Describe the breed characteristics, production traits, etc."
                  />

                  {newBreed.species === 'bull' && (
                    <Box sx={{ mt: 2, p: 2, background: colors.blueAccent[900], borderRadius: '8px' }}>
                      <Typography variant="subtitle2" color={colors.blueAccent[300]} mb={1} fontWeight="600">
                        Bull-Specific Information (Optional)
                      </Typography>
                      {/* Bull-Specific Fields */}
                      <TextField
                        fullWidth
                        variant="filled"
                        label="Bull Code"
                        name="bull_code"
                        value={newBreed.bull_code}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                        placeholder="e.g., STD-2024-001"
                        InputProps={{
                          startAdornment: <FingerprintIcon sx={{ mr: 1, color: colors.grey[400] }} />
                        }}
                      />
                      <TextField
                        fullWidth
                        variant="filled"
                        label="Bull Name"
                        name="bull_name"
                        value={newBreed.bull_name}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                        placeholder="Traceable name"
                      />
                      <TextField
                        fullWidth
                        variant="filled"
                        label="Origin Farm"
                        name="origin_farm"
                        value={newBreed.origin_farm}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                        placeholder="Farm or facility name"
                        InputProps={{
                          startAdornment: <BusinessIcon sx={{ mr: 1, color: colors.grey[400] }} />
                        }}
                      />
                      <TextField
                        fullWidth
                        variant="filled"
                        label="Country"
                        name="country"
                        value={newBreed.country}
                        onChange={handleInputChange}
                        placeholder="Country of origin"
                        InputProps={{
                          startAdornment: <PublicIcon sx={{ mr: 1, color: colors.grey[400] }} />
                        }}
                      />
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button
                      type="submit" // Correct type
                      variant="contained"
                      sx={{
                        backgroundColor: colors.greenAccent[600],
                        color: colors.grey[100],
                        '&:hover': { backgroundColor: colors.greenAccent[700] },
                        '&:disabled': { backgroundColor: colors.grey[600] },
                      }}
                      disabled={submitting}
                      startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
                    >
                      {submitting ? 'Registering...' : 'Register Breed'}
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
            <Card sx={{
              background: colors.primary[400],
              border: `1px solid ${colors.primary[300]}`,
              borderRadius: '16px',
              p: 2,
              maxHeight: '700px',
              overflowY: 'auto'
            }}>
              <CardContent>
                <Typography variant="h5" fontWeight="600" color={colors.grey[100]} mb={2}>
                  Your Registered Breeds ({breeds.length})
                </Typography>

                {/* REQUIREMENT: UI/UX skeletons / empty state card */}
                {loading ? (
                  <Grid container spacing={2}>
                    {[1, 2, 3].map((i) => (
                      <Grid item xs={12} key={i}>
                        <SkeletonCard />
                      </Grid>
                    ))}
                  </Grid>
                ) : breeds.length === 0 ? (
                  <EmptyStateCard />
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
                                <Typography variant="h6" fontWeight="bold" color={getSpeciesColor(breed.species || 'cow')} mb={1}>
                                  {getSpeciesIcon(breed.species || 'cow')}
                                  <Box component="span" sx={{ ml: 1, verticalAlign: 'middle' }}>
                                    {breed.breed_name}
                                  </Box>
                                </Typography>
                                <Chip
                                  label={breed.species ? breed.species.charAt(0).toUpperCase() + breed.species.slice(1) : 'Unknown'}
                                  size="small"
                                  sx={{
                                    backgroundColor: getSpeciesColor(breed.species),
                                    color: colors.grey[100],
                                    fontWeight: 'bold',
                                    mb: 1,
                                  }}
                                />
                                <Typography variant="body2" color={colors.grey[300]} sx={{ mb: 1 }}>
                                  {breed.description}
                                </Typography>

                                {/* REQUIREMENT: Bull details must display */}
                                {breed.species === 'bull' && <BullDetailsSubCard breed={breed} />}

                                <Typography variant="caption" color={colors.grey[400]} display="block" mt={1}>
                                  Created: {formatDate(breed.created_at || breed.createdAt)}
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                          <CardActions sx={{ p: 2, pt: 0, justifyContent: 'flex-end' }}>
                            {/* REQUIREMENT: Update/Delete buttons must use type="button" */}
                            <IconButton
                              size="small"
                              onClick={() => handleOpenEditDialog(breed)}
                              type="button" // Correct type
                              sx={{
                                color: colors.blueAccent[400],
                                '&:hover': { backgroundColor: colors.blueAccent[800] }
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDeleteDialog(breed)}
                              type="button" // Correct type
                              sx={{
                                color: colors.redAccent[400],
                                '&:hover': { backgroundColor: colors.redAccent[800] }
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </CardActions>
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

      {/* Edit Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ background: colors.primary[400], color: colors.grey[100] }}>
          Edit Breed: {editBreed?.breed_name}
        </DialogTitle>
        <DialogContent sx={{ background: colors.primary[400], mt: 2 }}>
          {editBreed && (
            <Box>
              {/* Form fields for editing */}
              <TextField
                fullWidth
                variant="filled"
                label="Breed Name"
                name="breed_name"
                value={editBreed.breed_name}
                onChange={handleEditInputChange}
                sx={{ mb: 2 }}
                required
              />
              {/* Species select is intentionally read-only/fixed in edit to avoid complex data migration logic in a simple dialog, 
                  but we allow field population based on current species. */}
              <TextField
                fullWidth
                select
                variant="filled"
                label="Species"
                name="species"
                value={editBreed.species}
                onChange={handleEditInputChange}
                sx={{ mb: 2 }}
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
                variant="filled"
                label="Description"
                name="description"
                value={editBreed.description}
                onChange={handleEditInputChange}
                sx={{ mb: 2 }}
                multiline
                rows={4}
              />

              {/* Bull-Specific Fields for Edit Dialog */}
              {editBreed.species === 'bull' && (
                <Box sx={{ mt: 2, p: 2, background: colors.blueAccent[900], borderRadius: '8px' }}>
                  <Typography variant="subtitle2" color={colors.blueAccent[300]} mb={1} fontWeight="600">
                    Bull-Specific Information (Optional)
                  </Typography>
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Bull Code"
                    name="bull_code"
                    value={editBreed.bull_code}
                    onChange={handleEditInputChange}
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: <FingerprintIcon sx={{ mr: 1, color: colors.grey[400] }} />
                    }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Bull Name"
                    name="bull_name"
                    value={editBreed.bull_name}
                    onChange={handleEditInputChange}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Origin Farm"
                    name="origin_farm"
                    value={editBreed.origin_farm}
                    onChange={handleEditInputChange}
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: <BusinessIcon sx={{ mr: 1, color: colors.grey[400] }} />
                    }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    label="Country"
                    name="country"
                    value={editBreed.country}
                    onChange={handleEditInputChange}
                    InputProps={{
                      startAdornment: <PublicIcon sx={{ mr: 1, color: colors.grey[400] }} />
                    }}
                  />
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ background: colors.primary[400], p: 2 }}>
          {/* REQUIREMENT: Update button must use type="button" */}
          <Button onClick={handleCloseEditDialog} type="button" sx={{ color: colors.grey[300] }}>
            Cancel
          </Button>
          <Button
            onClick={handleUpdateBreed}
            variant="contained"
            disabled={submitting}
            type="button" // Correct type
            sx={{
              backgroundColor: colors.greenAccent[600],
              color: colors.grey[100],
              '&:hover': { backgroundColor: colors.greenAccent[700] },
            }}
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ background: colors.primary[400], color: colors.grey[100] }}>
          Confirm Deletion
        </DialogTitle>
        <DialogContent sx={{ background: colors.primary[400], mt: 2 }}>
          <Typography color={colors.grey[300]}>
            Are you sure you want to delete the breed "<Box component="span" fontWeight="bold">{deleteBreed?.breed_name}</Box>"? This action will soft-delete the breed.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ background: colors.primary[400], p: 2 }}>
          {/* REQUIREMENT: Delete button must use type="button" */}
          <Button onClick={handleCloseDeleteDialog} type="button" sx={{ color: colors.grey[300] }}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteBreed}
            variant="contained"
            disabled={submitting}
            type="button" // Correct type
            sx={{
              backgroundColor: colors.redAccent[600],
              color: colors.grey[100],
              '&:hover': { backgroundColor: colors.redAccent[700] },
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