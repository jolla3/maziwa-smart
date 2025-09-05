// src/components/Login.jsx
import React, { useState, useContext } from 'react';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AppNavbar from '../../components/AppNavbar';
import { AuthContext } from '../../components/PrivateComponents/AuthContext';
import { jwtDecode } from 'jwt-decode'; // ✅ Import jwtDecode
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
  useTheme
} from '@mui/material';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  // ✅ Get setUser from context
  const { setUser, setToken } = useContext(AuthContext);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        'https://maziwasmart.onrender.com/api/userAuth/login',
        formData
      );

      const { token } = response.data;
      const decodedUser = jwtDecode(token); // ✅ Decode the token

      // ✅ Save to localStorage and set context state for both token and user
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(decodedUser));
      setToken(token);
      setUser(decodedUser);

      toast.success('Login successful!', { autoClose: 1000 });

      // ✅ Navigate based on the user's role from the decoded token
      setTimeout(() => {
        const role = decodedUser.role;

        if (role === 'admin') navigate('/admindashboard');
        else if (role === 'porter') navigate('/porterdashboard');
        else if (role === 'farmer') navigate('/farmerdashboard');
        else navigate('/'); // Fallback
      }, 1200);
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      toast.error(msg);
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
            <Box component="form" onSubmit={handleLogin} noValidate>
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
                User Login
              </Typography>

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
                    Logging in...
                  </Box>
                ) : (
                  'Login'
                )}
              </Button>

              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Don't have an account?{' '}
                  <Link
                    href="/register"
                    sx={{
                      color: theme.palette.secondary.main,
                      textDecoration: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Register
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
                By logging in, you agree to our terms.
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