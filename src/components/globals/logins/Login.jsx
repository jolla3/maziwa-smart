import React, { useState, useContext, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, WifiOff } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AppNavbar from '../../scenes/AppNavbar';
import { AuthContext } from '../../PrivateComponents/AuthContext';
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
  Checkbox,
  FormControlLabel,
  Backdrop,
  Alert,
  Fade
} from '@mui/material';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [redirecting, setRedirecting] = useState(false);

  const navigate = useNavigate();
  const { setUser, setToken, user, token } = useContext(AuthContext);

  const API_BASE_URL = process.env.REACT_APP_API_BASE;

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Back online!', { autoClose: 1000 });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('No internet connection', { autoClose: false })
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const checkAutoLogin = async () => {
      const savedToken = localStorage.getItem('token');
      const savedRememberMe = localStorage.getItem('rememberMe') === 'true';

      if (savedToken && savedRememberMe) {
        try {
          const decoded = jwtDecode(savedToken);
          const isExpired = decoded.exp * 1000 < Date.now();

          if (!isExpired) {
            setToken(savedToken);
            setUser(decoded);

            setTimeout(() => {
              navigateByRole(decoded.role);
            }, 3000);
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('rememberMe');
          }
        } catch (error) {
          console.error('Auto-login failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('rememberMe');
        }
      }
    };

    checkAutoLogin();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const togglePassword = () => setShowPassword((prev) => !prev);

  const navigateByRole = (role) => {
    const roleRoutes = {
      admin: '/admindashboard',
      superadmin: '/spr.dmn',
      seller: '/slr.drb',
      buyer: '/byr.drb',
      farmer: '/fmr.drb',
      porter: '/porterdashboard',
      broker: '/brokerdashboard',
      manager: '/man.drb',
    };

    const route = roleRoutes[role?.toLowerCase()] || '/';
    setRedirecting(true);

    setTimeout(() => {
      navigate(route);
    }, 5000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!isOnline) {
      toast.error('No internet connection. Please check your network.');
      return;
    }

    if (!formData.email || !formData.password) {
      toast.error('Email and password are required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/userAuth/login`,
        formData,
        {
          timeout: 15000,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      const { token: receivedToken, role, user: userData } = response.data;

      if (!receivedToken) {
        toast.error('Login failed: No authentication token received');
        setLoading(false);
        return;
      }

      const decodedUser = jwtDecode(receivedToken);

      setToken(receivedToken);
      setUser(decodedUser);

      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(decodedUser));

      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }

      toast.success(response.data.message || '✅ Login successful!', {
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
      });

      setTimeout(() => {
        navigateByRole(role || decodedUser.role);
      }, 1500);

    } catch (err) {
      console.error('Login error:', err);

      let errorMessage = 'Login failed. Please try again.';

      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please check your internet connection.';
      } else if (err.code === 'ERR_NETWORK') {
        errorMessage = 'Network error. Please check your connection.';
      } else if (err.response) {
        switch (err.response.status) {
          case 404:
            errorMessage = 'Account not found. Please check your email.';
            break;
          case 403:
            errorMessage = err.response.data?.message || 'Account is deactivated. Contact admin.';
            break;
          case 400:
            errorMessage = err.response.data?.message || 'Invalid email or password.';
            break;
          case 401:
            errorMessage = 'Invalid credentials. Please try again.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = err.response.data?.message || errorMessage;
        }
      } else if (err.request) {
        errorMessage = 'No response from server. Please try again.';
      }

      toast.error(errorMessage, { autoClose: 4000 });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (!isOnline) {
      toast.error('No internet connection. Please check your network.');
      return;
    }

    setGoogleLoading(true);
    window.location.href = `${API_BASE_URL}/userAuth/google`;
  };

  return (
    <Box sx={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <AppNavbar />

      {!isOnline && (
        <Alert
          severity="error"
          icon={<WifiOff />}
          sx={{
            position: 'fixed',
            top: 64,
            left: 0,
            right: 0,
            zIndex: 9999,
            borderRadius: 0,
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            border: '1px solid #fecaca'
          }}
        >
          No internet connection. Please check your network settings.
        </Alert>
      )}

      <Backdrop
        sx={{
          color: '#fff',
          zIndex: 1200,
          bgcolor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
        }}
        open={loading || redirecting}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} thickness={4} sx={{ color: '#10b981' }} />
          <Typography variant="h6" sx={{ mt: 2, color: '#fff', fontWeight: 600 }}>
            {redirecting ? 'Redirecting to dashboard...' : 'Signing you in...'}
          </Typography>
        </Box>
      </Backdrop>

      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
          pt: !isOnline ? 10 : 2,
        }}
      >
        <Container maxWidth="sm">
          <Fade in timeout={800}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                bgcolor: '#ffffff',
                borderRadius: 3,
                border: '1px solid rgba(16, 185, 129, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              }}
            >
              <Box component="form" onSubmit={handleLogin} noValidate>
                <Typography
                  variant="h4"
                  align="center"
                  gutterBottom
                  sx={{
                    color: '#0f172a',
                    mb: 2,
                    fontWeight: 700,
                  }}
                >
                  Welcome Back
                </Typography>

                <Typography
                  variant="body2"
                  align="center"
                  sx={{
                    color: '#475569',
                    mb: 4,
                    fontWeight: 500,
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
                        <User size={20} color="#10b981" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'rgba(16, 185, 129, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#10b981',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#10b981',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#475569',
                      '&.Mui-focused': {
                        color: '#10b981',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: '#0f172a',
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
                        <Lock size={20} color="#10b981" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={togglePassword}
                          edge="end"
                          sx={{ color: '#10b981' }}
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
                        borderColor: 'rgba(16, 185, 129, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#10b981',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#10b981',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#475569',
                      '&.Mui-focused': {
                        color: '#10b981',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: '#0f172a',
                    },
                  }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        sx={{
                          color: '#10b981',
                          '&.Mui-checked': {
                            color: '#10b981',
                          },
                        }}
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ color: '#475569', fontWeight: 500 }}>
                        Remember me
                      </Typography>
                    }
                  />

                  <Link
                    href="/forgot-password"
                    sx={{
                      color: '#10b981',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      fontWeight: 600,
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
                  disabled={loading || !isOnline}
                  sx={{
                    py: 1.5,
                    mb: 2,
                    fontSize: '1rem',
                    fontWeight: 700,
                    bgcolor: '#10b981',
                    color: '#fff',
                    '&:hover': {
                      bgcolor: '#059669',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(16, 185, 129, 0.3)',
                    },
                    '&:disabled': {
                      bgcolor: '#d1d5db',
                      color: '#9ca3af',
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

                <Divider sx={{ my: 3, backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                  <Typography variant="body2" sx={{ color: '#475569', px: 2, fontWeight: 500 }}>
                    OR
                  </Typography>
                </Divider>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleGoogleLogin}
                  disabled={googleLoading || loading || !isOnline}
                  sx={{
                    py: 1.5,
                    mb: 3,
                    fontSize: '1rem',
                    fontWeight: 600,
                    borderColor: 'rgba(16, 185, 129, 0.3)',
                    color: '#0f172a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                    '&:hover': {
                      borderColor: '#10b981',
                      bgcolor: 'rgba(16, 185, 129, 0.05)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)',
                    },
                    '&:disabled': {
                      borderColor: '#d1d5db',
                      color: '#9ca3af',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {googleLoading ? (
                    <>
                      <CircularProgress size={20} sx={{ color: '#10b981' }} />
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
                  <Typography variant="body2" sx={{ color: '#475569', fontWeight: 500 }}>
                    Don't have an account?{' '}
                    <Link
                      href="/register"
                      sx={{
                        color: '#10b981',
                        textDecoration: 'none',
                        fontWeight: 700,
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
                    color: '#6b7280',
                    fontSize: '0.75rem',
                    mt: 2,
                    fontWeight: 500,
                  }}
                >
                  By signing in, you agree to our{' '}
                  <Link
                    component={RouterLink}
                    to="/terms"
                    sx={{
                      color: '#10b981',
                      textDecoration: 'none',
                      fontWeight: 600,
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    component={RouterLink}
                    to="/privacy"
                    sx={{
                      color: '#10b981',
                      textDecoration: 'none',
                      fontWeight: 600,
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    Privacy Policy
                  </Link>
                  .
                </Typography>
              </Box>
            </Paper>
          </Fade>
        </Container>
      </Box>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Box>
  );
};

export default Login;