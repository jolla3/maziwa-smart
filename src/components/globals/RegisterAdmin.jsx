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
  useTheme
} from '@mui/material';
import { User, Phone, Mail, Eye, EyeOff, Lock } from 'lucide-react';

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const theme = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setAlert({ type: '', message: '' });

    try {
      await axios.post('https://maziwasmart.onrender.com/api/userAuth/register', {
        ...formData
      });

      setAlert({ type: 'success', message: 'Admin registered successfully!' });
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setAlert({ type: 'error', message: error.response?.data?.message || 'Something went wrong!' });
    } finally {
      setLoading(false);
    }
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
                variant="h2" 
                align="center" 
                gutterBottom
                sx={{ 
                  color: 'text.primary',
                  mb: 4,
                  fontWeight: 600,
                }}
              >
                Register Admin
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
                >
                  {alert.message}
                </Alert>
              )}

              <TextField
                fullWidth
                type="text"
                name="username"
                label="Full Name"
                placeholder="Full Name"
                value={formData.username}
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
                      borderColor: theme.palette.secondary.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.secondary.main,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    '&.Mui-focused': {
                      color: theme.palette.secondary.main,
                    },
                  },
                }}
              />

              <TextField
                fullWidth
                type="tel"
                name="phone"
                label="Phone Number"
                placeholder="Phone Number"
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
                      borderColor: theme.palette.secondary.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.secondary.main,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    '&.Mui-focused': {
                      color: theme.palette.secondary.main,
                    },
                  },
                }}
              />

              <TextField
                fullWidth
                type="email"
                name="email"
                label="Email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
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
                      borderColor: theme.palette.secondary.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.secondary.main,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    '&.Mui-focused': {
                      color: theme.palette.secondary.main,
                    },
                  },
                }}
              />

              <TextField
                fullWidth
                type={showPassword ? 'text' : 'password'}
                name="password"
                label="Password"
                placeholder="Password"
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
                      borderColor: theme.palette.secondary.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.secondary.main,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    '&.Mui-focused': {
                      color: theme.palette.secondary.main,
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
                  mb: 3,
                  fontSize: '1rem',
                  fontWeight: 600,
                  bgcolor: theme.palette.secondary.main,
                  '&:hover': {
                    bgcolor: theme.palette.secondary.dark,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 6px 20px ${theme.palette.secondary.main}40`,
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
                    Registering...
                  </Box>
                ) : (
                  'Register'
                )}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    sx={{
                      color: theme.palette.secondary.main,
                      textDecoration: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Login
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

export default AdminRegister;