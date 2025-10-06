// src/components/Login.jsx
import React, { useState, useContext } from 'react';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AppNavbar from '../../components/AppNavbar';
import { AuthContext } from '../../components/PrivateComponents/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  InputAdornment, 
  IconButton, 
  Paper,
  Container,
  Link,
  CircularProgress,
  Divider,
  useTheme
} from '@mui/material';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const { setUser, setToken } = useContext(AuthContext);

  // API Base URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://maziwasmart.onrender.com';

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const togglePassword = () => setShowPassword((prev) => !prev);

  // Role-based navigation function
  const navigateByRole = (role) => {
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

    const route = roleRoutes[role] || '/';
    navigate(route);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.email || !formData.password) {
      toast.error('Email and password are required');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/userAuth/login`,
        formData
      );

      const { token, role, user } = response.data;

      if (!token) {
        toast.error('Login failed: No token received');
        return;
      }

      // Decode token for additional user info
      const decodedUser = jwtDecode(token);

      // Save to localStorage and context
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(decodedUser));
      setToken(token);
      setUser(decodedUser);

      toast.success(response.data.message || 'Login successful!', { autoClose: 1000 });

      // Navigate based on role
      setTimeout(() => {
        navigateByRole(role || decodedUser.role);
      }, 1200);
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    // Redirect to backend Google OAuth route
    window.location.href = `${API_BASE_URL}/api/userAuth/google`;
  };

  return (
    <Box>
      <AppNavbar />
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
              border: `1px solid ${theme.palette.mode === 'dark' ? theme.palette.grey[600] : theme.palette.grey[300]}`,
              boxShadow: theme.palette.mode === 'dark' 
                ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
                : '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Box component="form" onSubmit={handleLogin} noValidate>
              <Typography 
                variant="h4" 
                align="center" 
                gutterBottom
                sx={{ 
                  color: 'text.primary',
                  mb: 2,
                  fontWeight: 600,
                }}
              >
                Welcome Back
              </Typography>

              <Typography 
                variant="body2" 
                align="center" 
                sx={{ 
                  color: 'text.secondary',
                  mb: 4,
                }}
              >
                Sign in to your MaziWaSmart account
              </Typography>

              <TextField
                fullWidth
                type="email"
                name="email"
                label="Email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                margin="normal"
                variant="outlined"
                autoComplete="username"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <User size={20} color={theme.palette.text.secondary} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[600] : theme.palette.grey[400],
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    '&.Mui-focused': {
                      color: theme.palette.primary.main,
                    },
                  },
                }}
              />

              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                name="password"
                label="Password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                margin="normal"
                variant="outlined"
                autoComplete="current-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={20} color={theme.palette.text.secondary} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePassword}
                        edge="end"
                        sx={{ color: theme.palette.text.secondary }}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 1,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[600] : theme.palette.grey[400],
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    '&.Mui-focused': {
                      color: theme.palette.primary.main,
                    },
                  },
                }}
              />

              <Box sx={{ textAlign: 'right', mb: 3 }}>
                <Link
                  href="/forgot-password"
                  sx={{
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Forgot Password?
                </Link>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  py: 1.5,
                  mb: 2,
                  fontSize: '1rem',
                  fontWeight: 600,
                  bgcolor: theme.palette.primary.main,
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 6px 20px ${theme.palette.primary.main}40`,
                  },
                  '&:disabled': {
                    bgcolor: theme.palette.action.disabled,
                    color: theme.palette.text.disabled,
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} color="inherit" />
                    Signing in...
                  </Box>
                ) : (
                  'Sign In'
                )}
              </Button>

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', px: 2 }}>
                  OR
                </Typography>
              </Divider>

              <Button
                fullWidth
                variant="outlined"
                onClick={handleGoogleLogin}
                disabled={googleLoading || loading}
                sx={{
                  py: 1.5,
                  mb: 3,
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
                {googleLoading ? (
                  <>
                    <CircularProgress size={20} />
                    <span>Connecting to Google...</span>
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
                    <span>Sign in with Google</span>
                  </>
                )}
              </Button>

              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Don't have an account?{' '}
                  <Link
                    href="/register"
                    sx={{
                      color: theme.palette.primary.main,
                      textDecoration: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Sign Up
                  </Link>
                </Typography>
              </Box>

              <Typography 
                variant="caption" 
                align="center" 
                display="block"
                sx={{ 
                  color: 'text.disabled',
                  fontSize: '0.75rem',
                }}
              >
                By signing in, you agree to our Terms of Service and Privacy Policy
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
      <ToastContainer position="top-center" />
    </Box>
  );
};

export default Login;