// farmhome/components/StatsSection.jsx
import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Skeleton } from '@mui/material';
import { Droplet, Beef, Users, AlertTriangle } from 'lucide-react';
import { COLORS } from '../utils/constants';

// Local formatter functions
const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num || 0);
};

const formatLitres = (litres) => {
  return `${formatNumber(litres)} L`;
};

const StatsSection = ({ stats, loading }) => {
  const statCards = [
    {
      title: 'Total Milk',
      value: stats?.total_milk || 0,
      formatter: (val) => formatLitres(val),
      icon: <Droplet size={36} />,
      color: COLORS.aqua.main,
    },
    {
      title: 'Total Cows',
      value: stats?.cows || 0,
      formatter: (val) => formatNumber(val),
      icon: <Beef size={36} />,
      color: COLORS.green.main,
    },
    {
      title: 'Inseminations',
      value: stats?.inseminations || 0,
      formatter: (val) => formatNumber(val),
      icon: <Users size={36} />,
      color: COLORS.blue.main,
    },
    {
      title: 'Anomalies',
      value: stats?.anomalies || 0,
      formatter: (val) => formatNumber(val),
      icon: <AlertTriangle size={36} />,
      color: COLORS.red.main,
    },
  ];

  if (loading) {
    return (
      <Grid container spacing={3} mb={4}>
        {[1, 2, 3, 4].map((i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card
              sx={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '2px solid #e0e0e0',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box flex={1}>
                    <Skeleton width="80%" height={50} />
                    <Skeleton width="60%" height={30} />
                  </Box>
                  <Skeleton variant="circular" width={64} height={64} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Box mb={4}>
      <Typography
        variant="h4"
        fontWeight="900"
        color="#000000"
        mb={3}
        sx={{ letterSpacing: '-0.5px' }}
      >
        Farm Statistics
      </Typography>

      <Grid container spacing={3}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: `2px solid ${stat.color}30`,
                transition: 'all 0.3s ease',
                boxShadow: `0 4px 12px ${stat.color}20`,
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: `0 12px 24px ${stat.color}40`,
                  border: `2px solid ${stat.color}`,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box flex={1}>
                    <Typography
                      variant="h3"
                      fontWeight="900"
                      color="#000000"
                      sx={{
                        mb: 1,
                        letterSpacing: '-1px',
                      }}
                    >
                      {stat.formatter(stat.value)}
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight="600"
                      color="#666666"
                    >
                      {stat.title}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '14px',
                      background: `linear-gradient(135deg, ${stat.color}20 0%, ${stat.color}10 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: stat.color,
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default React.memo(StatsSection);