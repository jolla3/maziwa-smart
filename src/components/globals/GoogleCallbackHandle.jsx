import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  CircularProgress, 
  Typography, 
  Alert, 
  Paper, 
  Container 
} from '@mui/material';

/**
 * Google OAuth Callback Handler
 * Handles redirect from Google after authentication.
 * 
 * Backend redirect types:
 *  - /google-callback?token=...&role=...
 *  - /google-callback?error=...
 *  - /set-password?token=...  (handled separately)
 * 
 * Route: <Route path="/google-callback" element={<GoogleCallbackHandler />} />
 */
const GoogleCallbackHandler = () => {
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('Authenticating with Google...');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    handleCallback();
    // eslint-disable-next-line
  }, [location]);

  const handleCallback = () => {
    try {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      const role = params.get('role');
      const name = params.get('name');
      const error = params.get('error');

      // ✅ 1️⃣ If backend returned an error
      if (error) {
        setStatus('error');
        setMessage(decodeURIComponent(error));
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      // ✅ 2️⃣ If this redirect is actually for SET-PASSWORD flow (short-lived token only)
      if (token && !role) {
        // redirect user to the set-password page
        setStatus('processing');
        setMessage('Account created. Redirecting to set password...');
        setTimeout(() => {
          navigate(`/set-password?token=${token}`);
        }, 1000);
        return;
      }

      // ✅ 3️⃣ Normal Google login success
      if (!token || !role) {
        setStatus('error');
        setMessage('Invalid authentication response. Missing credentials.');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      // ✅ Store the credentials locally
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      if (name) localStorage.setItem('userName', decodeURIComponent(name));

      // ✅ Update UI and redirect
      setStatus('success');
      setMessage('Login successful! Redirecting...');
      setTimeout(() => redirectByRole(role), 1500);
    } catch (err) {
      console.error('Callback handling error:', err);
      setStatus('error');
      setMessage('An error occurred during authentication.');
      setTimeout(() => navigate('/login'), 3000);
    }
  };

  const redirectByRole = (role) => {
    const roleRoutes = {
      admin: '/admindashboard',
      superadmin: '/superadmindashboard',
      seller: '/sellerdashboard',
      buyer: '/buyerdashboard',
      farmer: '/farmerdashboard',
      porter: '/porterdashboard',
      broker: '/brokerdashboard',
      manager: '/managerdashboard',
    };

    navigate(roleRoutes[role] || '/dashboard', { replace: true });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            p: 4,
            bgcolor: 'background.paper',
            borderRadius: 3,
            textAlign: 'center',
          }}
        >
          {status === 'processing' && (
            <>
              <CircularProgress size={60} sx={{ mb: 3 }} />
              <Typography variant="h6" sx={{ color: 'text.primary', mb: 1 }}>
                Authenticating...
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {message}
              </Typography>
            </>
          )}

          {status === 'success' && (
            <>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  bgcolor: 'success.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  mb: 3,
                }}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </Box>
              <Alert severity="success" sx={{ mb: 2 }}>
                {message}
              </Alert>
            </>
          )}

          {status === 'error' && (
            <>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  bgcolor: 'error.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  mb: 3,
                }}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </Box>
              <Alert severity="error" sx={{ mb: 2 }}>
                {message}
              </Alert>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Redirecting to login page...
              </Typography>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default GoogleCallbackHandler;
