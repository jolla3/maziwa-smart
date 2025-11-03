// farmhome/components/Footer.jsx
import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { Droplet } from 'lucide-react';
import { COLORS } from '../utils/constants';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#ffffff',
        borderTop: `2px solid ${COLORS.aqua.main}20`,
        py: 4,
        mt: 6,
      }}
    >
      <Container maxWidth="lg">
        <Box
          display="flex"
          flexDirection={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          gap={3}
        >
          {/* Left: Logo */}
          <Box display="flex" alignItems="center" gap={1.5}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${COLORS.aqua.main} 0%, ${COLORS.aqua.dark} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
              }}
            >
              <Droplet size={28} />
            </Box>
            <Typography
              variant="h5"
              fontWeight="900"
              color="#000000"
              sx={{ letterSpacing: '-0.5px' }}
            >
              MaziwaSmart
            </Typography>
          </Box>

          {/* Center: Copyright */}
          <Typography
            variant="body2"
            color="#666666"
            fontWeight="600"
            textAlign="center"
          >
            © {new Date().getFullYear()} MaziwaSmart. All rights reserved.
          </Typography>

          {/* Right: Support Email */}
          <Typography
            variant="body2"
            color={COLORS.aqua.main}
            fontWeight="700"
            sx={{
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              '&:hover': {
                color: COLORS.aqua.dark,
              },
            }}
            component="a"
            href="mailto:support@maziwasmart.com"
          >
            support@maziwasmart.com
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default React.memo(Footer);