import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  IconButton,
  ThemeProvider,
  createTheme,
  CssBaseline,
  useMediaQuery
} from '@mui/material';
import CountUp from 'react-countup';
import { Helmet } from 'react-helmet';
import Activity from 'lucide-react/dist/esm/icons/activity';
import ShoppingCart from 'lucide-react/dist/esm/icons/shopping-cart';
import MessageCircle from 'lucide-react/dist/esm/icons/message-circle';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';
import Star from 'lucide-react/dist/esm/icons/star';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';
import Leaf from 'lucide-react/dist/esm/icons/leaf';
import Heart from 'lucide-react/dist/esm/icons/heart';
import Shield from 'lucide-react/dist/esm/icons/shield';
import Users from 'lucide-react/dist/esm/icons/users';
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up';
import AppNavbar from '../scenes/AppNavbar';

// Custom MUI Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    secondary: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
    },
    background: {
      default: '#ffffff',
      paper: '#fafafa',
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3.75rem',
      fontWeight: 800,
      lineHeight: 1.1,
      '@media (max-width:900px)': {
        fontSize: '2.5rem',
      },
    },
    h2: {
      fontSize: '2.75rem',
      fontWeight: 800,
      lineHeight: 1.2,
      '@media (max-width:900px)': {
        fontSize: '2rem',
      },
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 400,
      lineHeight: 1.7,
      '@media (max-width:900px)': {
        fontSize: '1.1rem',
      },
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.6,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});

// Wave Separator Component
const WaveSeparator = ({ flip = false, color = '#fafafa' }) => (
  <Box
    sx={{
      width: '100%',
      height: { xs: 40, md: 60 },
      overflow: 'hidden',
      lineHeight: 0,
      transform: flip ? 'rotate(180deg)' : 'none',
    }}
  >
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      style={{ width: '100%', height: '100%' }}
    >
      <path
        d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
        fill={color}
      />
    </svg>
  </Box>
);

// Animated Counter Component
const AnimatedStat = ({ number, label, inView }) => {
  const numericValue = parseInt(number.replace(/[^0-9]/g, ''));
  const suffix = number.replace(/[0-9]/g, '');

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography
        variant="h2"
        sx={{
          background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 1,
        }}
      >
        {inView && <CountUp end={numericValue} duration={2.5} />}
        {suffix}
      </Typography>
      <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600 }}>
        {label}
      </Typography>
    </Box>
  );
};

