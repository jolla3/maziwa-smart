// /src/pages/LandingPage/sections/StatsSection.jsx
import React from 'react';
import { motion, useInView } from 'framer-motion';
import { Box, Container, Grid, Typography } from '@mui/material';
import CountUp from 'react-countup';

const AnimatedStat = ({ number, label, suffix, inView }) => {
  const numericValue = parseInt(number.replace(/[^0-9]/g, ''));
  
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography
        variant="h2"
        sx={{
          background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 0.5,
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

const StatsSection = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const stats = [
    { number: "12000", label: "Active Farms", suffix: "+" },
    { number: "50000", label: "Animals Tracked", suffix: "+" },
    { number: "3500", label: "Monthly Trades", suffix: "+" },
    { number: "98", label: "Customer Satisfaction", suffix: "%" }
  ];

  return (
    <Box ref={ref} sx={{ py: 6, bgcolor: 'white' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <AnimatedStat 
                  number={stat.number} 
                  label={stat.label} 
                  suffix={stat.suffix}
                  inView={isInView} 
                />
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default StatsSection;