// farmhome/components/ServicesOverview.jsx
import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { Droplet, Stethoscope, Dna, BarChart3 } from 'lucide-react';
import { COLORS, APP_TEXT } from '../utils/constants';

const ServicesOverview = () => {
  const services = [
    {
      title: 'Milk Yield Tracking',
      description: 'Monitor collection data and patterns with detailed analytics and insights.',
      icon: <Droplet size={40} />,
      color: COLORS.aqua.main,
    },
    {
      title: 'Health Monitoring',
      description: 'Detect anomalies with AI suggestions to keep your livestock healthy.',
      icon: <Stethoscope size={40} />,
      color: COLORS.red.main,
    },
    {
      title: 'Breeding Records',
      description: 'Manage reproductive cycles efficiently with comprehensive tracking.',
      icon: <Dna size={40} />,
      color: COLORS.purple.main,
    },
    {
      title: 'Performance Analytics',
      description: 'See data trends visually with charts and comprehensive reports.',
      icon: <BarChart3 size={40} />,
      color: COLORS.blue.main,
    },
  ];

  return (
    <Box mb={4}>
      <Box textAlign="center" mb={4}>
        <Typography
          variant="h3"
          fontWeight="900"
          color="#000000"
          mb={2}
          sx={{ letterSpacing: '-0.5px' }}
        >
          {APP_TEXT.services.title}
        </Typography>
        <Typography
          variant="body1"
          color="#666666"
          fontWeight="500"
          sx={{ maxWidth: '800px', mx: 'auto', lineHeight: 1.8 }}
        >
          {APP_TEXT.services.subtitle}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {services.map((service, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: `2px solid ${service.color}30`,
                height: '100%',
                transition: 'all 0.3s ease',
                boxShadow: `0 4px 12px ${service.color}20`,
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: `0 16px 32px ${service.color}40`,
                  border: `2px solid ${service.color}`,
                },
              }}
            >
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '16px',
                    background: `linear-gradient(135deg, ${service.color}20 0%, ${service.color}10 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    mb: 2,
                    color: service.color,
                  }}
                >
                  {service.icon}
                </Box>

                <Typography
                  variant="h6"
                  fontWeight="900"
                  color="#000000"
                  mb={1.5}
                  sx={{ fontSize: '1.1rem' }}
                >
                  {service.title}
                </Typography>

                <Typography
                  variant="body2"
                  color="#666666"
                  fontWeight="500"
                  sx={{ lineHeight: 1.7 }}
                >
                  {service.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default React.memo(ServicesOverview);