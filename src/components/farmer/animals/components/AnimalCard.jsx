// animals/components/AnimalCard.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  IconButton,
  Avatar,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Stack,
} from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import CakeIcon from '@mui/icons-material/Cake';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import BarChartIcon from '@mui/icons-material/BarChart';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PregnantWomanIcon from '@mui/icons-material/PregnantWoman';
import CloseIcon from '@mui/icons-material/Close';
import EventIcon from '@mui/icons-material/Event';

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

const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num || 0);
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const getSpeciesIcon = (species) => {
  return <PetsIcon fontSize="large" />;
};

const AnimalCard = ({ animal, onEdit, onDelete, onViewDetails }) => {
  const [detailsOpen, setDetailsOpen] = useState(false);

  const getSpeciesColor = (species) => {
    const colors = {
      cow: '#00bcd4',
      goat: '#10b981',
      sheep: '#8b5cf6',
      pig: '#f59e0b',
    };
    return colors[species?.toLowerCase()] || '#6b7280';
  };

  const speciesColor = getSpeciesColor(animal.species);
  const age = calculateAge(animal.birth_date);
  const lifetimeYield = animal.lifetime_milk || 0;
  const offspring = animal.offspring || [];
  const isFemale = animal.gender === 'female';

  return (
    <>
      <Grid item xs={6} sm={6} md={4} lg={3}>
        <Card 
          sx={{ 
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: `2px solid ${speciesColor}40`,
            transition: 'all 0.3s ease',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            cursor: 'pointer',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: `0 12px 24px ${speciesColor}30`,
              border: `2px solid ${speciesColor}`,
            }
          }}
          onClick={() => setDetailsOpen(true)}
        >
          <CardContent sx={{ p: 3, flexGrow: 1 }}>
            {/* Header */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
              p: 1.5,
              borderRadius: '12px',
              backgroundColor: `${speciesColor}15`,
              border: `1px solid ${speciesColor}40`,
            }}>
              <Chip
                label={(animal.species || 'Unknown').toUpperCase()}
                size="small"
                sx={{ 
                  bgcolor: speciesColor, 
                  color: '#ffffff', 
                  fontWeight: 800,
                  fontSize: '0.7rem',
                }}
              />
              <Box display="flex" alignItems="center" gap={1}>
                <CakeIcon sx={{ color: speciesColor, fontSize: 18 }} />
                <Typography variant="caption" color="#000000" fontWeight={600}>
                  {age}
                </Typography>
              </Box>
            </Box>

            {/* Stage Badge */}
            {animal.stage && (
              <Box mb={2}>
                <Chip
                  label={animal.stage.replace(/_/g, ' ').toUpperCase()}
                  size="small"
                  sx={{
                    bgcolor: `${speciesColor}20`,
                    color: '#000000',
                    fontWeight: 700,
                    fontSize: '0.65rem',
                    border: `1.5px solid ${speciesColor}`,
                  }}
                />
              </Box>
            )}

            {/* Photo */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              {animal.photos?.[0] ? (
                <CardMedia
                  component="img"
                  image={animal.photos[0]}
                  alt={animal.cow_name}
                  sx={{ 
                    width: '100%', 
                    height: 180, 
                    objectFit: 'cover', 
                    borderRadius: '12px',
                    border: `2px solid ${speciesColor}30`,
                  }}
                />
              ) : (
                <Avatar sx={{ 
                  width: 100, 
                  height: 100, 
                  bgcolor: `${speciesColor}20`, 
                  color: speciesColor,
                  border: `2px solid ${speciesColor}40`,
                }}>
                  {getSpeciesIcon(animal.species)}
                </Avatar>
              )}
            </Box>

            {/* Name */}
            <Box textAlign="center" mb={2}>
              <Typography variant="h6" fontWeight="900" color="#000000">
                {animal.cow_name}
              </Typography>
              <Typography variant="body2" color="#666666" fontWeight={500}>
                {animal.breed || 'Unknown breed'}
              </Typography>
            </Box>

            {/* Quick Stats */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-around',
              p: 1.5,
              borderRadius: '10px',
              backgroundColor: '#f8f9fa',
              border: '1px solid #e0e0e0',
            }}>
              <Box display="flex" alignItems="center" gap={1}>
                {animal.gender === 'male' ? 
                  <MaleIcon sx={{ color: '#3b82f6', fontSize: 22 }} /> : 
                  <FemaleIcon sx={{ color: '#ef4444', fontSize: 22 }} />
                }
                <Typography variant="body2" color="#000000" fontWeight={600}>
                  {animal.gender || 'N/A'}
                </Typography>
              </Box>
              
              <Box sx={{ width: '2px', height: '25px', bgcolor: '#e0e0e0' }} />
              
              <Box display="flex" alignItems="center" gap={1}>
                {animal.species === 'cow' && isFemale ? (
                  <>
                    <LocalDrinkIcon sx={{ color: speciesColor, fontSize: 22 }} />
                    <Typography variant="body2" color="#000000" fontWeight={700}>
                      {formatNumber(lifetimeYield)}L
                    </Typography>
                  </>
                ) : (
                  <>
                    <FamilyRestroomIcon sx={{ color: speciesColor, fontSize: 22 }} />
                    <Typography variant="body2" color="#000000" fontWeight={700}>
                      {offspring.length || 0}
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
          </CardContent>

          {/* Action Buttons */}
          <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1, flexWrap: 'wrap' }} onClick={(e) => e.stopPropagation()}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<EditIcon />}
              onClick={(e) => { e.stopPropagation(); onEdit(animal); }}
              sx={{
                color: '#00bcd4',
                borderColor: '#00bcd4',
                borderWidth: 2,
                borderRadius: '8px',
                fontWeight: 700,
                '&:hover': { 
                  borderColor: '#00bcd4',
                  backgroundColor: '#00bcd410',
                  borderWidth: 2,
                },
              }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={(e) => { e.stopPropagation(); onDelete(animal.id); }}
              sx={{
                color: '#ef4444',
                borderColor: '#ef4444',
                borderWidth: 2,
                borderRadius: '8px',
                fontWeight: 700,
                '&:hover': { 
                  borderColor: '#ef4444',
                  backgroundColor: '#ef444410',
                  borderWidth: 2,
                },
              }}
            >
              Delete
            </Button>
            {animal.species === 'cow' && isFemale && onViewDetails && (
              <Button
                variant="contained"
                size="small"
                startIcon={<BarChartIcon />}
                onClick={(e) => { e.stopPropagation(); onViewDetails(animal.id); }}
                sx={{
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  fontWeight: 700,
                  borderRadius: '8px',
                  '&:hover': { 
                    backgroundColor: '#059669',
                  },
                }}
              >
                Dairy
              </Button>
            )}
          </Box>
        </Card>
      </Grid>

      {/* Detailed Information Modal */}
      <Dialog 
        open={detailsOpen} 
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            backgroundColor: '#ffffff',
          }
        }}
      >
        <DialogTitle sx={{ 
          background: `linear-gradient(135deg, ${speciesColor} 0%, ${speciesColor}dd 100%)`,
          color: '#ffffff',
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: '#ffffff20', width: 56, height: 56 }}>
              {getSpeciesIcon(animal.species)}
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="900">
                {animal.cow_name}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {animal.species.toUpperCase()} • {animal.stage?.replace(/_/g, ' ').toUpperCase()}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={() => setDetailsOpen(false)} sx={{ color: '#ffffff' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 4, backgroundColor: '#ffffff' }}>
          <Grid container spacing={3}>
            {/* Photos Gallery */}
            {animal.photos && animal.photos.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="h6" color="#000000" fontWeight={700} mb={2}>
                  Photos
                </Typography>
                <Box display="flex" gap={2} flexWrap="wrap">
                  {animal.photos.map((photo, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        width: 150,
                        height: 150,
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: `2px solid ${speciesColor}40`,
                      }}
                    >
                      <img
                        src={photo}
                        alt={`${animal.cow_name} ${idx + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Box>
                  ))}
                </Box>
                <Divider sx={{ mt: 3, mb: 2 }} />
              </Grid>
            )}

            {/* Basic Information */}
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: '12px', border: '1px solid #e0e0e0' }}>
                <Typography variant="h6" color="#000000" fontWeight={700} mb={2}>
                  Basic Information
                </Typography>
                <Stack spacing={1.5}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography color="#666666" fontWeight={600}>Species:</Typography>
                    <Typography color="#000000" fontWeight={700}>{animal.species.toUpperCase()}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography color="#666666" fontWeight={600}>Stage:</Typography>
                    <Typography color="#000000" fontWeight={700}>
                      {animal.stage?.replace(/_/g, ' ').toUpperCase() || 'N/A'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography color="#666666" fontWeight={600}>Gender:</Typography>
                    <Typography color="#000000" fontWeight={700}>
                      {animal.gender?.toUpperCase() || 'N/A'}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography color="#666666" fontWeight={600}>Breed:</Typography>
                    <Typography color="#000000" fontWeight={700}>{animal.breed || 'Unknown'}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography color="#666666" fontWeight={600}>Birth Date:</Typography>
                    <Typography color="#000000" fontWeight={700}>{formatDate(animal.birth_date)}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography color="#666666" fontWeight={600}>Age:</Typography>
                    <Typography color="#000000" fontWeight={700}>{age}</Typography>
                  </Box>
                </Stack>
              </Box>
            </Grid>

            {/* Parentage Information */}
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: '12px', border: '1px solid #e0e0e0' }}>
                <Typography variant="h6" color="#000000" fontWeight={700} mb={2}>
                  Parentage
                </Typography>
                {animal.sire ? (
                  <Box>
                    <Typography color="#666666" fontWeight={600} fontSize="0.85rem">
                      Sire:
                    </Typography>
                    <Typography color="#000000" fontWeight={700}>
                      {animal.sire.name || 'Unknown'}
                      {animal.sire.code && ` (${animal.sire.code})`}
                    </Typography>
                    <Typography variant="caption" color="#666666">
                      {animal.sire.type === 'internal' ? 'Internal record' : 'External bull'}
                    </Typography>
                  </Box>
                ) : (
                  <Typography color="#666666" fontStyle="italic">
                    No sire information recorded
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Pregnancy Status */}
            {animal.pregnancy?.is_pregnant && (
              <Grid item xs={12}>
                <Box sx={{ 
                  p: 2, 
                  backgroundColor: '#fef3c7', 
                  borderRadius: '12px', 
                  border: '2px solid #f59e0b'
                }}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <PregnantWomanIcon sx={{ color: '#f59e0b', fontSize: 28 }} />
                    <Typography variant="h6" color="#000000" fontWeight={700}>
                      Pregnancy Status
                    </Typography>
                  </Box>
                  <Stack spacing={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <EventIcon sx={{ color: '#f59e0b', fontSize: 20 }} />
                      <Typography color="#000000" fontWeight={600}>
                        Expected Due Date:
                      </Typography>
                      <Typography color="#000000" fontWeight={700}>
                        {formatDate(animal.pregnancy.expected_due_date)}
                      </Typography>
                    </Box>
                    <Typography color="#d97706" fontWeight={600} fontSize="0.9rem">
                      Currently pregnant and expecting offspring
                    </Typography>
                  </Stack>
                </Box>
              </Grid>
            )}

            {/* Milk Production (for female cows only) */}
            {animal.species === 'cow' && isFemale && (
              <Grid item xs={12}>
                <Box sx={{ p: 2, backgroundColor: '#dbeafe', borderRadius: '12px', border: '2px solid #3b82f6' }}>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <LocalDrinkIcon sx={{ color: '#3b82f6', fontSize: 28 }} />
                    <Typography variant="h6" color="#000000" fontWeight={700}>
                      Milk Production
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography color="#666666" fontWeight={600} fontSize="0.85rem">Lifetime Yield:</Typography>
                      <Typography variant="h4" color="#000000" fontWeight={900}>
                        {formatNumber(lifetimeYield)} L
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography color="#666666" fontWeight={600} fontSize="0.85rem">Daily Average:</Typography>
                      <Typography variant="h4" color="#000000" fontWeight={900}>
                        {formatNumber(animal.daily_average || 0)} L
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            )}

            {/* Offspring */}
            {offspring.length > 0 && (
              <Grid item xs={12}>
                <Box sx={{ p: 2, backgroundColor: '#dcfce7', borderRadius: '12px', border: '2px solid #10b981' }}>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <FamilyRestroomIcon sx={{ color: '#10b981', fontSize: 28 }} />
                    <Typography variant="h6" color="#000000" fontWeight={700}>
                      Offspring ({offspring.length})
                    </Typography>
                  </Box>
                  <Stack spacing={2}>
                    {offspring.map((off) => (
                      <Box 
                        key={off.id}
                        sx={{
                          p: 1.5,
                          backgroundColor: '#ffffff',
                          borderRadius: '8px',
                          border: '1px solid #10b98140',
                        }}
                      >
                        <Typography color="#000000" fontWeight={700}>
                          {off.name}
                        </Typography>
                        <Typography variant="caption" color="#666666">
                          {off.species.toUpperCase()} • Born: {formatDate(off.birth_date)} • Age: {calculateAge(off.birth_date)}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, backgroundColor: '#ffffff' }}>
          <Button 
            onClick={() => setDetailsOpen(false)}
            sx={{ color: '#666666', fontWeight: 600 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default React.memo(AnimalCard);