// /src/pages/LandingPage/sections/FeaturesSection.jsx
import React from 'react';
import { motion, useInView } from 'framer-motion';
import { Box, Container, Grid, Typography, Card, CardContent, Chip } from '@mui/material';
import Activity from 'lucide-react/dist/esm/icons/activity';
import ShoppingCart from 'lucide-react/dist/esm/icons/shopping-cart';
import MessageCircle from 'lucide-react/dist/esm/icons/message-circle';

// Wave Separator Component
const WaveSeparator = ({ flip = false, color = '#fafafa' }) => (
  <Box
    sx={{
      width: '100%',
      height: { xs: 40, md: 50 },
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

const FeaturesSection = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const features = [
    {
      icon: <Activity size={48} />,
      title: "Farm Data & Analytics",
      description: "Real-time monitoring of milk production, animal health metrics, breeding cycles, and farm performance. Get AI-powered insights to optimize yields and reduce costs.",
      color: '#10b981',
      highlights: ["Milk Yield Tracking", "Health Monitoring", "Breeding Records", "Performance Analytics"]
    },
    {
      icon: <ShoppingCart size={48} />,
      title: "Marketplace Access",
      description: "Buy and sell livestock, dairy products, and farm supplies on Kenya's most trusted agricultural marketplace. Connect directly with verified buyers and sellers.",
      color: '#3b82f6',
      highlights: ["Verified Listings", "Secure Transactions", "Price Discovery", "Direct Trading"]
    },
    {
      icon: <MessageCircle size={48} />,
      title: "Smart Farm Management",
      description: "Manage your entire farm from one dashboard. Track inventory, schedule tasks, coordinate with porters, and get expert advice from our AI assistant and vet network.",
      color: '#8b5cf6',
      highlights: ["Task Scheduling", "Inventory Control", "Expert Support", "Team Coordination"]
    }
  ];

  return (
    <Box ref={ref} sx={{ py: 8, bgcolor: 'background.paper' }}>
      <WaveSeparator flip color="#ffffff" />
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h2" sx={{ color: 'text.primary', mb: 2 }}>
              Everything You Need in One Platform
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 700, mx: 'auto' }}>
              Comprehensive tools for modern farm management, market access, and data-driven decision making
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
                whileHover={{ y: -8 }}
              >
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    bgcolor: 'white',
                    border: '2px solid #f1f5f9',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      boxShadow: `0 15px 30px ${feature.color}20`,
                      borderColor: feature.color,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3.5 }}>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        p: 2.5,
                        borderRadius: 3,
                        bgcolor: `${feature.color}15`,
                        color: feature.color,
                        mb: 2.5,
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7, mb: 2.5 }}>
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

export default FeaturesSection;