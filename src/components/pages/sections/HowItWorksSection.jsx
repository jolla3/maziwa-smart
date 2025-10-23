// /src/pages/LandingPage/sections/HowItWorksSection.jsx
import React from 'react';
import { motion, useInView } from 'framer-motion';
import { Box, Container, Grid, Typography } from '@mui/material';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';
import Activity from 'lucide-react/dist/esm/icons/activity';
import ShoppingCart from 'lucide-react/dist/esm/icons/shopping-cart';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';

const HowItWorksSection = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const steps = [
    {
      step: "1",
      title: "Register Your Farm",
      description: "Create your farm profile in minutes. Add animals, set up tracking, and access your personalized dashboard.",
      icon: <CheckCircle size={40} />
    },
    {
      step: "2",
      title: "Track & Analyze",
      description: "Log daily milk yields, monitor animal health, and get AI-powered insights to improve farm performance.",
      icon: <Activity size={40} />
    },
    {
      step: "3",
      title: "Trade & Grow",
      description: "Access the marketplace to buy supplies, sell products, and connect with verified buyers across Kenya.",
      icon: <ShoppingCart size={40} />
    }
  ];

  return (
    <Box ref={ref} sx={{ py: 8, bgcolor: 'white' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h2" sx={{ color: 'text.primary', mb: 2 }}>
              How It Works
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
              Start managing your farm smarter in three simple steps
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
                      mb: 2.5,
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
                      mb: 2.5,
                    }}
                  >
                    {step.icon}
                  </Box>

                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5, color: 'text.primary' }}>
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

export default HowItWorksSection;