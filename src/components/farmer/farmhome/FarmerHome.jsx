// farmhome/FarmerHome.jsx
import React, { useContext } from 'react';
import {
  Box,
  Container,
  CircularProgress,
  Alert,
  AlertTitle,
  Fade,
  Grow,
  Grid,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import { RefreshCw, WifiOff } from 'lucide-react';
import { AuthContext } from '../../PrivateComponents/AuthContext';
import useDashboardData from './hooks/useDashboardData';
import WelcomeHero from './components/WelcomeHero';
import QuickLinks from './components/QuickLinks';
import ServicesOverview from './components/ServicesOverview';
import StatsSection from './components/StatsSection';
import RecentActivities from './components/RecentActivities';
import ManagersSection from './components/ManagersSection';
import Footer from './components/Footer';
import { COLORS } from './utils/constants';

const FarmerHome = () => {
  const { token, user } = useContext(AuthContext);
  const { data, loading, error, refresh, isOffline } = useDashboardData(token);

  // Loading state
  if (loading && !data) {
    return (
      <Container maxWidth="xl" disableGutters sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 4 }}>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <CircularProgress
            size={60}
            thickness={4}
            sx={{
              color: COLORS.aqua.main,
              mb: 3,
            }}
          />
          <Box sx={{ fontSize: '1.1rem', color: '#666666', fontWeight: 600 }}>
            Loading your dashboard...
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <Container
        maxWidth="xl"
        disableGutters
        sx={{
          px: { xs: 2, sm: 3, md: 4 },
          py: 4,
        }}
      >
        {/* Offline Banner */}
        {isOffline && (
          <Fade in timeout={500}>
            <Box mb={3}>
              <Alert
                severity="warning"
                icon={<WifiOff size={20} />}
                sx={{
                  backgroundColor: `${COLORS.orange.main}15`,
                  border: `2px solid ${COLORS.orange.main}40`,
                  borderRadius: '12px',
                  '& .MuiAlert-message': {
                    color: '#000000',
                    fontWeight: 600,
                  },
                }}
              >
                <AlertTitle sx={{ fontWeight: 700, color: '#000000' }}>
                  Offline Mode
                </AlertTitle>
                You're currently offline. Showing cached data.
              </Alert>
            </Box>
          </Fade>
        )}

        {/* Error Banner */}
        {error && !isOffline && (
          <Fade in timeout={500}>
            <Box mb={3}>
              <Alert
                severity="error"
                sx={{
                  backgroundColor: `${COLORS.red.main}15`,
                  border: `2px solid ${COLORS.red.main}40`,
                  borderRadius: '12px',
                  '& .MuiAlert-message': {
                    color: '#000000',
                    fontWeight: 600,
                  },
                }}
                action={
                  <IconButton
                    color="inherit"
                    size="small"
                    onClick={refresh}
                    sx={{ color: COLORS.red.main }}
                  >
                    <RefreshCw size={18} />
                  </IconButton>
                }
              >
                <AlertTitle sx={{ fontWeight: 700, color: '#000000' }}>
                  Error Loading Data
                </AlertTitle>
                {error}
              </Alert>
            </Box>
          </Fade>
        )}

        {/* Refresh Button */}
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Tooltip title="Refresh Dashboard">
            <IconButton
              onClick={refresh}
              disabled={loading}
              sx={{
                backgroundColor: '#ffffff',
                border: `2px solid ${COLORS.aqua.main}30`,
                color: COLORS.aqua.main,
                borderRadius: '12px',
                '&:hover': {
                  backgroundColor: `${COLORS.aqua.main}10`,
                  border: `2px solid ${COLORS.aqua.main}`,
                },
                '&:disabled': {
                  backgroundColor: '#f0f0f0',
                  borderColor: '#e0e0e0',
                },
              }}
            >
              <RefreshCw
                size={20}
                style={{
                  animation: loading ? 'spin 1s linear infinite' : 'none',
                }}
              />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Hero Section */}
        <Fade in timeout={600}>
          <Box>
            <WelcomeHero farmerName={data?.farmer?.fullname || user?.name} />
          </Box>
        </Fade>

        {/* Quick Links */}
        <Grow in timeout={800}>
          <Box>
            <QuickLinks />
          </Box>
        </Grow>

        {/* Services Overview */}
        <Grow in timeout={900}>
          <Box>
            <ServicesOverview />
          </Box>
        </Grow>

        {/* Statistics Section */}
        <Grow in timeout={1000}>
          <Box>
            <StatsSection stats={data?.stats} loading={loading} />
          </Box>
        </Grow>

        {/* Milk Graph + Recent Activities */}
        <Grow in timeout={1200}>
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} md={8}>
              <Box
                sx={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: `2px solid ${COLORS.aqua.main}30`,
                  p: 3,
                  width: '100%',
                  height: '100%',
                }}
              >
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Box sx={{ fontSize: '1.5rem' }}>📊</Box>
                  <Box
                    sx={{
                      fontSize: '1.3rem',
                      fontWeight: 900,
                      color: '#000000',
                    }}
                  >
                    Milk by Time Slot
                  </Box>
                </Box>

                {data?.stats?.milk_by_slot &&
                Object.keys(data.stats.milk_by_slot).length > 0 ? (
                  <Grid container spacing={2}>
                    {Object.entries(data.stats.milk_by_slot).map(
                      ([slot, litres], index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Box
                            sx={{
                              p: 3,
                              borderRadius: '12px',
                              backgroundColor: '#f8f9fa',
                              border: '1px solid #e0e0e0',
                              textAlign: 'center',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                backgroundColor: `${COLORS.aqua.main}08`,
                                border: `1px solid ${COLORS.aqua.main}40`,
                              },
                            }}
                          >
                            <Chip
                              label={slot.toUpperCase()}
                              size="small"
                              sx={{
                                backgroundColor: COLORS.aqua.main,
                                color: '#ffffff',
                                fontWeight: 700,
                                mb: 1,
                              }}
                            />
                            <Box
                              sx={{
                                fontSize: '1.8rem',
                                fontWeight: 900,
                                color: '#000000',
                              }}
                            >
                              {litres}
                            </Box>
                            <Box
                              sx={{
                                fontSize: '0.75rem',
                                color: '#666666',
                                fontWeight: 600,
                              }}
                            >
                              litres
                            </Box>
                          </Box>
                        </Grid>
                      )
                    )}
                  </Grid>
                ) : (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="200px"
                  >
                    <Box sx={{ color: '#999999', fontStyle: 'italic' }}>
                      No milk data available by time slot
                    </Box>
                  </Box>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <RecentActivities activities={data?.recent_activities} />
            </Grid>
          </Grid>
        </Grow>

        {/* Cow Stage Breakdown */}
        {data?.stats?.cow_stages &&
          Object.keys(data.stats.cow_stages).length > 0 && (
            <Grow in timeout={1400}>
              <Box mb={4}>
                <Box
                  sx={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: `2px solid ${COLORS.green.main}30`,
                    p: 3,
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Box sx={{ fontSize: '1.5rem' }}>🐄</Box>
                    <Box
                      sx={{
                        fontSize: '1.3rem',
                        fontWeight: 900,
                        color: '#000000',
                      }}
                    >
                      Cows by Stage
                    </Box>
                  </Box>

                  <Grid container spacing={2}>
                    {Object.entries(data.stats.cow_stages).map(
                      ([stage, count], index) => (
                        <Grid item xs={6} sm={4} md={3} key={index}>
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: '12px',
                              backgroundColor: '#f8f9fa',
                              border: '1px solid #e0e0e0',
                              textAlign: 'center',
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                backgroundColor: `${COLORS.green.main}08`,
                                border: `1px solid ${COLORS.green.main}40`,
                              },
                            }}
                          >
                            <Box
                              sx={{
                                fontSize: '1.8rem',
                                fontWeight: 900,
                                color: '#000000',
                                mb: 0.5,
                              }}
                            >
                              {count}
                            </Box>
                            <Box
                              sx={{
                                fontSize: '0.85rem',
                                color: '#666666',
                                fontWeight: 700,
                              }}
                            >
                              {stage.replace(/_/g, ' ').toUpperCase()}
                            </Box>
                          </Box>
                        </Grid>
                      )
                    )}
                  </Grid>
                </Box>
              </Box>
            </Grow>
          )}

        {/* Managers Section */}
        <Grow in timeout={1600}>
          <Box>
            <ManagersSection managers={data?.stats?.managers} />
          </Box>
        </Grow>
      </Container>

      {/* Footer */}
      <Footer />

      {/* Inline Animation */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </Box>
  );
};

export default FarmerHome;
