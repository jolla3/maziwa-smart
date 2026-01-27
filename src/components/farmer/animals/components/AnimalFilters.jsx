// animals/components/AnimalFilters.jsx
import React from 'react';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';

const AnimalFilters = ({
  searchTerm,
  setSearchTerm,
  filterBy,
  setFilterBy,
  sortBy,
  setSortBy,
  selectedSpecies,
  setSelectedSpecies,
  onRefresh,
  onAddAnimal,
  onAddCalf,
  onViewInsemination,
  onAddMilk,
  refreshing,
}) => {
  const speciesConfig = [
    { value: 'all', label: 'All Animals', color: '#6b7280' },
    { value: 'cow', label: 'Cows & Bulls', color: '#00bcd4' },
    { value: 'goat', label: 'Goats', color: '#10b981' },
    { value: 'sheep', label: 'Sheep', color: '#8b5cf6' },
    { value: 'pig', label: 'Pigs', color: '#f59e0b' },
  ];

  const filterOptions = [
    { value: 'all', label: 'All Animals' },
    { value: 'male', label: 'Males' },
    { value: 'female', label: 'Females' },
    { value: 'cows', label: 'Cows (Female)' },
    { value: 'bulls', label: 'Bulls (Male Cows)' },
    { value: 'has_offspring', label: 'With Offspring' },
    { value: 'high_yield', label: 'High Yield' },
  ];

  return (
    <Box>
      {/* Species Filter Buttons */}
      <Box 
        display="flex" 
        gap={1.5} 
        mb={3} 
        flexWrap="wrap"
        sx={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          p: 2.5,
          border: '2px solid #e0e0e0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}
      >
        {speciesConfig.map((species) => (
          <Button
            key={species.value}
            variant={selectedSpecies === species.value ? 'contained' : 'outlined'}
            onClick={() => setSelectedSpecies(species.value)}
            sx={{
              backgroundColor: selectedSpecies === species.value ? species.color : '#ffffff',
              color: selectedSpecies === species.value ? '#ffffff' : '#000000',
              borderColor: species.color,
              borderWidth: 2,
              borderRadius: '10px',
              px: 3,
              py: 1,
              fontWeight: 700,
              textTransform: 'uppercase',
              fontSize: '0.8rem',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: species.color,
                color: '#ffffff',
                borderColor: species.color,
                borderWidth: 2,
                transform: 'translateY(-2px)',
                boxShadow: `0 4px 12px ${species.color}40`,
              },
            }}
          >
            {species.label}
          </Button>
        ))}
      </Box>

      {/* Search and Controls */}
      <Box 
        display="flex" 
        flexDirection={{ xs: 'column', md: 'row' }}
        gap={2}
        alignItems={{ xs: 'stretch', md: 'center' }}
        mb={3}
        p={3}
        sx={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '2px solid #e0e0e0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}
      >
        {/* Search */}
        <TextField
          variant="outlined"
          label="Search animals..."
          placeholder="Name or breed"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: '#00bcd4', mr: 1, fontSize: 28 }} />,
          }}
          sx={{ 
            flex: 1, 
            maxWidth: { xs: '100%', md: '350px' },
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#ffffff',
              '& fieldset': {
                borderColor: '#e0e0e0',
                borderWidth: 2,
              },
              '&:hover fieldset': {
                borderColor: '#00bcd4',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#00bcd4',
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

        {/* Filter */}
        <FormControl 
          variant="outlined" 
          sx={{ 
            minWidth: 200,
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#ffffff',
              '& fieldset': {
                borderColor: '#e0e0e0',
                borderWidth: 2,
              },
              '&:hover fieldset': {
                borderColor: '#00bcd4',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#00bcd4',
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
          <InputLabel>Filter</InputLabel>
          <Select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            startAdornment={<FilterListIcon sx={{ color: '#00bcd4', mr: 1 }} />}
            label="Filter"
          >
            {filterOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Sort */}
        <FormControl 
          variant="outlined" 
          sx={{ 
            minWidth: 170,
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#ffffff',
              '& fieldset': {
                borderColor: '#e0e0e0',
                borderWidth: 2,
              },
              '&:hover fieldset': {
                borderColor: '#00bcd4',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#00bcd4',
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
          <InputLabel>Sort By</InputLabel>
          <Select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            label="Sort By"
          >
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="age">Age</MenuItem>
            <MenuItem value="yield">Yield</MenuItem>
            <MenuItem value="offspring">Offspring</MenuItem>
          </Select>
        </FormControl>

        {/* Action Buttons */}
        <Box display="flex" gap={1.5} flexWrap="wrap" ml={{ md: 'auto' }}>
          <Tooltip title="Refresh data">
            <IconButton 
              onClick={onRefresh}
              disabled={refreshing}
              sx={{ 
                color: '#ffffff',
                backgroundColor: '#00bcd4',
                width: 48,
                height: 48,
                borderRadius: '10px',
                transition: 'all 0.3s ease',
                '&:hover': { 
                  backgroundColor: '#008ba3',
                  transform: 'rotate(180deg)',
                },
                '&:disabled': {
                  backgroundColor: '#d1d5db',
                }
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
              backgroundColor: '#10b981',
              color: '#ffffff',
              borderRadius: '10px',
              px: 2.5,
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': { 
                backgroundColor: '#059669',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(16, 185, 129, 0.4)',
              },
            }}
            startIcon={<AddIcon />}
            onClick={onAddAnimal}
          >
            Add Animal
          </Button>

          <Button
            variant="outlined"
            sx={{
              color: '#10b981',
              borderColor: '#10b981',
              borderWidth: 2,
              borderRadius: '10px',
              px: 2,
              fontWeight: 600,
              backgroundColor: '#ffffff',
              '&:hover': { 
                borderColor: '#059669',
                backgroundColor: '#10b98110',
                borderWidth: 2,
              },
            }}
            startIcon={<AddIcon />}
            onClick={onAddCalf}
          >
            Add Offspring
          </Button>

          <Button
            variant="outlined"
            sx={{
              color: '#00bcd4',
              borderColor: '#00bcd4',
              borderWidth: 2,
              borderRadius: '10px',
              px: 2,
              fontWeight: 600,
              backgroundColor: '#ffffff',
              '&:hover': { 
                borderColor: '#008ba3',
                backgroundColor: '#00bcd410',
                borderWidth: 2,
              },
            }}
            onClick={onViewInsemination}
          >
            Insemination
          </Button>

          <Button
            variant="outlined"
            sx={{
              color: '#8b5cf6',
              borderColor: '#8b5cf6',
              borderWidth: 2,
              borderRadius: '10px',
              px: 2,
              fontWeight: 600,
              backgroundColor: '#ffffff',
              '&:hover': { 
                borderColor: '#7c3aed',
                backgroundColor: '#8b5cf610',
                borderWidth: 2,
              },
            }}
            onClick={onAddMilk}
          >
            Milk Record
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default React.memo(AnimalFilters);