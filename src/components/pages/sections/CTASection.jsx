// /src/pages/LandingPage/sections/CTASection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Box, Container, Typography, Button } from '@mui/material';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';
import Leaf from 'lucide-react/dist/esm/icons/leaf';

const CTASection = ({ navigate }) => {
  return (
    <Box
      sx={{
        py: 10,
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
            Ready to Transform Your Farm?
          </Typography>
          
          <Typography variant="h5" sx={{ mb: 5, opacity: 0.95, lineHeight: 1.6 }}>
            Join over 12,000 farmers using MaziwaSmart to monitor performance, 
            access markets, and grow profitably. Start your free trial today.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 4 }}>
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
                Start Free Trial
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

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
            {['30-day free trial', 'No credit card needed', 'Cancel anytime'].map((text, i) => (
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

export default CTASection;