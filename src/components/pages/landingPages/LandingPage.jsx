// /src/pages/LandingPage/LandingPage.jsx
import React, { useState, useEffect } from 'react';
import { Box, ThemeProvider, CssBaseline } from '@mui/material';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import AppNavbar from '../AppNavbar';
import theme from './theme';

// Section imports
import HeroSection from './sections/HeroSection';
import StatsSection from './sections/StatsSection';
import FeaturesSection from './sections/FeaturesSection';
import HowItWorksSection from './sections/HowItWorksSection';
import MarketSection from './sections/MarketSection';
import TestimonialsSection from './sections/TestimonialsSection';
import CTASection from './sections/CTASection';
import Footer from './sections/Footer';
import FloatingChatButton from './sections/FloatingChatButton';

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
        <title>MaziwaSmart - Smart Farm Management & Marketplace for Kenya</title>
        <meta 
          name="description" 
          content="Monitor milk yields, track farm performance, and connect to buyers seamlessly. MaziwaSmart is Kenya's leading digital platform for dairy farmers and livestock traders." 
        />
        <meta 
          name="keywords" 
          content="Kenya dairy farming, farm management system, livestock marketplace, milk yield tracking, smart agriculture Kenya, farm data analytics, dairy farm software" 
        />
        <meta property="og:title" content="MaziwaSmart - Smart Farm Management & Marketplace" />
        <meta property="og:description" content="Track your farm performance, manage livestock, and access Kenya's trusted agricultural marketplace — all from one dashboard." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://maziwasmart.com" />
      </Helmet>

      {/* Navbar with scroll effect */}
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

      {/* Main content with subtle background texture */}
      <Box 
        sx={{ 
          pt: '64px',
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%2310b981" fill-opacity="0.03"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}
      >
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