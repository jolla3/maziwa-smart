// animals/components/AnimalStatsCards.jsx
import React, { useMemo } from 'react';
import { Box, Typography, Card, CardContent, Grid, Skeleton } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import FemaleIcon from '@mui/icons-material/Female';

const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num || 0);
};

const AnimalStatsCards = ({ animals, loading }) => {
  const stats = useMemo(() => {
    const totalMilk = animals
      .filter(a => a.species === 'cow')
      .reduce((total, animal) => total + (animal.lifetime_milk || 0), 0);
    
    const totalOffspring = animals.reduce((total, animal) => 
      total + (animal.offspring?.length || 0), 0
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

  const statCards = [
    {
      label: 'Total Animals',
      value: formatNumber(stats.total),
      color: '#10b981',
      bgGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      icon: <PetsIcon sx={{ fontSize: 40 }} />
    },
    {
      label: 'Total Milk Yield',
      value: `${formatNumber(stats.totalMilk)}L`,
      color: '#00bcd4',
      bgGradient: 'linear-gradient(135deg, #00bcd4 0%, #008ba3 100%)',
      icon: <LocalDrinkIcon sx={{ fontSize: 40 }} />
    },
    {
      label: 'Total Offspring',
      value: formatNumber(stats.totalOffspring),
      color: '#ef4444',
      bgGradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      icon: <FamilyRestroomIcon sx={{ fontSize: 40 }} />
    },
    {
      label: 'Female Ratio',
      value: `${stats.femaleRatio}%`,
      color: '#8b5cf6',
      bgGradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      icon: <FemaleIcon sx={{ fontSize: 40 }} />
    },
  ];

  return (
    <Grid container spacing={3} mb={4}>
      {statCards.map((stat, idx) => (
        <Grid item xs={12} sm={6} md={3} key={idx}>
          <Card 
            sx={{ 
              background: stat.bgGradient,
              borderRadius: '16px',
              overflow: 'hidden',
              position: 'relative',
              transition: 'all 0.3s ease',
              border: `2px solid ${stat.color}60`,
              boxShadow: `0 4px 12px ${stat.color}30`,
              '&:hover': {
                transform: 'translateY(-6px)',
                boxShadow: `0 12px 24px ${stat.color}50`,
              },
            }}
          >
            <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
              {loading ? (
                <Box>
                  <Skeleton variant="text" width="60%" height={50} sx={{ bgcolor: '#ffffff40' }} />
                  <Skeleton variant="text" width="40%" height={30} sx={{ bgcolor: '#ffffff40' }} />
                </Box>
              ) : (
                <Box>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '12px',
                        backgroundColor: '#ffffff30',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                      }}
                    >
                      {stat.icon}
                    </Box>
                  </Box>
                  <Typography 
                    variant="h3" 
                    fontWeight="900" 
                    color="#ffffff"
                    sx={{
                      textShadow: '0 2px 8px rgba(0,0,0,0.2)',
                      letterSpacing: '-0.5px',
                      mb: 0.5
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="#ffffff"
                    sx={{ 
                      opacity: 0.95,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      fontSize: '0.75rem'
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default React.memo(AnimalStatsCards);