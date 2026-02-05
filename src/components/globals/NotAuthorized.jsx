import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, Container, Typography, Paper } from '@mui/material';
import { ArrowBack, Home, Login, PersonAdd, Logout } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { AuthContext } from '../PrivateComponents/AuthContext';   // ← adjust path if needed

const NotAuthorized = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  const from = location.state?.from?.pathname || '/';

  const handleGoHome = () => navigate('/', { replace: true });
  const handleLogin = () => navigate('/login', { replace: true, state: { from } });
  const handleRegister = () => navigate('/register', { replace: true });
  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper
            elevation={8}
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 4,
              textAlign: 'center',
              background: '#fff',
              boxShadow: '0 20px 60px rgba(16, 185, 129, 0.15)',
            }}
          >
            {/* Big 403 */}
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <Typography
                sx={{
                  fontSize: { xs: '6rem', md: '9rem' },
                  fontWeight: 900,
                  background: 'linear-gradient(135deg, #10b981 0%, #0f172a 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1,
                  mb: 1,
                }}
              >
                403
              </Typography>
            </motion.div>

            <Typography
              variant="h3"
              sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}
            >
              {isAuthenticated ? 'Access Denied' : 'Please Sign In'}
            </Typography>

            <Typography
              variant="h6"
              sx={{ color: '#475569', mb: 4, maxWidth: 420, mx: 'auto', lineHeight: 1.7 }}
            >
              {isAuthenticated
                ? `You are currently logged in as a ${user?.role || 'user'}. This section is restricted to specific roles only.`
                : 'This page requires you to be signed in to continue.'}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate(-1)}
                variant="contained"
                sx={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  px: 4,
                  py: 1.5,
                  fontWeight: 700,
                  borderRadius: 2,
                }}
              >
                Go Back
              </Button>

              <Button
                startIcon={<Home />}
                onClick={handleGoHome}
                variant="outlined"
                sx={{
                  borderColor: '#0f172a',
                  color: '#0f172a',
                  px: 4,
                  py: 1.5,
                  fontWeight: 700,
                  borderRadius: 2,
                  '&:hover': { borderColor: '#10b981', color: '#10b981' },
                }}
              >
                Home
              </Button>

              {!isAuthenticated ? (
                <>
                  <Button
                    startIcon={<Login />}
                    onClick={handleLogin}
                    variant="contained"
                    sx={{ px: 4, py: 1.5, fontWeight: 700, borderRadius: 2 }}
                  >
                    Sign In
                  </Button>

                  <Button
                    startIcon={<PersonAdd />}
                    onClick={handleRegister}
                    variant="outlined"
                    sx={{
                      borderColor: '#10b981',
                      color: '#10b981',
                      px: 4,
                      py: 1.5,
                      fontWeight: 700,
                      borderRadius: 2,
                    }}
                  >
                    Create Account
                  </Button>
                </>
              ) : (
                <Button
                  startIcon={<Logout />}
                  onClick={handleLogout}
                  variant="outlined"
                  color="error"
                  sx={{ px: 4, py: 1.5, fontWeight: 700, borderRadius: 2 }}
                >
                  Log Out & Try Again
                </Button>
              )}
            </Box>

            {isAuthenticated && (
              <Typography variant="body2" sx={{ mt: 5, color: '#64748b' }}>
                If you believe this is a mistake, please contact support or try logging in with a different account.
              </Typography>
            )}
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default NotAuthorized;