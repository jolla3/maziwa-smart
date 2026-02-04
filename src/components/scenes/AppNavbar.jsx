import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Container,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import { Menu as MenuIcon, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AppNavbar = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Marketplace', href: '/market' },
  ];

  return (
    <>
      <AppBar
        elevation={0}
        sx={{
          backgroundColor: 'transparent',
          backdropFilter: 'none',
          color: '#0f172a',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 2,
            }}
          >
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/')}
              style={{ cursor: 'pointer' }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 900,
                    fontSize: '1.2rem',
                  }}
                >
                  M
                </Box>
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: '1.3rem',
                    color: '#0f172a',
                    display: { xs: 'none', sm: 'block' },
                  }}
                >
                  MaziwaSmart
                </Typography>
              </Box>
            </motion.div>

            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
              {navLinks.map((link) => (
                <Button
                  key={link.label}
                  href={link.href}
                  sx={{
                    color: '#0f172a',
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '0.95rem',
                    px: 2,
                    '&:hover': {
                      color: '#10b981',
                      backgroundColor: 'transparent',
                    },
                  }}
                >
                  {link.label}
                </Button>
              ))}
            </Box>

            {/* Auth Buttons */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1.5, alignItems: 'center' }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => navigate('/login')}
                  sx={{
                    color: '#0f172a',
                    fontWeight: 700,
                    textTransform: 'none',
                    fontSize: '0.95rem',
                    '&:hover': {
                      backgroundColor: '#f0fdfa',
                      color: '#10b981',
                    },
                  }}
                >
                  Log In
                </Button>
              </motion.div>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => navigate('/register')}
                    variant="outlined"
                    sx={{
                      borderColor: '#10b981',
                      color: '#10b981',
                      fontWeight: 700,
                      textTransform: 'none',
                      fontSize: '0.95rem',
                      border: '2px solid',
                      px: 2.5,
                      '&:hover': {
                        backgroundColor: 'rgba(16, 185, 129, 0.05)',
                        borderColor: '#059669',
                      },
                    }}
                  >
                    Sign Up
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => navigate('/register_seller')}
                    variant="contained"
                    sx={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#fff',
                      fontWeight: 700,
                      textTransform: 'none',
                      fontSize: '0.95rem',
                      px: 2.5,
                      borderRadius: 2,
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                      '&:hover': {
                        boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)',
                      },
                    }}
                  >
                    Sell Now
                  </Button>
                </motion.div>
              </Box>
            </Box>

            {/* Mobile Menu Button */}
            <IconButton
              sx={{ display: { xs: 'flex', md: 'none' }, color: '#0f172a' }}
              onClick={() => setMobileOpen(true)}
            >
              <MenuIcon size={24} />
            </IconButton>
          </Box>
        </Container>
      </AppBar>

      {/* Mobile Drawer - Light theme */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: '#ffffff',
            borderLeft: '1px solid rgba(16, 185, 129, 0.1)',
          }
        }}
      >
        <Box sx={{ width: 280, p: 2 }}>
          {/* Close button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
            <IconButton onClick={() => setMobileOpen(false)} sx={{ color: '#0f172a' }}>
              <X size={24} />
            </IconButton>
          </Box>

          {/* Mobile nav links */}
          <List>
            {navLinks.map((link) => (
              <ListItem
                key={link.label}
                onClick={() => {
                  if (link.href.startsWith('/')) {
                    navigate(link.href);
                  }
                  setMobileOpen(false);
                }}
                sx={{
                  cursor: 'pointer',
                  py: 1.5,
                  color: '#0f172a',
                  fontWeight: 600,
                  '&:hover': {
                    color: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.05)',
                    borderRadius: 1,
                  },
                }}
              >
                <Typography sx={{ fontWeight: 600 }}>{link.label}</Typography>
              </ListItem>
            ))}
          </List>

          {/* Mobile auth buttons */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 3 }}>
            <Button
              onClick={() => {
                navigate('/login');
                setMobileOpen(false);
              }}
              fullWidth
              sx={{
                color: '#0f172a',
                fontWeight: 700,
                textTransform: 'none',
                py: 1.2,
                border: '2px solid #10b981',
                borderRadius: 1,
              }}
            >
              Log In
            </Button>
            <Button
              onClick={() => {
                navigate('/register');
                setMobileOpen(false);
              }}
              fullWidth
              variant="outlined"
              sx={{
                borderColor: '#10b981',
                color: '#10b981',
                fontWeight: 700,
                textTransform: 'none',
                py: 1.2,
                border: '2px solid',
              }}
            >
              Sign Up
            </Button>
            <Button
              onClick={() => {
                navigate('/register_seller');
                setMobileOpen(false);
              }}
              fullWidth
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#fff',
                fontWeight: 700,
                textTransform: 'none',
                py: 1.2,
              }}
            >
              Sell Now
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default AppNavbar;