// Hero Section Component
const HeroSection = ({ navigate }) => {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

      {/* Floating Elements */}
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
        <Box sx={{ fontSize: '4rem' }}>🐄</Box>
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
        <Box sx={{ fontSize: '3rem' }}>🥛</Box>
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
        <Box sx={{ fontSize: '2.5rem' }}>🌾</Box>
      </motion.div>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Chip
                label="🚀 Now with AI-Powered Insights"
                sx={{
                  mb: 3,
                  bgcolor: 'rgba(16, 185, 129, 0.15)',
                  color: 'primary.dark',
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

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                {['Free to join', 'Verified marketplace', '24/7 AI support'].map((text, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckCircle size={20} color="#10b981" style={{ marginRight: 8 }} />
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
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: 'text.primary' }}>
                    🐄 Your Farm Dashboard
                  </Typography>
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

// Stats Section Component
const StatsSection = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const stats = [
    { number: "12K+", label: "Active Farmers" },
    { number: "50K+", label: "Animals Monitored" },
    { number: "3500+", label: "Market Transactions" },
    { number: "98%", label: "Satisfaction Rate" }
  ];

  return (
    <Box ref={ref} sx={{ py: 8, bgcolor: 'white' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <AnimatedStat {...stat} inView={isInView} />
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

// Features Section Component
const FeaturesSection = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const features = [
    {
      icon: <Activity size={48} />,
      title: "Digital Farm Monitoring",
      description: "Track milk production, animal health, and breeding cycles with AI-powered analytics and real-time dashboards.",
      color: theme.palette.primary.main,
      highlights: ["Milk Logs", "Health Tracking", "Breeding Records", "AI Insights"]
    },
    {
      icon: <ShoppingCart size={48} />,
      title: "Maziwa Market",
      description: "Buy and sell verified livestock and farm products in a secure, transparent marketplace connecting farmers across Kenya.",
      color: theme.palette.secondary.main,
      highlights: ["Verified Listings", "Secure Payments", "Quality Assurance", "Wide Reach"]
    },
    {
      icon: <MessageCircle size={48} />,
      title: "Community & Support",
      description: "Access expert advice, connect with porters for logistics, and get instant help from our AI assistant and vet network.",
      color: '#8b5cf6',
      highlights: ["AI Chat Assistant", "Vet Network", "Porter Services", "Farmer Community"]
    }
  ];

  return (
    <Box ref={ref} sx={{ py: 12, bgcolor: 'background.paper' }}>
      <WaveSeparator flip color="#ffffff" />
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h2" sx={{ color: 'text.primary', mb: 2 }}>
              The Complete MaziwaSmart Ecosystem
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 700, mx: 'auto' }}>
              Everything you need to run a modern, profitable farm — all in one platform
            </Typography>
          </motion.div>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -12 }}
              >
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    bgcolor: 'white',
                    border: '2px solid #f1f5f9',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      boxShadow: `0 20px 40px ${feature.color}20`,
                      borderColor: feature.color,
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        p: 2.5,
                        borderRadius: 3,
                        bgcolor: `${feature.color}15`,
                        color: feature.color,
                        mb: 3,
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7, mb: 3 }}>
                      {feature.description}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {feature.highlights.map((highlight, i) => (
                        <Chip
                          key={i}
                          label={highlight}
                          size="small"
                          sx={{
                            bgcolor: `${feature.color}10`,
                            color: feature.color,
                            fontWeight: 600,
                            fontSize: '0.75rem',
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
      <WaveSeparator color="#ffffff" />
    </Box>
  );
};

// How It Works Section
const HowItWorksSection = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const steps = [
    {
      step: "1",
      title: "Register Your Farm",
      description: "Create your digital farm profile in minutes. Add your animals, set up your dashboard, and join the ecosystem.",
      icon: <CheckCircle size={40} />
    },
    {
      step: "2",
      title: "Monitor Daily Operations",
      description: "Log milk production, track animal health, manage breeding schedules, and get AI-powered insights to optimize your farm.",
      icon: <Activity size={40} />
    },
    {
      step: "3",
      title: "Trade on Maziwa Market",
      description: "List your livestock or products for sale, or browse verified listings to buy quality animals and farm goods safely.",
      icon: <ShoppingCart size={40} />
    }
  ];

  return (
    <Box ref={ref} sx={{ py: 12, bgcolor: 'white' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h2" sx={{ color: 'text.primary', mb: 2 }}>
              How It Works
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
              Get started in three simple steps
            </Typography>
          </motion.div>
        </Box>

        <Grid container spacing={6} alignItems="center">
          {steps.map((step, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Box sx={{ textAlign: 'center', position: 'relative' }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                      boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    <Typography variant="h3" sx={{ color: 'white', fontWeight: 800 }}>
                      {step.step}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'inline-flex',
                      p: 2,
                      borderRadius: 2,
                      bgcolor: '#f0fdfa',
                      color: 'primary.main',
                      mb: 3,
                    }}
                  >
                    {step.icon}
                  </Box>

                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
                    {step.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7, px: 2 }}>
                    {step.description}
                  </Typography>

                  {index < steps.length - 1 && (
                    <Box
                      sx={{
                        display: { xs: 'none', md: 'block' },
                        position: 'absolute',
                        right: '-50%',
                        top: '40px',
                        transform: 'translateX(50%)',
                      }}
                    >
                      <ArrowRight size={30} color="#cbd5e1" />
                    </Box>
                  )}
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

// Market Section Component
const MarketSection = ({ navigate }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const listings = [
    {
      image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400&h=300&fit=crop",
      title: "Premium Friesian Cow",
      price: "KES 85,000",
      location: "Kiambu County",
      seller: "John Kamau",
      rating: 4.8,
      tag: "Verified"
    },
    {
      image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&h=300&fit=crop",
      title: "Ayrshire Bull - 2 Years",
      price: "KES 120,000",
      location: "Nakuru County",
      seller: "Mary Njeri",
      rating: 5.0,
      tag: "Featured"
    },
    {
      image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=300&fit=crop",
      title: "Fresh Milk - 50L Daily",
      price: "KES 55/L",
      location: "Nyandarua County",
      seller: "Peter Ochieng",
      rating: 4.9,
      tag: "Bulk Deal"
    },
    {
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop",
      title: "Napier Grass Seedlings",
      price: "KES 15,000",
      location: "Meru County",
      seller: "Grace Wambui",
      rating: 4.7,
      tag: "New"
    }
  ];

  return (
    <Box ref={ref} sx={{ py: 12, bgcolor: 'background.paper' }}>
      <WaveSeparator flip color="#ffffff" />
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h2" sx={{ color: 'text.primary', mb: 2 }}>
              Live Market Snapshot
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 650, mx: 'auto', mb: 3 }}>
              Trending listings from farmers across Kenya — quality verified, prices transparent
            </Typography>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                onClick={() => navigate('/market')}
                endIcon={<ArrowRight size={18} />}
                sx={{
                  bgcolor: 'secondary.main',
                  color: 'white',
                  px: 3,
                  py: 1.2,
                  '&:hover': {
                    bgcolor: 'secondary.dark',
                  },
                }}
              >
                View All Listings
              </Button>
            </motion.div>
          </motion.div>
        </Box>

        <Grid container spacing={3}>
          {listings.map((listing, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
              >
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    bgcolor: 'white',
                    border: '1px solid #e2e8f0',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                      borderColor: 'secondary.main',
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={listing.image}
                    alt={listing.title}
                    sx={{
                      width: '100%',
                      height: 180,
                      objectFit: 'cover',
                      borderBottom: '1px solid #e2e8f0',
                    }}
                  />
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1.5 }}>
                      <Chip
                        label={listing.tag}
                        size="small"
                        sx={{
                          bgcolor: '#10b98120',
                          color: '#059669',
                          fontWeight: 700,
                          fontSize: '0.7rem',
                          height: 22,
                        }}
                      />
                      <IconButton size="small" sx={{ color: '#94a3b8' }}>
                        <Heart size={18} />
                      </IconButton>
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'text.primary', fontSize: '1rem' }}>
                      {listing.title}
                    </Typography>

                    <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.main', mb: 1.5 }}>
                      {listing.price}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 0.5 }}>
                      <MapPin size={14} color="#64748b" />
                      <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                        {listing.location}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 1.5, borderTop: '1px solid #f1f5f9' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 28, height: 28, bgcolor: 'secondary.main', fontSize: '0.75rem' }}>
                          {listing.seller.charAt(0)}
                        </Avatar>
                        <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.85rem', fontWeight: 600 }}>
                          {listing.seller}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                        <Star size={14} fill="#fbbf24" color="#fbbf24" />
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem', fontWeight: 600 }}>
                          {listing.rating}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
      <WaveSeparator color="#ffffff" />
    </Box>
  );
};

// Testimonials Section Component
const TestimonialsSection = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const testimonials = [
    {
      name: "John Kamau",
      role: "Dairy Farmer, Kiambu",
      rating: 5,
      comment: "The monitoring dashboard helped me increase milk production by 30%. And I sold my Friesian cow in just 2 days on Maziwa Market!",
      avatar: "JK",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
    },
    {
      name: "Sarah Wanjiku",
      role: "Farm Manager, Nakuru",
      rating: 5,
      comment: "Real-time health tracking saved one of my cows. The vet consultation feature is invaluable for remote farms like mine.",
      avatar: "SW",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
    },
    {
      name: "Peter Ochieng",
      role: "Livestock Trader, Nairobi",
      rating: 5,
      comment: "Maziwa Market connects me with verified buyers. The platform's trust and transparency have transformed my business.",
      avatar: "PO",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop"
    }
  ];

  return (
    <Box ref={ref} sx={{ py: 12, bgcolor: 'white' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h2" sx={{ color: 'text.primary', mb: 2 }}>
              What Farmers Are Saying
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
              Join thousands of satisfied farmers growing smarter every day
            </Typography>
          </motion.div>
        </Box>

        <Grid container spacing={4}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -6 }}
              >
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    bgcolor: 'background.paper',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.08)',
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', mb: 2 }}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={18} fill="#fbbf24" color="#fbbf24" />
                      ))}
                    </Box>
                    <Typography variant="body1" sx={{ color: '#475569', mb: 3, lineHeight: 1.7, fontStyle: 'italic' }}>
                      "{testimonial.comment}"
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        src={testimonial.image}
                        alt={testimonial.name}
                        sx={{
                          bgcolor: 'primary.main',
                          width: 48,
                          height: 48,
                          fontWeight: 700,
                        }}
                      >
                        {testimonial.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

// CTA Section Component
const CTASection = ({ navigate }) => {
  return (
    <Box
      sx={{
        py: 12,
        background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 70% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)`,
        }}
      />

      <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Box
            sx={{
              display: 'inline-flex',
              p: 3,
              borderRadius: '50%',
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              mb: 3,
            }}
          >
            <Leaf size={50} />
          </Box>

          <Typography variant="h2" sx={{ mb: 3 }}>
            Join the MaziwaSmart Ecosystem
          </Typography>

          <Typography variant="h5" sx={{ mb: 5, opacity: 0.95, lineHeight: 1.6 }}>
            Monitor your farm, trade with confidence, and grow smarter.
            Start your journey today — it's free!
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
                endIcon={<ArrowRight size={20} />}
                sx={{
                  px: 5,
                  py: 2,
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  bgcolor: 'white',
                  color: 'primary.main',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.95)',
                    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.3)',
                  },
                }}
              >
                Start Free Today
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/login')}
                sx={{
                  px: 5,
                  py: 2,
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  borderColor: 'white',
                  borderWidth: 2,
                  color: 'white',
                  '&:hover': {
                    borderWidth: 2,
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                    borderColor: 'white',
                  },
                }}
              >
                Sign In
              </Button>
            </motion.div>
          </Box>

          <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
            {['No credit card required', 'Cancel anytime', 'Free forever plan'].map((text, i) => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircle size={20} />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{text}</Typography>
              </Box>
            ))}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

// Footer Component
const Footer = ({ navigate }) => {
  return (
    <Box sx={{ py: 8, bgcolor: '#0f172a', color: 'white' }}>
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
              Powering the future of smart farming in Kenya and beyond.
              Monitor, trade, and grow with Africa's leading agricultural platform.
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
              Our Products
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {[
                { label: 'Maziwa Market', path: '/market' },
                { label: 'Farmer Dashboard', path: '/farmerdashboard' },
                { label: 'Digital Monitoring', path: '#' },
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

        <Box sx={{ mt: 8, pt: 4, borderTop: '1px solid #334155', textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            © 2025 MaziwaSmart. All rights reserved. Powering the future of smart farming.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

// Floating Chat Button Component
const FloatingChatButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, duration: 0.5 }}
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 1000,
      }}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <IconButton
          sx={{
            width: 64,
            height: 64,
            background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
            color: 'white',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #059669 0%, #2563eb 100%)',
              boxShadow: '0 12px 32px rgba(16, 185, 129, 0.5)',
            },
          }}
          aria-label="Open AI chat assistant"
        >
          <MessageCircle size={28} />
        </IconButton>
      </motion.div>

      {isHovered && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            position: 'absolute',
            right: '100%',
            top: '50%',
            transform: 'translateY(-50%)',
            marginRight: 16,
            whiteSpace: 'nowrap',
          }}
        >
          <Box
            sx={{
              bgcolor: 'white',
              px: 2,
              py: 1,
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
              Need help? Chat with our AI assistant
            </Typography>
          </Box>
        </motion.div>
      )}
    </motion.div>
  );
};

// Main Landing Page Component
const LandingPage = () => {
  const navigate = useNavigate();
  const [navbarBg, setNavbarBg] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setNavbarBg(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Helmet>
        <title>MaziwaSmart - Smart Farming Platform for Kenya | Digital Farm Monitoring & Marketplace</title>
        <meta name="description" content="MaziwaSmart is Kenya's leading agricultural platform. Monitor your farm digitally, trade livestock and products on our verified marketplace, and grow smarter with AI-powered insights." />
        <meta name="keywords" content="Kenya dairy farming, smart agriculture, livestock marketplace, farm monitoring, digital farming, Maziwa Market, agricultural technology, farm management Kenya" />
        <meta property="og:title" content="MaziwaSmart - Empowering Farmers with Smart Monitoring & Market Access" />
        <meta property="og:description" content="Join 12,000+ farmers using MaziwaSmart to monitor their farms and trade on Kenya's most trusted agricultural marketplace." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://maziwasmart.com" />
      </Helmet>

      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          transition: 'all 0.3s ease',
          bgcolor: navbarBg ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
          backdropFilter: navbarBg ? 'blur(10px)' : 'none',
          boxShadow: navbarBg ? '0 2px 10px rgba(0, 0, 0, 0.05)' : 'none',
        }}
      >
        <AppNavbar />
      </Box>

      <Box sx={{ pt: '64px' }}>
        <HeroSection navigate={navigate} />
        <StatsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <MarketSection navigate={navigate} />
        <TestimonialsSection />
        <CTASection navigate={navigate} />
        <Footer navigate={navigate} />
      </Box>

      <FloatingChatButton />
    </ThemeProvider>
  );
};

export default LandingPage;