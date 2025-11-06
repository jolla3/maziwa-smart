import React, { useState } from 'react';
import { Button, CircularProgress, useTheme } from '@mui/material';

/**
 * Reusable Google Login Button Component
 * Can be integrated into any login/register page
 */
const GoogleLoginButton = ({ fullWidth = true, variant = "outlined" }) => {
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  // Base URL for API
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://maziwasmart.onrender.com';

  const handleGoogleLogin = () => {
    setLoading(true);
    // Redirect to backend Google OAuth route
    window.location.href = `${API_BASE_URL}/api/userAuth/google`;
  };

  return (
    <Button
      fullWidth={fullWidth}
      variant={variant}
      onClick={handleGoogleLogin}
      disabled={loading}
      sx={{
        py: 1.5,
        fontSize: '1rem',
        fontWeight: 600,
        borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[600] : theme.palette.grey[400],
        color: 'text.primary',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        '&:hover': {
          borderColor: theme.palette.primary.main,
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        },
        '&:disabled': {
          borderColor: theme.palette.action.disabled,
          color: theme.palette.text.disabled,
        },
        transition: 'all 0.3s ease',
      }}
    >
      {loading ? (
        <>
          <CircularProgress size={20} />
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Continue with Google</span>
        </>
      )}
    </Button>
  );
};

export default GoogleLoginButton;
