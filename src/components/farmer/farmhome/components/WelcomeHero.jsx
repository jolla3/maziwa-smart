// farmhome/components/WelcomeHero.jsx
import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Droplet, Beef } from 'lucide-react';
import { COLORS, APP_TEXT } from '../utils/constants';

const WelcomeHero = ({ farmerName }) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${COLORS.aqua.main}15 0%, ${COLORS.green.main}10 100%)`,
        borderRadius: '24px',
        overflow: 'hidden',
        position: 'relative',
        mb: 4,
        border: `2px solid ${COLORS.aqua.main}30`,
      }}
    >
      <Container maxWidth="lg" sx={{ py: 6, position: 'relative', zIndex: 1 }}>
        <Box textAlign="center">
          <Typography
            variant="h2"
            fontWeight="900"
            color="#000000"
            sx={{
              mb: 2,
              letterSpacing: '-1px',
              textShadow: '0 2px 10px rgba(0,188,212,0.1)',
            }}
          >
            {APP_TEXT.welcome}, {farmerName || 'Farmer'} 👋
          </Typography>
          
          <Typography
            variant="h6"
            color="#666666"
            sx={{
              mb: 4,
              maxWidth: '700px',
              mx: 'auto',
              lineHeight: 1.7,
              fontWeight: 500,
            }}
          >
            {APP_TEXT.subtitle}
          </Typography>

          <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/farmerdashboard/milkrecording')}
              startIcon={<Droplet size={20} />}
              sx={{
                backgroundColor: COLORS.aqua.main,
                color: '#ffffff',
                fontWeight: 700,
                borderRadius: '12px',
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                boxShadow: `0 8px 24px ${COLORS.aqua.main}40`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: COLORS.aqua.dark,
                  transform: 'translateY(-3px)',
                  boxShadow: `0 12px 32px ${COLORS.aqua.main}50`,
                },
              }}
            >
              Record Milk
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/farmerdashboard/animals')}
              startIcon={<Beef size={20} />}
              sx={{
                color: COLORS.green.main,
                borderColor: COLORS.green.main,
                borderWidth: 2,
                fontWeight: 700,
                borderRadius: '12px',
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                backgroundColor: '#ffffff',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: COLORS.green.dark,
                  borderWidth: 2,
                  backgroundColor: `${COLORS.green.main}10`,
                  transform: 'translateY(-3px)',
                },
              }}
            >
              View Animals
            </Button>
          </Box>
        </Box>
      </Container>

      {/* Decorative circles */}
      <Box
        sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${COLORS.aqua.main}20 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${COLORS.green.main}20 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />
    </Box>
  );
};

export default React.memo(WelcomeHero);