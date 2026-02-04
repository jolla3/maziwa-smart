import React from 'react';
import { motion, useInView } from 'framer-motion';
import { Box, Container, Grid, Typography, Button, Card, CardContent } from '@mui/material';
import { TrendingUp, Lock, Zap, Users } from 'lucide-react';

const SellerIntegrationSection = ({ navigate }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const features = [
    {
      icon: <TrendingUp size={32} style={{ color: '#10b981' }} />,
      title: 'Earn More',
      description: 'Reach 12,000+ active farmers directly'
    },
    {
      icon: <Lock size={32} style={{ color: '#10b981' }} />,
      title: 'Verified Buyers',
      description: 'Trade with trusted, verified users'
    },
    {
      icon: <Zap size={32} style={{ color: '#10b981' }} />,
      title: 'Instant Setup',
      description: 'Start selling in minutes'
    },
    {
      icon: <Users size={32} style={{ color: '#10b981' }} />,
      title: 'Support Team',
      description: '24/7 seller assistance'
    }
  ];

  return (
    <Box
      ref={ref}
      sx={{
        py: 6,
        background: 'linear-gradient(135deg, #f0fdfa 0%, #ffffff 100%)',
        borderTop: '1px solid rgba(16, 185, 129, 0.1)',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* Left content */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 900,
                  color: '#0f172a',
                  mb: 2,
                  fontSize: { xs: '1.8rem', md: '2.5rem' },
                }}
              >
                Grow Your Business as a Seller
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#475569',
                  fontSize: '1.05rem',
                  lineHeight: 1.8,
                  mb: 3,
                }}
              >
                Join our trusted marketplace and connect with thousands of farmers. Sell livestock, dairy products, feed, and farm supplies with verified buyer protection.
              </Typography>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => navigate('/register_seller')}
                  variant="contained"
                  size="large"
                  sx={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#fff',
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: '1rem',
                    boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)',
                    '&:hover': {
                      boxShadow: '0 12px 24px rgba(16, 185, 129, 0.4)',
                    },
                  }}
                >
                  Start Selling Today
                </Button>
              </motion.div>
            </motion.div>
          </Grid>

          {/* Right - Features grid */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        backgroundColor: '#ffffff',
                        border: '1px solid rgba(16, 185, 129, 0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: '#10b981',
                          boxShadow: '0 8px 16px rgba(16, 185, 129, 0.1)',
                        },
                      }}
                    >
                      <CardContent sx={{ textAlign: 'center', p: 2 }}>
                        <motion.div whileHover={{ rotate: 10, scale: 1.1 }} style={{ marginBottom: '0.5rem' }}>
                          {feature.icon}
                        </motion.div>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', mb: 0.5 }}>
                          {feature.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748b' }}>
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default SellerIntegrationSection;