import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  Card,
  CardContent,
  useTheme,
  Fade,
  Grow,
  Avatar,
  CardMedia
} from '@mui/material';
import {
  TrendingUp,
  Users,
  Shield,
  BarChart3,
  Leaf,
  Globe,
  ArrowRight,
  Star,
  Award
} from 'lucide-react';
import AppNavbar from '../AppNavbar';

const LandingPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const features = [
    {
      icon: <BarChart3 size={40} />,
      title: "Smart Analytics",
      description: "Advanced data analytics to track agricultural performance and market trends in real-time."
    },
    {
      icon: <Users size={40} />,
      title: "Community Network",
      description: "Connect farmers, porters, and administrators in a unified ecosystem for better collaboration."
    },
    {
      icon: <Shield size={40} />,
      title: "Secure Platform",
      description: "Enterprise-grade security ensuring your agricultural data is protected and compliant."
    },
    {
      icon: <TrendingUp size={40} />,
      title: "Market Intelligence",
      description: "Get insights into market prices, demand forecasts, and optimal selling strategies."
    },
    {
      icon: <Leaf size={40} />,
      title: "Sustainable Farming",
      description: "Promote eco-friendly practices with sustainability tracking and recommendations."
    },
    {
      icon: <Globe size={40} />,
      title: "Global Reach",
      description: "Access international markets and connect with buyers worldwide through our platform."
    }
  ];

  const testimonials = [
    {
      name: "John Kamau",
      role: "Farmer, Kiambu County",
      rating: 5,
      comment: "Maziwa Smart has transformed how I manage my dairy farm. The analytics help me optimize production and connect directly with buyers.",
      avatarSrc: "/images/john-kamau.jpg"
    },
    {
      name: "Sarah Wanjiku",
      role: "Agricultural Porter",
      rating: 5,
      comment: "The platform makes logistics so much easier. I can track deliveries and communicate with farmers seamlessly.",
      avatarSrc: "/images/sarah-wanjiku.jpg"
    },
    {
      name: "Peter Ochieng",
      role: "Farm Administrator",
      rating: 5,
      comment: "Managing multiple farms has never been easier. The dashboard gives me complete visibility into all operations.",
      avatarSrc: "/images/peter-ochieng.jpg"
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Farmers" },
    { number: "2M+", label: "Transactions" },
    { number: "500+", label: "Partner Stores" },
    { number: "98%", label: "Satisfaction Rate" }
  ];

  return (
    <Box>
      <AppNavbar />

      {/* Hero Section */}
      <Box
        sx={{
          background: theme.palette.mode === 'dark'
            ? `linear-gradient(135deg, ${theme.palette.primary[500]} 0%, ${theme.palette.primary[700]} 100%)`
            : `linear-gradient(135deg, ${theme.palette.primary[100]} 0%, ${theme.palette.primary[300]} 100%)`,
          minHeight: '90vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `radial-gradient(circle at 25% 25%, ${theme.palette.secondary.main}20 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, ${theme.palette.secondary.main}15 0%, transparent 50%)`,
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in={true} timeout={1000}>
                <Box>
                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                      fontWeight: 700,
                      color: 'text.primary',
                      mb: 3,
                      background: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Revolutionizing Agriculture with Smart Technology
                  </Typography>

                  <Typography
                    variant="h5"
                    sx={{
                      color: 'text.secondary',
                      mb: 4,
                      fontSize: { xs: '1.1rem', md: '1.3rem' },
                      lineHeight: 1.6,
                    }}
                  >
                    Connect farmers, optimize operations, and transform agricultural data into actionable insights.
                    Join thousands of farmers already growing smarter with Maziwa Smart.
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/register')}
                      endIcon={<ArrowRight size={20} />}
                      sx={{
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        bgcolor: theme.palette.secondary.main,
                        '&:hover': {
                          bgcolor: theme.palette.secondary.dark,
                          transform: 'translateY(-2px)',
                          boxShadow: `0 8px 25px ${theme.palette.secondary.main}40`,
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Get Started Free
                    </Button>

                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate('/login')}
                      sx={{
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        borderColor: theme.palette.secondary.main,
                        color: theme.palette.secondary.main,
                        '&:hover': {
                          borderColor: theme.palette.secondary.dark,
                          bgcolor: `${theme.palette.secondary.main}10`,
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Sign In
                    </Button>
                  </Box>
                </Box>
              </Fade>
            </Grid>

            <Grid item xs={12} md={6}>
              <Grow in={true} timeout={1500}>
                <Box
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: { xs: 'auto', md: '100%' },
                  }}
                >
                  <Box
                    component="video"
                    autoPlay
                    loop
                    muted
                    playsInline
                    sx={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 4,
                      boxShadow: 20,
                      objectFit: 'cover',
                      display: { xs: 'none', md: 'block' },
                      maxWidth: 600,
                    }}
                  >
                    <source src="/videos/hero-demo.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </Box>
                </Box>
              </Grow>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Grow in={true} timeout={1000 + index * 200}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography
                      variant="h2"
                      sx={{
                        fontSize: '3rem',
                        fontWeight: 700,
                        color: theme.palette.secondary.main,
                        mb: 1,
                      }}
                    >
                      {stat.number}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: 'text.secondary',
                        fontWeight: 500,
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 10, bgcolor: 'background.default' }}>
        {/* widen so md screens (≥900px) comfortably show 3 columns */}
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h2"
              sx={{ fontSize: '2.5rem', fontWeight: 700, color: 'text.primary', mb: 2 }}
            >
              Why Choose Maziwa Smart?
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}
            >
              Comprehensive agricultural management platform designed for modern farming operations
            </Typography>
          </Box>

          <Grid container spacing={4} justifyContent="center" alignItems="stretch">
            {features.map((feature, index) => (
              <Grid
                item
                xs={12}    // 1 column on phones
                sm={6}     // 2 columns on tablets
                md={4}     // 3 columns from md (≥900px) and up
                key={index}
              >
                <Grow in timeout={1200 + index * 150}>
                  <Card
                    elevation={4}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: `0 12px 30px ${theme.palette.secondary.main}20`,
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                      <Box
                        sx={{
                          display: 'inline-flex',
                          p: 2,
                          borderRadius: '50%',
                          bgcolor: `${theme.palette.secondary.main}20`,
                          color: theme.palette.secondary.main,
                          mb: 3,
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography variant="h5" component="h3" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: 10, bgcolor: 'background.paper' }}>
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: '2.5rem',
                fontWeight: 700,
                color: 'text.primary',
                mb: 2,
              }}
            >
              What Our Users Say
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Join thousands of satisfied farmers and agricultural professionals
            </Typography>
          </Box>

          <Grid
            container
            spacing={4}
            justifyContent="center"
            alignItems="stretch"   // makes all grid items equal height
          >
            {testimonials.map((testimonial, index) => (
              <Grid
                item
                xs={12}   // 1 column on phones
                sm={6}    // 2 columns on tablets
                md={4}    // 3 columns on desktops
                key={index}
              >
                <Fade in={true} timeout={1500 + index * 200}>
                  <Card
                    elevation={3}
                    sx={{
                      height: '100%',   // stretch card to fill grid item
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: `0 8px 25px ${theme.palette.secondary.main}15`,
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 4 }}>
                      <Box sx={{ display: 'flex', mb: 2 }}>
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            size={20}
                            fill={theme.palette.secondary.main}
                            color={theme.palette.secondary.main}
                          />
                        ))}
                      </Box>
                      <Typography
                        variant="body1"
                        sx={{ color: 'text.secondary', mb: 3, fontStyle: 'italic' }}
                      >
                        "{testimonial.comment}"
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: "auto" }}>
                        <Avatar
                          src={testimonial.avatarSrc}
                          alt={testimonial.name}
                          sx={{
                            bgcolor: theme.palette.secondary.main,
                            mr: 2,
                          }}
                        >
                          {!testimonial.avatarSrc && testimonial.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 600, color: 'text.primary' }}
                          >
                            {testimonial.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: 'text.secondary' }}
                          >
                            {testimonial.role}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>


      {/* CTA Section */}
      <Box
        sx={{
          py: 10,
          background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
          color: 'white',
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Award size={60} style={{ marginBottom: '2rem' }} />
          <Typography
            variant="h2"
            sx={{
              fontSize: '2.5rem',
              fontWeight: 700,
              mb: 3,
            }}
          >
            Ready to Transform Your Agriculture?
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 5,
              opacity: 0.9,
            }}
          >
            Join the agricultural revolution today. Start your free trial and experience the power of smart farming.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            endIcon={<ArrowRight size={20} />}
            sx={{
              px: 5,
              py: 2,
              fontSize: '1.2rem',
              fontWeight: 600,
              bgcolor: 'white',
              color: theme.palette.secondary.main,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                transform: 'translateY(-3px)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Start Free Trial
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          py: 6,
          bgcolor: 'background.paper',
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Leaf size={30} color={theme.palette.secondary.main} />
                <Typography
                  variant="h5"
                  sx={{ ml: 1, fontWeight: 600, color: 'text.primary' }}
                >
                  Maziwa Smart
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
                Empowering farmers with intelligent agricultural solutions for a sustainable future.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                <Typography variant="h6" sx={{ color: 'text.primary', mb: 2 }}>
                  Quick Links
                </Typography>
                <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' }, justifyContent: { md: 'flex-end' } }}>
                  <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
                  <Button color="inherit" onClick={() => navigate('/register')}>Register</Button>
                  <Button color="inherit">About</Button>
                  <Button color="inherit">Contact</Button>
                  <Button color="inherit" onClick={() => navigate('/privacy')}>
                    Privacy Policy
                  </Button>
                  <Button color="inherit" onClick={() => navigate('/terms')}>
                    Terms of Service
                  </Button>


                </Box>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 4, pt: 4, borderTop: `1px solid ${theme.palette.divider}`, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              © 2024 Maziwa Smart. All rights reserved. Transforming agriculture through innovation.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;