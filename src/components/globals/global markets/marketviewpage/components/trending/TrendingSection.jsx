import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { TrendingUp } from 'lucide-react';
import TrendingCarousel from './TrendingCarousel';

export default function TrendingSection({ listings }) {
  return (
    <Box sx={{ mb: 4, px: { xs: 1, sm: 2, md: 0 } }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
          gap: { xs: 1, sm: 2 },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              backgroundColor: '#ef444415',
              borderRadius: 1.5,
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TrendingUp size={24} color="#ef4444" />
          </Box>
          <Typography 
            variant="h5" 
            fontWeight="bold" 
            sx={{ 
              color: '#000',
              fontSize: { xs: '1.1rem', sm: '1.5rem' }
            }}
          >
            Trending Listings
          </Typography>
        </Box>
        <Chip
          label="🔥 Hot Deals"
          color="error"
          sx={{ 
            fontWeight: 'bold',
            fontSize: { xs: '0.75rem', sm: '0.875rem' }
          }}
        />
      </Box>

      <TrendingCarousel listings={listings} />
    </Box>
  );
}