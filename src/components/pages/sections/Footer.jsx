// /src/pages/LandingPage/sections/Footer.jsx
import React from 'react';
import { Box, Container, Grid, Typography, Button, IconButton } from '@mui/material';
import Leaf from 'lucide-react/dist/esm/icons/leaf';
import Shield from 'lucide-react/dist/esm/icons/shield';
import Users from 'lucide-react/dist/esm/icons/users';
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up';

const Footer = ({ navigate }) => {
  return (
    <Box sx={{ py: 6, bgcolor: '#0f172a', color: 'white' }}>
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Leaf size={32} color="#10b981" />
              <Typography variant="h5" sx={{ ml: 1.5, fontWeight: 700 }}>
                MaziwaSmart
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ color: '#94a3b8', mb: 3, lineHeight: 1.7 }}>
              Kenya's leading farm management platform. Monitor performance, 
              access markets, and grow profitably with data-driven insights.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <IconButton sx={{ bgcolor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', '&:hover': { bgcolor: 'rgba(16, 185, 129, 0.25)' } }}>
                <Shield size={20} />
              </IconButton>
              <IconButton sx={{ bgcolor: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', '&:hover': { bgcolor: 'rgba(59, 130, 246, 0.25)' } }}>
                <Users size={20} />
              </IconButton>
              <IconButton sx={{ bgcolor: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6', '&:hover': { bgcolor: 'rgba(139, 92, 246, 0.25)' } }}>
                <TrendingUp size={20} />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={2.5}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5 }}>
              Platform
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {[
                { label: 'Marketplace', path: '/market' },
                { label: 'Farm Dashboard', path: '/farmerdashboard' },
                { label: 'Analytics', path: '#' },
                { label: 'Community', path: '#' }
              ].map((item, i) => (
                <Button
                  key={i}
                  onClick={() => item.path !== '#' && navigate(item.path)}
                  sx={{
                    justifyContent: 'flex-start',
                    color: '#94a3b8',
                    textTransform: 'none',
                    px: 0,
                    '&:hover': { color: '#10b981', bgcolor: 'transparent' }
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={2.5}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5 }}>
              Company
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {['About Us', 'Careers', 'Contact', 'Blog'].map((text, i) => (
                <Button
                  key={i}
                  sx={{
                    justifyContent: 'flex-start',
                    color: '#94a3b8',
                    textTransform: 'none',
                    px: 0,
                    '&:hover': { color: '#10b981', bgcolor: 'transparent' }
                  }}
                >
                  {text}
                </Button>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2.5 }}>
              Legal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {[
                { label: 'Privacy Policy', path: '/privacy' },
                { label: 'Terms of Service', path: '/terms' },
                { label: 'Cookie Policy', path: '#' },
                { label: 'Security', path: '#' }
              ].map((item, i) => (
                <Button
                  key={i}
                  onClick={() => item.path !== '#' && navigate(item.path)}
                  sx={{
                    justifyContent: 'flex-start',
                    color: '#94a3b8',
                    textTransform: 'none',
                    px: 0,
                    '&:hover': { color: '#10b981', bgcolor: 'transparent' }
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid #334155', textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            © 2025 MaziwaSmart. All rights reserved. Empowering Kenya's farmers with technology.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;