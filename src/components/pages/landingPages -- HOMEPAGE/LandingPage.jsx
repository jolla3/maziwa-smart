import React, { useState, useEffect } from 'react';
import { Box, ThemeProvider, CssBaseline } from '@mui/material';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import AppNavbar from '../../scenes/AppNavbar';
import theme from './theme';

// Section imports
import HeroSection from '../sections/HeroSection';
import FeaturesSection from '../sections/FeaturesSection';
import HowItWorksSection from '../sections/HowItWorksSection';
import MarketSection from '../sections/MarketSection';
import SellerIntegrationSection from '../sections/Sellersignupsection';
import TestimonialsSection from '../sections/TestimonialsSection';
import { CTASection, FloatingChatButton } from '../sections/CTASection';
import Footer from '../sections/Footer';

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
        <meta
          property="og:description"
          content="Track your farm performance, manage livestock, and access Kenya's trusted agricultural marketplace — all from one dashboard."
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://maziwasmart.com" />
      </Helmet>

      {/* Light navbar - no dark UI */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          transition: 'all 0.3s ease',
          bgcolor: navbarBg ? 'rgba(255, 255, 255, 0.98)' : 'transparent',
          backdropFilter: navbarBg ? 'blur(10px)' : 'none',
          boxShadow: navbarBg ? '0 2px 10px rgba(16, 185, 129, 0.1)' : 'none',
        }}
      >
        <AppNavbar />
      </Box>

      {/* Main content - Clean and concise */}
      <Box sx={{ pt: '64px', backgroundColor: '#ffffff' }}>
        <HeroSection navigate={navigate} />
        <FeaturesSection />
        <HowItWorksSection />
        <MarketSection navigate={navigate} />
        <SellerIntegrationSection navigate={navigate} />
        <TestimonialsSection />
        <CTASection navigate={navigate} />
        <Footer navigate={navigate} />
      </Box>

      <FloatingChatButton />
    </ThemeProvider>
  );
};

export default LandingPage;