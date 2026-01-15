// /src/pages/LandingPage/sections/HeroSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, Button, Container, Grid, Chip, useMediaQuery } from '@mui/material';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';
import ShoppingCart from 'lucide-react/dist/esm/icons/shopping-cart';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';
import Activity from 'lucide-react/dist/esm/icons/activity';
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up';
import BarChart3 from 'lucide-react/dist/esm/icons/bar-chart-3';

const HeroSection = ({ navigate }) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 50%, #f0fdf4 100%)',
        minHeight: '92vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `radial-gradient(circle at 20% 30%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)`,
        }}
      />

      {/* Floating Icon Elements */}
      {!isMobile && (
        <>
          <motion.div
            style={{
              position: 'absolute',
              top: '15%',
              right: '10%',
              opacity: 0.6,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Activity size={40} color="#10b981" />
            </Box>
          </motion.div>

          <motion.div
            style={{
              position: 'absolute',
              bottom: '20%',
              right: '15%',
              opacity: 0.5,
            }}
            animate={{
              y: [0, 15, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: '50%',
                bgcolor: 'rgba(59, 130, 246, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TrendingUp size={35} color="#3b82f6" />
            </Box>
          </motion.div>

          <motion.div
            style={{
              position: 'absolute',
              top: '60%',
              right: '5%',
              opacity: 0.4,
            }}
            animate={{
              y: [0, -15, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                bgcolor: 'rgba(139, 92, 246, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BarChart3 size={30} color="#8b5cf6" />
            </Box>
          </motion.div>
        </>
      )}

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Chip
                icon={<Sparkles size={16} />}
                label="AI-Powered Farm Intelligence"
                sx={{
                  mb: 3,
                  bgcolor: 'rgba(16, 185, 129, 0.15)',
                  color: '#059669',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  px: 1,
                }}
              />
              
              <Typography variant="h1" sx={{ color: 'text.primary', mb: 3 }}>
                Empowering Farmers with{' '}
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Smart Monitoring & Market Access
                </Box>
              </Typography>

              <Typography variant="h5" sx={{ color: 'text.secondary', mb: 4 }}>
                Monitor your farm digitally, trade livestock and products on our trusted marketplace, 
                and grow smarter with the MaziwaSmart ecosystem.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/register_farmer')}
                    endIcon={<ArrowRight size={20} />}
                    sx={{
                      px: 4,
                      py: 1.8,
                      fontSize: '1.1rem',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                        boxShadow: '0 15px 35px rgba(16, 185, 129, 0.4)',
                      },
                    }}
                  >
                    Join as a Farmer
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/market')}
                    endIcon={<ShoppingCart size={20} />}
                    sx={{
                      px: 4,
                      py: 1.8,
                      fontSize: '1.1rem',
                      borderColor: 'secondary.main',
                      borderWidth: 2,
                      color: 'secondary.main',
                      '&:hover': {
                        borderWidth: 2,
                        bgcolor: 'rgba(59, 130, 246, 0.05)',
                      },
                    }}
                  >
                    Explore the Market
                  </Button>
                </motion.div>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/register_seller')}
                    endIcon={<ArrowRight size={20} />}
                    sx={{
                      px: 4,
                      py: 1.8,
                      fontSize: '1.1rem',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                        boxShadow: '0 15px 35px rgba(16, 185, 129, 0.4)',
                      },
                    }}
                  >
                    Join as a Farmer
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/market')}
                    endIcon={<ShoppingCart size={20} />}
                    sx={{
                      px: 4,
                      py: 1.8,
                      fontSize: '1.1rem',
                      borderColor: 'secondary.main',
                      borderWidth: 2,
                      color: 'secondary.main',
                      '&:hover': {
                        borderWidth: 2,
                        bgcolor: 'rgba(59, 130, 246, 0.05)',
                      },
                    }}
                  >
                    Explore the Market
                  </Button>
                </motion.div>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                {['Free to join', 'Verified marketplace', '24/7 AI support'].map((text, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle size={18} color="#10b981" />
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                      {text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </motion.div>
          </Grid>

          {!isMobile && (
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                <Box
                  sx={{
                    width: '100%',
                    maxWidth: 550,
                    height: 450,
                    borderRadius: 4,
                    bgcolor: 'white',
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 4,
                    background: 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%)',
                    mx: 'auto',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                    <Activity size={32} color="#10b981" />
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      Your Farm Dashboard
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography variant="h2" sx={{ fontWeight: 800, color: 'primary.main' }}>
                      342L
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                      Milk Produced Today
                    </Typography>
                  </Box>
                  <Grid container spacing={2} sx={{ width: '100%', maxWidth: 400 }}>
                    <Grid item xs={6}>
                      <Box sx={{ bgcolor: 'rgba(59, 130, 246, 0.1)', p: 2, borderRadius: 2, textAlign: 'center' }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: 'secondary.main' }}>24</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Active Animals</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ bgcolor: 'rgba(139, 92, 246, 0.1)', p: 2, borderRadius: 2, textAlign: 'center' }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#8b5cf6' }}>98%</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Herd Health</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </motion.div>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;