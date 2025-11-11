// farmhome/components/QuickLinks.jsx
import React from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Droplet, Beef, Dna, ShoppingCart, Bell, BarChart3 } from 'lucide-react';
import { COLORS } from '../utils/constants';

const QuickLinks = () => {
  const navigate = useNavigate();

  const links = [
    {
      title: 'Record Milk',
      icon: <Droplet size={32} />,
      color: COLORS.aqua.main,
      route: '/fmr.drb/milkrecording',
    },
    {
      title: 'My Animals',
      icon: <Beef size={32} />,
      color: COLORS.green.main,
      route: '/fmr.drb/animals',
    },
    {
      title: 'Inseminations',
      icon: <Dna size={32} />,
      color: COLORS.purple.main,
      route: '/fmr.drb/insemination-record',
    },
    {
      title: 'Marketplace',
      icon: <ShoppingCart size={32} />,
      color: COLORS.orange.main,
      route: '/fmr.drb/marketplace',
    },
    {
      title: 'Notifications',
      icon: <Bell size={32} />,
      color: COLORS.red.main,
      route: '/fmr.drb/notifications',
    },
    {
      title: 'Reports',
      icon: <BarChart3 size={32} />,
      color: COLORS.blue.main,
      route: '/fmr.drb/reports',
    },
  ];

  return (
    <Box mb={4}>
      <Typography
        variant="h4"
        fontWeight="900"
        color="#000000"
        mb={3}
        sx={{ letterSpacing: '-0.5px' }}
      >
        Quick Links
      </Typography>

      <Grid container spacing={2}>
        {links.map((link, index) => (
          <Grid item xs={6} sm={4} md={2} key={index}>
            <Card
              onClick={() => navigate(link.route)}
              sx={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: `2px solid ${link.color}30`,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: `0 2px 8px ${link.color}20`,
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: `0 12px 24px ${link.color}40`,
                  border: `2px solid ${link.color}`,
                },
              }}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '16px',
                    background: `linear-gradient(135deg, ${link.color}20 0%, ${link.color}10 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    mb: 2,
                    color: link.color,
                  }}
                >
                  {link.icon}
                </Box>
                <Typography
                  variant="body2"
                  fontWeight="700"
                  color="#000000"
                  sx={{ fontSize: '0.85rem' }}
                >
                  {link.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default React.memo(QuickLinks);