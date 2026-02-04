import React, { useState } from 'react';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import AppNavbar from '../../scenes/AppNavbar';
import { toast } from 'react-toastify';
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
  Alert,
  Divider,
  Fade,
} from '@mui/material';
import { User, Phone, Mail, Eye, EyeOff, Lock } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_BASE;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      setAlert({ type: 'error', message: 'Username, email, and password are required!' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setAlert({ type: 'error', message: 'Please enter a valid email address!' });
      return;
    }

    if (formData.password.length < 6) {
      setAlert({ type: 'error', message: 'Password must be at least 6 characters long!' });
      return;
    }

    setLoading(true);
    setAlert({ type: '', message: '' });

    try {
      const response = await axios.post(`${API_BASE_URL}/userAuth/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined
      });

      setAlert({
        type: 'success',
        message: response.data.message || 'Account created successfully!'
      });

      setFormData({
        username: '',
        phone: '',
        email: '',
        password: ''
      });

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setAlert({ type: 'error', message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    setGoogleLoading(true);
    window.location.href = `${API_BASE_URL}/userAuth/google`;
  };

  return (
    <Box sx={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <AppNavbar />
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
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
              <Box component="form" onSubmit={handleSubmit} noValidate>
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
                  Create Account
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
                  Join MaziWaSmart today
                </Typography>

                {alert.message && (
                  <Alert
                    severity={alert.type === 'error' ? 'error' : 'success'}
                    sx={{
                      mb: 3,
                      '& .MuiAlert-message': {
                        fontWeight: 500,
                        color: alert.type === 'error' ? '#991b1b' : '#166534',
                      },
                      backgroundColor: alert.type === 'error' ? '#fee2e2' : '#dcfce7',
                      border: `1px solid ${alert.type === 'error' ? '#fecaca' : '#bbf7d0'}`,
                    }}
                    onClose={() => setAlert({ type: '', message: '' })}
                  >
                    {alert.message}
                  </Alert>
                )}

                <TextField
                  fullWidth
                  type="text"
                  name="username"
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  margin="normal"
                  variant="outlined"
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
                  type="tel"
                  name="phone"
                  label="Phone Number (Optional)"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone size={20} color="#10b981" />
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
                  type="email"
                  name="email"
                  label="Email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail size={20} color="#10b981" />
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
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock size={20} color="#10b981" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(prev => !prev)}
                          edge="end"
                          sx={{ color: '#10b981' }}
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 3,
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

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
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
                      Creating Account...
                    </Box>
                  ) : (
                    'Create Account'
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
                  onClick={handleGoogleSignup}
                  disabled={googleLoading || loading}
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
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      <span>Sign up with Google</span>
                    </>
                  )}
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#475569', fontWeight: 500 }}>
                    Already have an account?{' '}
                    <Link
                      href="/login"
                      sx={{
                        color: '#10b981',
                        textDecoration: 'none',
                        fontWeight: 700,
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Sign In
                    </Link>
                  </Typography>
                </Box>

                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 500 }}>
                    By signing up, you agree to our{' '}
                    <Link
                      href="/terms"
                      sx={{
                        color: '#10b981',
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link
                      href="/privacy"
                      sx={{
                        color: '#10b981',
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Privacy Policy
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Fade>
        </Container>
      </Box>
    </Box>
  );
};

export default Register;