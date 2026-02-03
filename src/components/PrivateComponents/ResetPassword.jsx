import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  IconButton,
  Link,
} from '@mui/material';
import { Lock, Eye, EyeOff, CheckCircle, ShieldCheck } from 'lucide-react';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [token, setToken] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://maziwasmart.onrender.com';

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const resetToken = params.get('token');

    if (!resetToken) {
      setAlert({
        type: 'error',
        message: 'Invalid or missing reset token. Please request a new password reset link.',
      });
    } else {
      setToken(resetToken);
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.newPassword || !formData.confirmPassword) {
      setAlert({ type: 'error', message: 'Please fill in all fields' });
      return;
    }

    if (formData.newPassword.length < 8) {
      setAlert({ type: 'error', message: 'Password must be at least 8 characters long' });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setAlert({ type: 'error', message: 'Passwords do not match' });
      return;
    }

    if (!token) {
      setAlert({ type: 'error', message: 'Invalid reset token' });
      return;
    }

    setLoading(true);
    setAlert({ type: '', message: '' });

    try {
      const response = await axios.post(`${API_BASE_URL}/api/userAuth/reset-password`, {
        token,
        newPassword: formData.newPassword,
      });

      setSuccess(true);
      setAlert({
        type: 'success',
        message: response.data.message || 'Password reset successful!'
      });

      setFormData({
        newPassword: '',
        confirmPassword: '',
      });

      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to reset password. Please try again.';
      setAlert({ type: 'error', message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
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
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  mb: 3,
                }}
              >
                <ShieldCheck size={40} color="#ffffff" />
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
                Reset Your Password
              </Typography>

              <Typography
                variant="body1"
                align="center"
                sx={{
                  color: '#4a5568',
                  mb: 4,
                }}
              >
                Create a new secure password for your account
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
                type={showPassword ? 'text' : 'password'}
                name="newPassword"
                label="New Password"
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={handleChange}
                required
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={22} color="#f093fb" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(prev => !prev)}
                        edge="end"
                      >
                        {showPassword ? <EyeOff size={22} color="#f5576c" /> : <Eye size={22} color="#f5576c" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#cbd5e0',
                      borderWidth: 2,
                    },
                    '&:hover fieldset': {
                      borderColor: '#f093fb',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#f093fb',
                      borderWidth: 2,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#4a5568',
                    fontWeight: 600,
                    '&.Mui-focused': {
                      color: '#f093fb',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: '#000000',
                  },
                }}
              />

              <TextField
                fullWidth
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                label="Confirm New Password"
                placeholder="Re-enter new password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={22} color="#f093fb" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(prev => !prev)}
                        edge="end"
                      >
                        {showConfirmPassword ? <EyeOff size={22} color="#f5576c" /> : <Eye size={22} color="#f5576c" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 1,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#cbd5e0',
                      borderWidth: 2,
                    },
                    '&:hover fieldset': {
                      borderColor: '#f093fb',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#f093fb',
                      borderWidth: 2,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#4a5568',
                    fontWeight: 600,
                    '&.Mui-focused': {
                      color: '#f093fb',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: '#000000',
                  },
                }}
              />

              <Typography
                variant="caption"
                sx={{
                  color: '#3b82f6',
                  display: 'block',
                  mb: 3,
                  fontWeight: 600,
                }}
              >
                ✓ Password must be at least 8 characters long
              </Typography>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading || !token}
                sx={{
                  py: 1.8,
                  mb: 3,
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: '#ffffff',
                  borderRadius: 2,
                  textTransform: 'none',
                  boxShadow: '0 4px 15px rgba(240, 147, 251, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #e082ea 0%, #e4465b 100%)',
                    boxShadow: '0 6px 20px rgba(240, 147, 251, 0.6)',
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
                    Resetting...
                  </Box>
                ) : (
                  'Reset Password'
                )}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Link
                  onClick={() => navigate('/login')}
                  sx={{
                    color: '#f093fb',
                    textDecoration: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    '&:hover': {
                      color: '#f5576c',
                    },
                  }}
                >
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
                Password Reset Successful!
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: '#4a5568',
                  mb: 4,
                }}
              >
                Your password has been reset successfully. You can now log in with your new password.
              </Typography>

              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate('/login')}
                sx={{
                  py: 1.8,
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: '#ffffff',
                  borderRadius: 2,
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #e082ea 0%, #e4465b 100%)',
                  },
                }}
              >
                Go to Login
              </Button>

              <Typography
                variant="body2"
                sx={{
                  color: '#3b82f6',
                  mt: 2,
                  fontWeight: 600,
                }}
              >
                Redirecting in 3 seconds...
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default ResetPassword;