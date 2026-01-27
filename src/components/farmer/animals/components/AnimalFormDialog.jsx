import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  IconButton,
  Chip,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';

const STAGE_OPTIONS = {
  cow: ['calf', 'heifer', 'cow', 'bull_calf', 'young_bull', 'mature_bull'],
  goat: ['kid', 'doeling', 'buckling', 'nanny', 'buck'],
  sheep: ['lamb', 'ewe', 'ram'],
  pig: ['piglet', 'gilt', 'sow', 'boar'],
};

const SPECIES_CONFIG = {
  cow: { 
    icon: '🐄', 
    color: '#00bcd4', 
    label: 'Cow',
    showSireInfo: true,
    genderOptions: ['male', 'female']
  },
  goat: { 
    icon: '🐐', 
    color: '#10b981', 
    label: 'Goat',
    showSireInfo: true,
    genderOptions: ['male', 'female']
  },
  sheep: { 
    icon: '🐑', 
    color: '#8b5cf6', 
    label: 'Sheep',
    showSireInfo: true,
    genderOptions: ['male', 'female']
  },
  pig: { 
    icon: '🐷', 
    color: '#f59e0b', 
    label: 'Pig',
    showSireInfo: true,
    genderOptions: ['male', 'female']
  },
};

const AnimalFormDialog = ({ open, onClose, onSubmit, initialData, isUpdate }) => {
  const [formData, setFormData] = useState({
    cow_name: '',
    species: 'cow',
    breed: '',
    gender: 'female',
    birth_date: '',
    stage: 'calf',
    bull_code: '',
    bull_name: '',
    origin_farm: '',
    country: '',
  });

  const [existingPhotos, setExistingPhotos] = useState([]);
  const [newPhotos, setNewPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData && open) {
      const species = initialData.species || 'cow';
      const config = SPECIES_CONFIG[species];
      
      setFormData({
        cow_name: initialData.name || '',
        species: species,
        breed: initialData.breed || '',
        gender: config?.forceGender || initialData.gender || 'female',
        birth_date: initialData.birth_date ? initialData.birth_date.split('T')[0] : '',
        stage: initialData.stage || STAGE_OPTIONS[species]?.[0] || '',
        bull_code: initialData.bull_code || '',
        bull_name: initialData.bull_name || '',
        origin_farm: initialData.origin_farm || '',
        country: initialData.country || '',
      });
      setExistingPhotos(initialData.photos || []);
      setPhotoPreviews(initialData.photos || []);
      setNewPhotos([]);
    } else if (!initialData && open) {
      setFormData({
        cow_name: '',
        species: 'cow',
        breed: '',
        gender: 'female',
        birth_date: '',
        stage: 'calf',
        bull_code: '',
        bull_name: '',
        origin_farm: '',
        country: '',
      });
      setExistingPhotos([]);
      setNewPhotos([]);
      setPhotoPreviews([]);
    }
    setErrors({});
  }, [initialData, open]);

  const handleChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      if (field === 'species' && STAGE_OPTIONS[value]) {
        updated.stage = STAGE_OPTIONS[value][0];
      }
      
      return updated;
    });
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newPhotoFiles = [...newPhotos, ...files];
    setNewPhotos(newPhotoFiles);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveExistingPhoto = (index) => {
    setExistingPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveNewPhoto = (index) => {
    const newPhotoStartIndex = existingPhotos.length;
    const actualIndex = index - newPhotoStartIndex;
    
    setNewPhotos(prev => prev.filter((_, i) => i !== actualIndex));
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.cow_name.trim()) {
      newErrors.cow_name = 'Name is required';
    }
    
    if (!formData.species) {
      newErrors.species = 'Species is required';
    }

    if (!formData.stage) {
      newErrors.stage = 'Stage is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = {
      ...formData,
      photos: existingPhotos,
      newPhotos: newPhotos,
    };

    onSubmit(submitData);
  };

  const currentSpecies = SPECIES_CONFIG[formData.species] || SPECIES_CONFIG.cow;
  const availableStages = STAGE_OPTIONS[formData.species] || [];
  const speciesColor = currentSpecies.color;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
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
          <Typography variant="h5" fontWeight="900">
            {isUpdate ? `Update ${currentSpecies.label}` : `Add New ${currentSpecies.label}`}
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#ffffff' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 4, pb: 2, backgroundColor: '#ffffff' }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            {/* Photo Upload Section */}
            <Grid item xs={12}>
              <Box>
                <Typography variant="h6" color="#000000" mb={2} fontWeight={700}>
                  📸 Photos
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
                  {photoPreviews.map((preview, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: 'relative',
                        width: 120,
                        height: 120,
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: `2px solid ${speciesColor}`,
                      }}
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => {
                          if (index < existingPhotos.length) {
                            handleRemoveExistingPhoto(index);
                          } else {
                            handleRemoveNewPhoto(index);
                          }
                        }}
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          bgcolor: '#ef4444',
                          color: '#ffffff',
                          '&:hover': { bgcolor: '#dc2626' },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                      {index < existingPhotos.length && (
                        <Chip
                          label="Existing"
                          size="small"
                          sx={{
                            position: 'absolute',
                            bottom: 4,
                            left: 4,
                            bgcolor: '#00bcd4',
                            color: '#ffffff',
                            fontSize: '0.6rem',
                            height: '20px',
                          }}
                        />
                      )}
                    </Box>
                  ))}
                </Box>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<PhotoCamera />}
                  sx={{
                    color: speciesColor,
                    borderColor: speciesColor,
                    borderWidth: 2,
                    borderRadius: '10px',
                    fontWeight: 700,
                    backgroundColor: '#ffffff',
                    '&:hover': {
                      borderColor: speciesColor,
                      backgroundColor: `${speciesColor}10`,
                      borderWidth: 2,
                    },
                  }}
                >
                  Upload Photos
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                </Button>
                <FormHelperText sx={{ color: '#666666', mt: 1 }}>
                  Supports multiple images. Upload will be handled on submission.
                </FormHelperText>
              </Box>
            </Grid>

            {/* Basic Info */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Animal Name *"
                value={formData.cow_name}
                onChange={(e) => handleChange('cow_name', e.target.value)}
                variant="outlined"
                error={!!errors.cow_name}
                helperText={errors.cow_name}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#ffffff',
                    '& fieldset': {
                      borderColor: '#e0e0e0',
                      borderWidth: 2,
                    },
                    '&:hover fieldset': {
                      borderColor: speciesColor,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: speciesColor,
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: '#000000',
                  },
                  '& .MuiInputBase-input': {
                    color: '#000000',
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl 
                fullWidth 
                variant="outlined" 
                error={!!errors.species}
                disabled={isUpdate}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: isUpdate ? '#f5f5f5' : '#ffffff',
                    '& fieldset': {
                      borderColor: '#e0e0e0',
                      borderWidth: 2,
                    },
                    '&:hover fieldset': {
                      borderColor: speciesColor,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: speciesColor,
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: '#000000',
                  },
                  '& .MuiSelect-select': {
                    color: '#000000',
                  }
                }}
              >
                <InputLabel>Species *</InputLabel>
                <Select
                  value={formData.species}
                  onChange={(e) => handleChange('species', e.target.value)}
                  label="Species *"
                >
                  {Object.entries(SPECIES_CONFIG).map(([key, config]) => (
                    <MenuItem key={key} value={key}>
                      {config.icon} {config.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.species && <FormHelperText>{errors.species}</FormHelperText>}
                {isUpdate && (
                  <FormHelperText>Species cannot be changed after creation</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Breed"
                value={formData.breed}
                onChange={(e) => handleChange('breed', e.target.value)}
                variant="outlined"
                placeholder={`Enter ${currentSpecies.label.toLowerCase()} breed`}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#ffffff',
                    '& fieldset': { borderColor: '#e0e0e0', borderWidth: 2 },
                    '&:hover fieldset': { borderColor: speciesColor },
                    '&.Mui-focused fieldset': { borderColor: speciesColor }
                  },
                  '& .MuiInputLabel-root': { color: '#000000' },
                  '& .MuiInputBase-input': { color: '#000000' }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl 
                fullWidth 
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#ffffff',
                    '& fieldset': { borderColor: '#e0e0e0', borderWidth: 2 },
                    '&:hover fieldset': { borderColor: speciesColor },
                    '&.Mui-focused fieldset': { borderColor: speciesColor }
                  },
                  '& .MuiInputLabel-root': { color: '#000000' },
                  '& .MuiSelect-select': { color: '#000000' }
                }}
              >
                <InputLabel>Gender</InputLabel>
                <Select
                  value={formData.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                  label="Gender"
                >
                  {currentSpecies.genderOptions.map(gender => (
                    <MenuItem key={gender} value={gender}>
                      {gender === 'male' ? '♂️ Male' : '♀️ Female'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Birth Date"
                type="date"
                value={formData.birth_date}
                onChange={(e) => handleChange('birth_date', e.target.value)}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#ffffff',
                    '& fieldset': { borderColor: '#e0e0e0', borderWidth: 2 },
                    '&:hover fieldset': { borderColor: speciesColor },
                    '&.Mui-focused fieldset': { borderColor: speciesColor }
                  },
                  '& .MuiInputLabel-root': { color: '#000000' },
                  '& .MuiInputBase-input': { color: '#000000' }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl 
                fullWidth 
                variant="outlined"
                error={!!errors.stage}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#ffffff',
                    '& fieldset': { borderColor: '#e0e0e0', borderWidth: 2 },
                    '&:hover fieldset': { borderColor: speciesColor },
                    '&.Mui-focused fieldset': { borderColor: speciesColor }
                  },
                  '& .MuiInputLabel-root': { color: '#000000' },
                  '& .MuiSelect-select': { color: '#000000' }
                }}
              >
                <InputLabel>Stage *</InputLabel>
                <Select
                  value={formData.stage}
                  onChange={(e) => handleChange('stage', e.target.value)}
                  label="Stage *"
                >
                  {availableStages.map(stage => (
                    <MenuItem key={stage} value={stage}>
                      {stage.replace(/_/g, ' ').toUpperCase()}
                    </MenuItem>
                  ))}
                </Select>
                {errors.stage && <FormHelperText>{errors.stage}</FormHelperText>}
                {!errors.stage && (
                  <FormHelperText sx={{ color: '#666666' }}>
                    Based on {currentSpecies.label.toLowerCase()} lifecycle
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Sire Information - Show for relevant species */}
            {currentSpecies.showSireInfo && (
              <>
                <Grid item xs={12}>
                  <Typography variant="h6" color="#000000" mb={1} fontWeight={700}>
                    🐂 Sire Information (Optional)
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Bull/Sire Code"
                    value={formData.bull_code}
                    onChange={(e) => handleChange('bull_code', e.target.value)}
                    variant="outlined"
                    helperText="For offspring tracking"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#ffffff',
                        '& fieldset': { borderColor: '#e0e0e0', borderWidth: 2 },
                        '&:hover fieldset': { borderColor: speciesColor },
                        '&.Mui-focused fieldset': { borderColor: speciesColor }
                      },
                      '& .MuiInputLabel-root': { color: '#000000' },
                      '& .MuiInputBase-input': { color: '#000000' }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Bull/Sire Name"
                    value={formData.bull_name}
                    onChange={(e) => handleChange('bull_name', e.target.value)}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#ffffff',
                        '& fieldset': { borderColor: '#e0e0e0', borderWidth: 2 },
                        '&:hover fieldset': { borderColor: speciesColor },
                        '&.Mui-focused fieldset': { borderColor: speciesColor }
                      },
                      '& .MuiInputLabel-root': { color: '#000000' },
                      '& .MuiInputBase-input': { color: '#000000' }
                    }}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, backgroundColor: '#ffffff' }}>
        <Button 
          onClick={onClose}
          sx={{ 
            color: '#666666',
            borderRadius: '10px',
            fontWeight: 600,
            px: 3,
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            backgroundColor: '#10b981',
            color: '#ffffff',
            fontWeight: 700,
            borderRadius: '10px',
            px: 4,
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            '&:hover': { 
              backgroundColor: '#059669',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 16px rgba(16, 185, 129, 0.4)',
            },
          }}
        >
          {isUpdate ? 'Update Animal' : `Add ${currentSpecies.label}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(AnimalFormDialog);