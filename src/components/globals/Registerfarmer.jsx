import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AppNavbar from '../AppNavbar';
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
  useTheme
} from '@mui/material';
import { User, Phone, Mail, Eye, EyeOff, Lock, MapPin, Image } from 'lucide-react';

const FarmerRegister = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    phone: '',
    email: '',
    password: '',
    location: '',
    photo: '',
    farmer_code: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const theme = useTheme();
  const navigate = useNavigate();

  // API Base URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://maziwasmart.onrender.com';

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.fullname || !formData.phone || !formData.password) {
      setAlert({ type: 'error', message: 'Full name, phone, and password are required!' });
      return;
    }

    // Email validation (optional field)
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setAlert({ type: 'error', message: 'Please enter a valid email address!' });
        return;
      }
    }

    // Phone validation
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(formData.phone)) {
      setAlert({ type: 'error', message: 'Please enter a valid phone number!' });
      return;
    }

    // Password strength validation
    if (formData.password.length < 6) {
      setAlert({ type: 'error', message: 'Password must be at least 6 characters long!' });
      return;
    }

    setLoading(true);
    setAlert({ type: '', message: '' });

    try {
      // Prepare payload - only send fields that have values
      const payload = {
        fullname: formData.fullname,
        phone: formData.phone,
        password: formData.password,
      };

      // Add optional fields if provided
      if (formData.email) payload.email = formData.email;
      if (formData.location) payload.location = formData.location;
      if (formData.photo) payload.photo = formData.photo;
      if (formData.farmer_code) payload.farmer_code = formData.farmer_code;

      const response = await axios.post(`${API_BASE_URL}/api/userAuth/register/farmer`, payload);

      setAlert({ 
        type: 'success', 
        message: response.data.message || 'Farmer account created successfully!' 
      });

      // Clear form
      setFormData({
        fullname: '',
        phone: '',
        email: '',
        password: '',
        location: '',
        photo: '',
        farmer_code: ''
      });

      // Redirect to login after 2 seconds
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
    // Redirect to backend Google OAuth route for farmers
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
            <Box component="form" onSubmit={handleSubmit} noValidate>
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
                Register as Farmer
              </Typography>

              <Typography 
                variant="body2" 
                align="center" 
                sx={{ 
                  color: 'text.secondary',
                  mb: 4,
                }}
              >
                Join MaziWaSmart farming community
              </Typography>

              {alert.message && (
                <Alert 
                  severity={alert.type === 'error' ? 'error' : 'success'}
                  sx={{ 
                    mb: 3,
                    '& .MuiAlert-message': {
                      fontWeight: 500,
                    }
                  }}
                  onClose={() => setAlert({ type: '', message: '' })}
                >
                  {alert.message}
                </Alert>
              )}

              <TextField
                fullWidth
                type="text"
                name="fullname"
                label="Full Name"
                placeholder="Enter your full name"
                value={formData.fullname}
                onChange={handleChange}
                required
                margin="normal"
                variant="outlined"
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
                type="tel"
                name="phone"
                label="Phone Number"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                required
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone size={20} color={theme.palette.text.secondary} />
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
                type="email"
                name="email"
                label="Email (Optional)"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail size={20} color={theme.palette.text.secondary} />
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
                type="text"
                name="location"
                label="Location (Optional)"
                placeholder="Enter your location"
                value={formData.location}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MapPin size={20} color={theme.palette.text.secondary} />
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
                type="text"
                name="farmer_code"
                label="Farmer Code (Optional)"
                placeholder="Enter farmer code if you have one"
                value={formData.farmer_code}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
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
                type="text"
                name="photo"
                label="Photo URL (Optional)"
                placeholder="Enter photo URL"
                value={formData.photo}
                onChange={handleChange}
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Image size={20} color={theme.palette.text.secondary} />
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
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={20} color={theme.palette.text.secondary} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(prev => !prev)}
                        edge="end"
                        sx={{ color: theme.palette.text.secondary }}
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
                    Creating Farmer Account...
                  </Box>
                ) : (
                  'Register as Farmer'
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
                onClick={handleGoogleSignup}
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
                    <span>Sign up with Google</span>
                  </>
                )}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    sx={{
                      color: theme.palette.primary.main,
                      textDecoration: 'none',
                      fontWeight: 600,
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
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  By signing up, you agree to our{' '}
                  <Link
                    href="/terms"
                    sx={{
                      color: theme.palette.primary.main,
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
                      color: theme.palette.primary.main,
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
        </Container>
      </Box>
    </Box>
  );
};

export default FarmerRegister;