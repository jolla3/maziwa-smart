import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../PrivateComponents/AuthContext';
import AppNavbar from '../../scenes/AppNavbar';
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
  Fade
} from '@mui/material';
import { User, Phone, Mail, Eye, EyeOff, Lock, Store } from 'lucide-react';

const SellerRegister = () => {
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
  const { setToken, setUser } = useContext(AuthContext);

  const API_BASE_URL = process.env.REACT_APP_API_BASE;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      setAlert({ type: 'error', message: 'Business name, email, and password are required!' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setAlert({ type: 'error', message: 'Please enter a valid email address!' });
      return;
    }

    if (formData.phone) {
      const phoneRegex = /^[0-9+\-\s()]+$/;
      if (!phoneRegex.test(formData.phone)) {
        setAlert({ type: 'error', message: 'Please enter a valid phone number!' });
        return;
      }
    }

    if (formData.password.length < 6) {
      setAlert({ type: 'error', message: 'Password must be at least 6 characters long!' });
      return;
    }

    setLoading(true);
    setAlert({ type: '', message: '' });

    try {
      const response = await axios.post(`${API_BASE_URL}/userAuth/register/seller`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || ""
      });

      setAlert({
        type: 'success',
        message: response.data.message || 'Seller account created successfully! Awaiting admin approval.'
      });

      setFormData({
        username: '',
        phone: '',
        email: '',
        password: ''
      });

      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setAlert({ type: 'error', message: errorMessage })
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    setGoogleLoading(true);
    window.location.href = `${API_BASE_URL}/userAuth/google?role=seller`;
  };

  return (
    <Box>
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
              elevation={4}
              sx={{
                p: 4,
                bgcolor: '#ffffff',
                borderRadius: 3,
                border: '1px solid #e5e5e5',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              }}
            >
              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      backgroundColor: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Store size={30} color="white" />
                  </Box>
                </Box>

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
                  Register as Seller
                </Typography>

                <Typography
                  variant="body2"
                  align="center"
                  sx={{
                    color: '#0f172a',
                    mb: 4,
                    fontSize: '1rem',
                  }}
                >
                  Start selling on MaziWaSmart today
                </Typography>

                {alert.message && (
                  <Alert
                    severity={alert.type === 'error' ? 'error' : 'success'}
                    sx={{
                      mb: 3,
                      backgroundColor: alert.type === 'error' ? '#fee2e2' : '#dcfce7',
                      color: alert.type === 'error' ? '#991b1b' : '#166534',
                      '& .MuiAlert-message': {
                        fontWeight: 500,
                      }
                    }}
                    onClose={() => setAlert({ type: '', message: '' })}
                  >
                    {alert.message}
                  </Alert>
                )}

                <Alert
                  severity="info"
                  sx={{
                    mb: 3,
                    backgroundColor: '#dbeafe',
                    color: '#1e40af',
                    '& .MuiAlert-message': {
                      fontSize: '0.875rem',
                    }
                  }}
                >
                  Your seller account will require admin approval before you can start selling.
                </Alert>

                <TextField
                  fullWidth
                  type="text"
                  name="username"
                  label="Business/Store Name"
                  placeholder="Enter your business or store name"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <User size={20} color="#0f172a" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      color: '#0f172a',
                      '& fieldset': {
                        borderColor: '#d1d5db',
                      },
                      '&:hover fieldset': {
                        borderColor: '#10b981',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#10b981',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#0f172a',
                      '&.Mui-focused': {
                        color: '#10b981',
                      },
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
                        <Phone size={20} color="#0f172a" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      color: '#0f172a',
                      '& fieldset': {
                        borderColor: '#d1d5db',
                      },
                      '&:hover fieldset': {
                        borderColor: '#10b981',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#10b981',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#0f172a',
                      '&.Mui-focused': {
                        color: '#10b981',
                      },
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
                        <Mail size={20} color="#0f172a" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      color: '#0f172a',
                      '& fieldset': {
                        borderColor: '#d1d5db',
                      },
                      '&:hover fieldset': {
                        borderColor: '#10b981',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#10b981',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#0f172a',
                      '&.Mui-focused': {
                        color: '#10b981',
                      },
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
                        <Lock size={20} color="#0f172a" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(prev => !prev)}
                          edge="end"
                          sx={{ color: '#0f172a' }}
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      color: '#0f172a',
                      '& fieldset': {
                        borderColor: '#d1d5db',
                      },
                      '&:hover fieldset': {
                        borderColor: '#10b981',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#10b981',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#0f172a',
                      '&.Mui-focused': {
                        color: '#10b981',
                      },
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
                    backgroundColor: '#10b981',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#059669',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(16, 185, 129, 0.3)',
                    },
                    '&:disabled': {
                      backgroundColor: '#d1d5db',
                      color: '#9ca3af',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {loading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={20} color="inherit" />
                      Creating Seller Account...
                    </Box>
                  ) : (
                    'Register as Seller'
                  )}
                </Button>

                <Divider sx={{ my: 3, borderColor: '#e5e5e5' }}>
                  <Typography variant="body2" sx={{ color: '#0f172a', px: 2 }}>
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
                    fontWeight: 700,
                    borderColor: '#d1d5db',
                    color: '#0f172a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                    border: '1px solid #d1d5db',
                    '&:hover': {
                      borderColor: '#10b981',
                      backgroundColor: '#f0fdfa',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.1)',
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
                      <CircularProgress size={20} />
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
                      <span>Sign up with Google as Seller</span>
                    </>
                  )}
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#0f172a' }}>
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

                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#0f172a' }}>
                    Want to register as a farmer?{' '}
                    <Link
                      href="/register_farmer"
                      sx={{
                        color: '#10b981',
                        textDecoration: 'none',
                        fontWeight: 700,
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Register here
                    </Link>
                  </Typography>
                </Box>

                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#0f172a', fontSize: '0.75rem' }}>
                    By signing up, you agree to our{' '}
                    <Link
                      href="/terms"
                      sx={{
                        color: '#10b981',
                        textDecoration: 'none',
                        fontWeight: 700,
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
                        fontWeight: 700,
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

export default SellerRegister;