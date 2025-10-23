// /src/pages/LandingPage/sections/FloatingChatButton.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Box, IconButton, Typography } from '@mui/material';
import MessageCircle from 'lucide-react/dist/esm/icons/message-circle';

const FloatingChatButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, duration: 0.5 }}
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 1000,
      }}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <IconButton
          sx={{
            width: 64,
            height: 64,
            background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
            color: 'white',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #059669 0%, #2563eb 100%)',
              boxShadow: '0 12px 32px rgba(16, 185, 129, 0.5)',
            },
          }}
          aria-label="Open AI chat assistant"
        >
          <MessageCircle size={28} />
        </IconButton>
      </motion.div>
      
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            position: 'absolute',
            right: '100%',
            top: '50%',
            transform: 'translateY(-50%)',
            marginRight: 16,
            whiteSpace: 'nowrap',
          }}
        >
          <Box
            sx={{
              bgcolor: 'white',
              px: 2,
              py: 1,
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
              Need help? Chat with our AI assistant
            </Typography>
          </Box>
        </motion.div>   
      )}
    </motion.div>
  );
};

export default FloatingChatButton;