import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  CircularProgress,
  Alert,
  InputAdornment,
  Link,
} from '@mui/material';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://maziwasmart.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setAlert({ type: 'error', message: 'Email address is required' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setAlert({ type: 'error', message: 'Please enter a valid email address' });
      return;
    }

    setLoading(true);
    setAlert({ type: '', message: '' });

    try {
      const response = await axios.post(`${API_BASE_URL}/api/userAuth/forgot-password`, {
        email: email.trim()
      });

      setSuccess(true);
      setAlert({
        type: 'success',
        message: response.data.message || 'Password reset link sent to your email'
      });
      setEmail('');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send reset link. Please try again.';
      setAlert({ type: 'error', message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
            p: { xs: 4, sm: 5 },
            bgcolor: '#ffffff',
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}
        >
          {!success ? (
            <Box component="form" onSubmit={handleSubmit}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  mb: 3,
                }}
              >
                <Mail size={40} color="#ffffff" />
              </Box>

              <Typography
                variant="h4"
                align="center"
                sx={{
                  color: '#000000',
                  mb: 1,
                  fontWeight: 700,
                }}
              >
                Forgot Password?
              </Typography>

              <Typography
                variant="body1"
                align="center"
                sx={{
                  color: '#4a5568',
                  mb: 4,
                }}
              >
                No worries! Enter your email and we'll send you reset instructions.
              </Typography>

              {alert.message && (
                <Alert
                  severity={alert.type}
                  sx={{
                    mb: 3,
                    backgroundColor: alert.type === 'error' ? '#fee' : '#d4edda',
                    color: '#000000',
                    border: `2px solid ${alert.type === 'error' ? '#f87171' : '#4ade80'}`,
                    borderRadius: 2,
                    '& .MuiAlert-icon': {
                      color: alert.type === 'error' ? '#f87171' : '#4ade80',
                    },
                  }}
                  onClose={() => setAlert({ type: '', message: '' })}
                >
                  {alert.message}
                </Alert>
              )}

              <TextField
                fullWidth
                type="email"
                name="email"
                label="Email Address"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail size={22} color="#667eea" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#cbd5e0',
                      borderWidth: 2,
                    },
                    '&:hover fieldset': {
                      borderColor: '#667eea',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#667eea',
                      borderWidth: 2,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#4a5568',
                    fontWeight: 600,
                    '&.Mui-focused': {
                      color: '#667eea',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: '#000000',
                    fontSize: '1rem',
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  py: 1.8,
                  mb: 3,
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#ffffff',
                  borderRadius: 2,
                  textTransform: 'none',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #653a8b 100%)',
                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                  },
                  '&:disabled': {
                    background: '#cbd5e0',
                    color: '#000000',
                  },
                }}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={22} sx={{ color: '#ffffff' }} />
                    Sending...
                  </Box>
                ) : (
                  'Send Reset Link'
                )}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Link
                  onClick={() => navigate('/login')}
                  sx={{
                    color: '#667eea',
                    textDecoration: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.5,
                    '&:hover': {
                      color: '#764ba2',
                    },
                  }}
                >
                  <ArrowLeft size={18} />
                  Back to Login
                </Link>
              </Box>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  mb: 3,
                  boxShadow: '0 10px 30px rgba(34, 197, 94, 0.3)',
                }}
              >
                <CheckCircle size={50} color="#ffffff" />
              </Box>

              <Typography
                variant="h5"
                sx={{
                  color: '#000000',
                  mb: 2,
                  fontWeight: 700,
                }}
              >
                Check Your Email
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: '#4a5568',
                  mb: 4,
                }}
              >
                We've sent a password reset link to your email. Check your inbox and follow the instructions.
              </Typography>

              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate('/login')}
                sx={{
                  py: 1.8,
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#ffffff',
                  borderRadius: 2,
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5568d3 0%, #653a8b 100%)',
                  },
                }}
              >
                Return to Login
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default ForgotPassword;