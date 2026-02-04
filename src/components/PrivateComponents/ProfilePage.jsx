import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../PrivateComponents/AuthContext';
import {
  Container,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  Chip,
  Stack,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Logout as LogoutIcon,
  PhotoCamera as CameraIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Shield as ShieldIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';

const API_BASE = process.env.REACT_APP_API_BASE 
const roleColors = {
  farmer: '#10b981',
  seller: '#f59e0b',
  buyer: '#3b82f6',
  admin: '#ef4444',
  broker: '#8b5cf6',
  manager: '#06b6d4',
  porter: '#ec4899',
};

export default function ProfilePage() {
  const { token, user, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_BASE}/userAuth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      setProfile(data.profile);
      setFormData(data.profile);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${API_BASE}/userAuth/update-profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Update failed');
      const data = await response.json();
      setProfile(data.profile);
      setEditing(false);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${roleColors.farmer} 0%, ${roleColors.seller} 50%, ${roleColors.buyer} 100%)`,
        }}
      >
        <CircularProgress size={60} sx={{ color: '#fff' }} />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${roleColors.farmer} 0%, ${roleColors.buyer} 100%)`,
          p: 2,
        }}
      >
        <Typography variant="h5" sx={{ color: '#fff', textAlign: 'center' }}>
          {error || 'Profile not found'}
        </Typography>
      </Box>
    );
  }

  const roleColor = roleColors[user?.role] || roleColors.farmer;
  const displayName = profile.fullname || profile.username || 'User';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, #f0f9ff 0%, #f0fdf4 50%, #fef3c7 100%)`,
        py: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Container maxWidth="lg">
        {/* Header with Logout */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              background: `linear-gradient(135deg, ${roleColor} 0%, #000 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            My Profile
          </Typography>
          <Button
            onClick={logout}
            variant="contained"
            endIcon={<LogoutIcon />}
            sx={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: '#fff',
              fontWeight: 700,
              px: 3,
              py: 1.5,
              borderRadius: 3,
              textTransform: 'none',
              fontSize: '1rem',
              boxShadow: '0 8px 16px rgba(239, 68, 68, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                boxShadow: '0 12px 24px rgba(239, 68, 68, 0.4)',
              },
            }}
          >
            Logout
          </Button>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2,
              fontSize: '1rem',
              fontWeight: 600,
              backgroundColor: '#fee2e2',
              color: '#991b1b',
              border: '2px solid #fca5a5',
            }}
          >
            {error}
          </Alert>
        )}

        {/* Main Profile Card */}
        <Card
          sx={{
            background: '#fff',
            borderRadius: 4,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            border: `3px solid ${roleColor}`,
          }}
        >
          {/* Hero Section */}
          <Box
            sx={{
              height: { xs: 150, sm: 200, md: 250 },
              background: `linear-gradient(135deg, ${roleColor} 0%, ${roleColor}dd 50%, #000 100%)`,
              position: 'relative',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'flex-start',
              p: { xs: 2, sm: 3, md: 4 },
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                bottom: { xs: -30, sm: -40, md: -50 },
                left: { xs: 16, sm: 24, md: 32 },
              }}
            >
              <Avatar
                src={profile.photo}
                sx={{
                  width: { xs: 100, sm: 120, md: 160 },
                  height: { xs: 100, sm: 120, md: 160 },
                  border: '5px solid #fff',
                  boxShadow: '0 16px 32px rgba(0, 0, 0, 0.2)',
                  fontSize: '3rem',
                  background: `linear-gradient(135deg, ${roleColor} 0%, #000 100%)`,
                }}
              >
                <PersonIcon sx={{ fontSize: '4rem', color: '#fff' }} />
              </Avatar>
              {editing && (
                <Button
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    backgroundColor: roleColor,
                    color: '#fff',
                    borderRadius: '50%',
                    minWidth: 50,
                    minHeight: 50,
                    p: 1,
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                    '&:hover': { backgroundColor: roleColor + 'dd' },
                  }}
                >
                  <CameraIcon />
                </Button>
              )}
            </Box>
          </Box>

          {/* Content Section */}
          <CardContent sx={{ pt: { xs: 8, sm: 10, md: 12 }, pb: 4 }}>
            {/* Name & Role */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
              <Box>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 900,
                    color: '#000',
                    mb: 1,
                    fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' },
                  }}
                >
                  {displayName}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <ShieldIcon sx={{ color: roleColor, fontSize: 24 }} />
                  <Chip
                    label={user?.role?.toUpperCase()}
                    sx={{
                      background: `linear-gradient(135deg, ${roleColor} 0%, ${roleColor}dd 100%)`,
                      color: '#fff',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      height: 'auto',
                      py: 1,
                      px: 2,
                    }}
                  />
                </Stack>
              </Box>

              {/* Edit/Save Buttons */}
              {!editing ? (
                <Button
                  onClick={() => setEditing(true)}
                  variant="contained"
                  startIcon={<EditIcon />}
                  sx={{
                    background: `linear-gradient(135deg, ${roleColor} 0%, #000 100%)`,
                    color: '#fff',
                    fontWeight: 800,
                    px: { xs: 2, sm: 3 },
                    py: 1.5,
                    borderRadius: 3,
                    textTransform: 'none',
                    fontSize: '1rem',
                    boxShadow: `0 8px 16px rgba(0, 0, 0, 0.2)`,
                    '&:hover': {
                      boxShadow: `0 12px 24px rgba(0, 0, 0, 0.3)`,
                    },
                  }}
                >
                  Edit Profile
                </Button>
              ) : (
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                  <Button
                    onClick={handleSave}
                    variant="contained"
                    startIcon={<SaveIcon />}
                    sx={{
                      background: `linear-gradient(135deg, #10b981 0%, #059669 100%)`,
                      color: '#fff',
                      fontWeight: 800,
                      px: 3,
                      py: 1.5,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontSize: '1rem',
                      boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)',
                      '&:hover': {
                        boxShadow: '0 12px 24px rgba(16, 185, 129, 0.4)',
                      },
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => {
                      setEditing(false);
                      setFormData(profile);
                    }}
                    variant="outlined"
                    startIcon={<CloseIcon />}
                    sx={{
                      borderColor: '#000',
                      color: '#000',
                      fontWeight: 800,
                      px: 3,
                      py: 1.5,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontSize: '1rem',
                      border: '2px solid',
                      '&:hover': {
                        backgroundColor: '#f3f4f6',
                      },
                    }}
                  >
                    Cancel
                  </Button>
                </Stack>
              )}
            </Box>

            <Divider sx={{ my: 3, backgroundColor: '#e5e7eb', height: 2 }} />

            {/* Info Grid */}
            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
              {/* Email */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, backgroundColor: '#f0f9ff', borderRadius: 2, border: '2px solid #0ea5e9' }}>
                  <Stack direction="row" spacing={1} sx={{ mb: 1.5, alignItems: 'center' }}>
                    <EmailIcon sx={{ color: '#0ea5e9', fontSize: 28 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#000', fontSize: '1.1rem' }}>
                      Email
                    </Typography>
                  </Stack>
                  {editing ? (
                    <TextField
                      name="email"
                      value={formData.email || ''}
                      onChange={handleInputChange}
                      disabled
                      fullWidth
                      sx={{
                        '& .MuiInputBase-root': {
                          backgroundColor: '#e0f2fe',
                          borderRadius: 1.5,
                          color: '#000',
                        },
                      }}
                    />
                  ) : (
                    <Typography sx={{ fontWeight: 900, color: '#000', fontSize: '1rem' }}>
                      {profile.email || 'Not provided'}
                    </Typography>
                  )}
                </Box>
              </Grid>

              {/* Phone */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, backgroundColor: '#fef2f2', borderRadius: 2, border: '2px solid #f87171' }}>
                  <Stack direction="row" spacing={1} sx={{ mb: 1.5, alignItems: 'center' }}>
                    <PhoneIcon sx={{ color: '#f87171', fontSize: 28 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#000', fontSize: '1.1rem' }}>
                      Phone
                    </Typography>
                  </Stack>
                  {editing ? (
                    <TextField
                      name="phone"
                      value={formData.phone || ''}
                      onChange={handleInputChange}
                      fullWidth
                      placeholder="Enter phone number"
                      sx={{
                        '& .MuiInputBase-root': {
                          backgroundColor: '#fee2e2',
                          borderRadius: 1.5,
                          color: '#000',
                        },
                        '& .MuiInputBase-input::placeholder': {
                          color: '#999',
                          opacity: 0.7,
                        },
                      }}
                    />
                  ) : (
                    <Typography sx={{ fontWeight: 700, color: '#000', fontSize: '1rem' }}>
                      {profile.phone || 'Not provided'}
                    </Typography>
                  )}
                </Box>
              </Grid>

              {/* Location */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, backgroundColor: '#f0fdf4', borderRadius: 2, border: '2px solid #10b981' }}>
                  <Stack direction="row" spacing={1} sx={{ mb: 1.5, alignItems: 'center' }}>
                    <LocationIcon sx={{ color: '#10b981', fontSize: 28 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#000', fontSize: '1.1rem' }}>
                      Location
                    </Typography>
                  </Stack>
                  {editing ? (
                    <TextField
                      name="location"
                      value={formData.location || ''}
                      onChange={handleInputChange}
                      fullWidth
                      placeholder="Enter location"
                      sx={{
                        '& .MuiInputBase-root': {
                          backgroundColor: '#dcfce7',
                          borderRadius: 1.5,
                          color: '#000',
                        },
                        '& .MuiInputBase-input::placeholder': {
                          color: '#999',
                          opacity: 0.7,
                        },
                      }}
                    />
                  ) : (
                    <Typography sx={{ fontWeight: 700, color: '#000', fontSize: '1rem' }}>
                      {profile.location || 'Not provided'}
                    </Typography>
                  )}
                </Box>
              </Grid>

              {/* Full Name / Username */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2, backgroundColor: '#faf5ff', borderRadius: 2, border: '2px solid #a78bfa' }}>
                  <Stack direction="row" spacing={1} sx={{ mb: 1.5, alignItems: 'center' }}>
                    <PersonIcon sx={{ color: '#a78bfa', fontSize: 28 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#000', fontSize: '1.1rem' }}>
                      {user?.role === 'farmer' ? 'Full Name' : 'Username'}
                    </Typography>
                  </Stack>
                  {editing ? (
                    <TextField
                      name={user?.role === 'farmer' ? 'fullname' : 'username'}
                      value={user?.role === 'farmer' ? (formData.fullname || '') : (formData.username || '')}
                      onChange={handleInputChange}
                      fullWidth
                      placeholder="Enter name"
                      sx={{
                        '& .MuiInputBase-root': {
                          backgroundColor: '#f3e8ff',
                          borderRadius: 1.5,
                          color: '#000',
                        },
                        '& .MuiInputBase-input::placeholder': {
                          color: '#999',
                          opacity: 0.7,
                        },
                      }}
                    />
                  ) : (
                    <Typography sx={{ fontWeight: 700, color: '#000', fontSize: '1rem' }}>
                      {profile.fullname || profile.username || 'Not provided'}
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>

            {/* Footer */}
            <Divider sx={{ my: 3, backgroundColor: '#e5e7eb', height: 2 }} />
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', color: '#666', fontSize: '0.95rem', fontWeight: 600 }}>
              <TimeIcon sx={{ fontSize: 20 }} />
              <Typography>
                Account created: {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Unknown'}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}