import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';
import { ArrowBack, Home } from '@mui/icons-material';
import { motion } from 'framer-motion';

const NotAuthorized = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ textAlign: 'center' }}>
            {/* 403 Error Code */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Typography
                sx={{
                  fontSize: { xs: '5rem', md: '8rem' },
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, #10b981 0%, #0f172a 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2,
                  lineHeight: 1,
                }}
              >
                403
              </Typography>
            </motion.div>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 900,
                color: '#0f172a',
                mb: 2,
                fontSize: { xs: '1.8rem', md: '2.5rem' },
              }}
            >
              Access Denied
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: '#475569',
                mb: 4,
                fontSize: '1.05rem',
                lineHeight: 1.6,
              }}
            >
              You do not have permission to access this page. This area is restricted to authorized users only.
            </Typography>

            {/* Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  startIcon={<ArrowBack />}
                  onClick={() => navigate(-1)}
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#fff',
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)',
                    '&:hover': {
                      boxShadow: '0 12px 24px rgba(16, 185, 129, 0.4)',
                    },
                  }}
                >
                  Go Back
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  startIcon={<Home />}
                  onClick={() => navigate('/')}
                  variant="outlined"
                  sx={{
                    borderColor: '#0f172a',
                    color: '#0f172a',
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    border: '2px solid',
                    '&:hover': {
                      backgroundColor: 'rgba(16, 185, 129, 0.05)',
                      borderColor: '#10b981',
                      color: '#10b981',
                    },
                  }}
                >
                  Home
                </Button>
              </motion.div>
            </Box>

            {/* Additional help */}
            <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid rgba(16, 185, 129, 0.1)' }}>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
                Need help? Here are some options:
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button
                    onClick={() => navigate('/login')}
                    sx={{
                      color: '#10b981',
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: 'rgba(16, 185, 129, 0.05)',
                      },
                    }}
                  >
                    Sign In
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button
                    onClick={() => navigate('/register')}
                    sx={{
                      color: '#10b981',
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: 'rgba(16, 185, 129, 0.05)',
                      },
                    }}
                  >
                    Create Account
                  </Button>
                </motion.div>
              </Box>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default NotAuthorized;