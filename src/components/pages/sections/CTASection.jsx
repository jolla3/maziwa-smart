import React from 'react';
import { motion } from 'framer-motion';
import { Box, Container, Typography, Button, IconButton } from '@mui/material';
import { ArrowRight, MessageCircle, Send, X } from 'lucide-react';
import { useState } from 'react';

// CTA Section
export const CTASection = ({ navigate }) => {
  return (
    <Box
      sx={{
        py: 8,
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -50,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                mb: 2,
                fontSize: { xs: '2rem', md: '3rem' },
              }}
            >
              Ready to Transform Your Farm?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                maxWidth: 600,
                mx: 'auto',
                fontWeight: 400,
                fontSize: '1.2rem',
                opacity: 0.95,
              }}
            >
              Join thousands of farmers already growing smarter. Start your free trial today — no credit card required.
            </Typography>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/signup')}
                endIcon={<ArrowRight size={20} />}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  color: '#10b981',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  px: 5,
                  py: 2,
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#ffffff',
                    transform: 'translateY(-4px)',
                    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                Get Started Now
              </Button>
            </motion.div>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

// Floating Chat Button
export const FloatingChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Chat Widget */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          style={{
            position: 'fixed',
            bottom: 80,
            right: 20,
            zIndex: 999,
          }}
        >
          <Box
            sx={{
              width: { xs: '90vw', sm: 350 },
              height: 450,
              background: 'white',
              borderRadius: 3,
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
            }}
          >
            {/* Header */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                p: 2.5,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
                  MaziwaSmart Support
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.9,
                    fontSize: '0.85rem',
                  }}
                >
                  Usually replies in minutes
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={() => setIsOpen(false)}
                sx={{ color: 'white' }}
              >
                <X size={20} />
              </IconButton>
            </Box>

            {/* Messages */}
            <Box
              sx={{
                flex: 1,
                p: 2.5,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              <Box
                sx={{
                  alignSelf: 'flex-start',
                  backgroundColor: '#f1f5f9',
                  color: '#0f172a',
                  p: 1.5,
                  borderRadius: 2,
                  maxWidth: '80%',
                  fontSize: '0.9rem',
                  lineHeight: 1.5,
                }}
              >
                Hi! 👋 How can we help you today?
              </Box>
            </Box>

            {/* Input */}
            <Box
              sx={{
                p: 2,
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                gap: 1,
              }}
            >
              <Box
                component="input"
                placeholder="Type your message..."
                sx={{
                  flex: 1,
                  border: '1px solid #e2e8f0',
                  borderRadius: 2,
                  p: '10px 12px',
                  fontSize: '0.9rem',
                  fontFamily: 'inherit',
                  '&:focus': {
                    outline: 'none',
                    borderColor: '#10b981',
                    boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.1)',
                  },
                }}
              />
              <IconButton
                sx={{
                  color: '#10b981',
                  backgroundColor: '#10b98120',
                  '&:hover': {
                    backgroundColor: '#10b98130',
                  },
                }}
              >
                <Send size={18} />
              </IconButton>
            </Box>
          </Box>
        </motion.div>
      )}

      {/* Floating Button */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          sx={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 'auto',
            p: 0,
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 15px 40px rgba(16, 185, 129, 0.4)',
              transform: 'scale(1.1)',
            },
          }}
        >
          <MessageCircle size={24} />
        </Button>
      </motion.div>
    </>
  );
};

export default CTASection;