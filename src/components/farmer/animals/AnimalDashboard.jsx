// animals/AnimalDashboard.jsx 
import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Alert,
  Snackbar,
  Grid,
  Skeleton,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../../scenes/Header';
import PetsIcon from '@mui/icons-material/Pets';
import AddIcon from '@mui/icons-material/Add';

import useAnimals from './hooks/useAnimals';
import AnimalStatsCards from './components/AnimalStatsCards';
import AnimalFilters from './components/AnimalFilters';
import AnimalCard from './components/AnimalCard';
import AnimalFormDialog from './components/AnimalFormDialog';

const AnimalDashboard = () => {
  const navigate = useNavigate();

  const {
    animals,
    loading,
    refreshing,
    error,
    success,
    fetchAnimals,
    addAnimal,
    updateAnimal,
    deleteAnimal,
    clearMessages,
  } = useAnimals();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [selectedSpecies, setSelectedSpecies] = useState('all');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  const speciesLabel = {
    cow: 'Cows & Bulls',
    goat: 'Goats',
    sheep: 'Sheep',
    pig: 'Pigs',
  };

  const getSpeciesColor = (species) => {
    const colors = {
      cow: '#00bcd4',
      goat: '#10b981',
      sheep: '#8b5cf6',
      pig: '#f59e0b',
    };
    return colors[species?.toLowerCase()] || '#6b7280';
  };

  const processedAnimals = useMemo(() => {
    let filtered = animals.filter((animal) => {
      const animalName = animal.cow_name || '';
      const animalBreed = animal.breed || '';
      
      const matchesSearch = 
        animalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animalBreed.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSpecies = selectedSpecies === 'all' || animal.species === selectedSpecies;
      
      const matchesFilter = 
        filterBy === 'all' || 
        (filterBy === 'male' && animal.gender === 'male') ||
        (filterBy === 'female' && animal.gender === 'female') ||
        (filterBy === 'cows' && animal.species === 'cow' && animal.gender === 'female') ||
        (filterBy === 'bulls' && animal.species === 'cow' && animal.gender === 'male') ||
        (filterBy === 'has_offspring' && (animal.offspring?.length > 0)) ||
        (filterBy === 'high_yield' && animal.species === 'cow' && animal.gender === 'female' && (animal.lifetime_milk || 0) > 1000);
      
      return matchesSearch && matchesSpecies && matchesFilter;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.cow_name || '').localeCompare(b.cow_name || '');
        case 'age':
          return new Date(a.birth_date || 0) - new Date(b.birth_date || 0);
        case 'yield':
          const aYield = a.lifetime_milk || 0;
          const bYield = b.lifetime_milk || 0;
          return bYield - aYield;
        case 'offspring':
          const aOffspring = a.offspring?.length || 0;
          const bOffspring = b.offspring?.length || 0;
          return bOffspring - aOffspring;
        default:
          return 0;
      }
    });

    return filtered;
  }, [animals, searchTerm, selectedSpecies, filterBy, sortBy]);

  const handleRefresh = useCallback(() => {
    fetchAnimals(true);
  }, [fetchAnimals]);

  const handleOpenAddDialog = useCallback(() => {
    setSelectedAnimal(null);
    setAddDialogOpen(true);
  }, []);

  const handleCloseAddDialog = useCallback(() => {
    setAddDialogOpen(false);
  }, []);

  const handleOpenUpdateDialog = useCallback((animal) => {
    setSelectedAnimal(animal);
    setUpdateDialogOpen(true);
  }, []);

  const handleCloseUpdateDialog = useCallback(() => {
    setUpdateDialogOpen(false);
    setSelectedAnimal(null);
  }, []);

  const handleAddAnimal = useCallback(async (formData) => {
    const success = await addAnimal(formData);
    if (success) {
      handleCloseAddDialog();
    }
  }, [addAnimal, handleCloseAddDialog]);

  const handleUpdateAnimal = useCallback(async (formData) => {
    const success = await updateAnimal(selectedAnimal.id, formData);
    if (success) {
      handleCloseUpdateDialog();
    }
  }, [updateAnimal, selectedAnimal, handleCloseUpdateDialog]);

  const handleDeleteAnimal = useCallback(async (id) => {
    await deleteAnimal(id);
  }, [deleteAnimal]);

  const handleViewDetails = useCallback((animalId) => {
    navigate('/fmr.drb/dairysummaries', { state: { cowId: animalId } });
  }, [navigate]);

  const handleViewInsemination = useCallback(() => {
    navigate('/fmr.drb/insemination-record');
  }, [navigate]);

  const handleAddMilk = useCallback(() => {
    navigate('/fmr.drb/milkrecording');
  }, [navigate]);

  const handleAddcalf = useCallback(() => {
    navigate('/fmr.drb/calf');
  }, [navigate]);

  const handleCloseSnackbar = useCallback(() => {
    clearMessages();
  }, [clearMessages]);

  const renderSkeletonCards = () => (
    <Grid container spacing={3}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Grid item xs={12} sm={6} md={4} key={i}>
          <Box sx={{ 
            backgroundColor: '#ffffff', 
            p: 3, 
            borderRadius: '16px',
            border: '2px solid #e0e0e0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Skeleton variant="circular" width={56} height={56} />
              <Box flex={1}>
                <Skeleton variant="text" width="70%" height={35} />
                <Skeleton variant="text" width="50%" height={25} />
              </Box>
            </Box>
            <Skeleton variant="rectangular" height={200} sx={{ mb: 2, borderRadius: '12px' }} />
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="85%" />
          </Box>
        </Grid>
      ))}
    </Grid>
  );

  const groupedAnimals = useMemo(() => {
    const order = ['cow', 'goat', 'sheep', 'pig'];
    return order.map((sp) => ({
      key: sp,
      label: speciesLabel[sp],
      items: processedAnimals.filter(a => (a.species || '').toLowerCase() === sp),
      color: getSpeciesColor(sp),
    })).filter(section => section.items.length > 0);
  }, [processedAnimals]);

  return (
    <Box m="20px" sx={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <Header
        title="ANIMAL DASHBOARD"
        subtitle="Manage all your farm animals across species"
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
          sx={{ 
            width: '100%',
            borderRadius: '12px',
            fontWeight: 600,
          }}
        >
          {success || error}
        </Alert>
      </Snackbar>

      <AnimalStatsCards animals={animals} loading={loading} />

      <AnimalFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterBy={filterBy}
        setFilterBy={setFilterBy}
        sortBy={sortBy}
        setSortBy={setSortBy}
        selectedSpecies={selectedSpecies}
        setSelectedSpecies={setSelectedSpecies}
        onRefresh={handleRefresh}
        onAddAnimal={handleOpenAddDialog}
        onAddCalf={handleAddcalf}
        onViewInsemination={handleViewInsemination}
        onAddMilk={handleAddMilk}
        refreshing={refreshing}
      />

      {loading ? (
        <Box>{renderSkeletonCards()}</Box>
      ) : (
        <>
          {groupedAnimals.length === 0 ? (
            <Box 
              display="flex" 
              flexDirection="column" 
              alignItems="center" 
              justifyContent="center" 
              minHeight="450px"
              sx={{ 
                backgroundColor: '#ffffff',
                borderRadius: '20px', 
                p: 5,
                border: '2px solid #e0e0e0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}
            >
              <Box
                sx={{
                  width: 140,
                  height: 140,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                  boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
                }}
              >
                <PetsIcon sx={{ fontSize: 70, color: '#ffffff' }} />
              </Box>
              <Typography 
                variant="h3" 
                color="#000000" 
                fontWeight="900" 
                mb={2}
                textAlign="center"
              >
                No Animals Found
              </Typography>
              <Typography 
                variant="body1" 
                color="#666666" 
                mb={4}
                textAlign="center"
                maxWidth="500px"
              >
                Try adjusting your filters or add your first animal to get started on your farm management journey
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                onClick={handleOpenAddDialog}
                sx={{ 
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  fontWeight: 700,
                  borderRadius: '12px',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  '&:hover': { 
                    backgroundColor: '#059669',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 16px rgba(16, 185, 129, 0.4)',
                  },
                }}
              >
                Add Your First Animal
              </Button>
            </Box>
          ) : (
            <Box>
              {groupedAnimals.map(({ key, label, items, color }) => (
                <Box key={key} mb={5}>
                  <Box 
                    display="flex" 
                    alignItems="center" 
                    justifyContent="space-between" 
                    mb={3}
                    p={2}
                    sx={{
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      border: `2px solid ${color}40`,
                      boxShadow: `0 2px 8px ${color}20`,
                    }}
                  >
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        color: '#000000', 
                        fontWeight: 900,
                        letterSpacing: '-0.5px',
                      }}
                    >
                      {label}
                    </Typography>
                    <Box
                      sx={{
                        px: 2.5,
                        py: 1,
                        borderRadius: '10px',
                        backgroundColor: color,
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '1.1rem',
                        minWidth: '50px',
                        textAlign: 'center',
                        boxShadow: `0 2px 8px ${color}40`,
                      }}
                    >
                      {items.length}
                    </Box>
                  </Box>
                  <Grid container spacing={3}>
                    {items.map(animal => (
                      <AnimalCard
                        key={animal.id}
                        animal={animal}
                        onEdit={handleOpenUpdateDialog}
                        onDelete={handleDeleteAnimal}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </Grid>
                </Box>
              ))}
            </Box>
          )}
        </>
      )}

      <AnimalFormDialog
        open={addDialogOpen}
        onClose={handleCloseAddDialog}
        onSubmit={handleAddAnimal}
        initialData={null}
        isUpdate={false}
      />

      <AnimalFormDialog
        open={updateDialogOpen}
        onClose={handleCloseUpdateDialog}
        onSubmit={handleUpdateAnimal}
        initialData={selectedAnimal}
        isUpdate={true}
      />
    </Box>
  );
};

export default AnimalDashboard;