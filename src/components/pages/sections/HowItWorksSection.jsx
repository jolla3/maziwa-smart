import React from 'react';
import { motion, useInView } from 'framer-motion';
import { Box, Container, Typography, useMediaQuery } from '@mui/material';
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle';
import Activity from 'lucide-react/dist/esm/icons/activity';
import ShoppingCart from 'lucide-react/dist/esm/icons/shopping-cart';

const HowItWorksSection = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const steps = [
    {
      step: "1",
      title: "Register Your Farm",
      description: "Create your farm profile in minutes. Add animals, set up tracking, and access your personalized dashboard.",
      icon: <CheckCircle size={isMobile ? 24 : 32} />
    },
    {
      step: "2",
      title: "Track & Analyze",
      description: "Log daily milk yields, monitor animal health, and get AI-powered insights to improve farm performance.",
      icon: <Activity size={isMobile ? 24 : 32} />
    },
    {
      step: "3",
      title: "Trade & Grow",
      description: "Access the marketplace to buy supplies, sell products, and connect with verified buyers across Kenya.",
      icon: <ShoppingCart size={isMobile ? 24 : 32} />
    }
  ];

  return (
    <Box ref={ref} sx={{ py: 8, bgcolor: 'white', overflow: 'hidden' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
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

        {/* Horizontal Carousel with Auto-Scroll - Only 3 Boxes */}
        <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: '-100%' }}  // Auto-scroll from start
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'linear',
            }}
            whileHover={{ animationPlayState: 'paused' }}
            drag="x"
            dragConstraints={{ left: -100, right: 100 }}
            style={{
              display: 'flex',
              gap: 2,
              width: '100%',  // No duplication
            }}
          >
            {steps.map((step, index) => (  // Only 3 items
              <motion.div
                key={`${step.step}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                style={{
                  width: 250,
                  flexShrink: 0,
                  height: isMobile ? 300 : 350,
                }}
              >
                <Box sx={{ 
                  textAlign: 'center', 
                  p: 2, 
                  borderRadius: 2, 
                  bgcolor: '#f0fdfa', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  {/* Number */}
                  <Box
                    sx={{
                      width: isMobile ? 50 : 60,
                      height: isMobile ? 50 : 60,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 1,
                      boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    <Typography variant={isMobile ? "h5" : "h4"} sx={{ color: 'white', fontWeight: 800 }}>
                      {step.step}
                    </Typography>
                  </Box>

                  {/* Icon */}
                  <Box sx={{ mb: 1 }}>
                    {step.icon}
                  </Box>

                  {/* Title */}
                  <Typography variant={isMobile ? "h6" : "h5"} sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
                    {step.title}
                  </Typography>

                  {/* Description */}
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.5, fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                    {step.description}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default HowItWorksSection;