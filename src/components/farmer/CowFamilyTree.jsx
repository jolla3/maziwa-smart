import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Alert,
  Snackbar,
  List,
  Chip,
} from '@mui/material';
import { useTheme } from '@mui/material';
import { tokens } from '../../theme';
import axios from 'axios';
import { AuthContext } from '../../components/PrivateComponents/AuthContext';
import Header from '../scenes/Header';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import WcIcon from '@mui/icons-material/Wc';
import PregnantWomanIcon from '@mui/icons-material/PregnantWoman'; // New icon for mother

const CowFamilyTree = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { cowId } = state || {};
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { token } = useContext(AuthContext);

  const [familyData, setFamilyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });


  const fetchFamilyTree = useCallback(async () => {
    if (!token) {
      setError('Authentication token not found. Please log in.');
      setLoading(false);
      return;
    }
    
    if (!cowId) {
      console.error("No cow found in navigation state. Redirecting to cow list.");
      navigate('/fmr.drb/cows'); 
      return;
    }
    try {
      const response = await axios.get(
        `https://maziwasmart.onrender.com/api/calf/${cowId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setFamilyData(response.data)
      setError(null)
    } catch (err) {
      console.error('Failed to fetch family tree:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to load family tree. Please check the cow ID.');
    } finally {
      setLoading(false)
    }
  }, [cowId, token, navigate]);

  useEffect(() => {
    fetchFamilyTree()
  }, [fetchFamilyTree]);

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  };
  
  if (!cowId && !error) {
    return (
      <Box m="20px" display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
        <CircularProgress color="success" size={60} />
        <Typography variant="h6" color={colors.grey[300]} mt={2}>
          Redirecting... Please select a cow to view its family tree.
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box m="20px" display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
        <CircularProgress color="success" size={60} />
        <Typography variant="h6" color={colors.grey[300]} mt={2}>
          Loading family tree...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box m="20px" display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box m="20px">
      <Header
        title="COW FAMILY TREE"
        subtitle="View the lineage of your cow and its offspring"
      />
      
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Box mt={4}>
        <Grid container spacing={3}>
          {/* Mother Card */}
          {familyData?.mother && (
            <Grid item xs={12} md={6}>
              <Card sx={{ background: colors.primary[400], p: 2, borderRadius: '16px' }}>
                <CardContent>
                  <Typography variant="h5" fontWeight="600" color={colors.grey[100]} mb={2}>
                    Mother
                  </Typography>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <PregnantWomanIcon sx={{ fontSize: '4rem', color: colors.blueAccent[400] }} />
                    </Grid>
                    <Grid item xs>
                      <Typography variant="h4" fontWeight="bold" color={colors.blueAccent[300]}>{familyData.mother.name}</Typography>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body1" color={colors.grey[300]}>**Age:** {familyData.mother.age}</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Current Cow Card */}
          <Grid item xs={12} md={familyData?.mother ? 6 : 12}>
            <Card sx={{ background: colors.greenAccent[600], p: 2, borderRadius: '16px' }}>
              <CardContent>
                <Typography variant="h5" fontWeight="600" color={colors.grey[100]} mb={2}>
                  Current Cow
                </Typography>
                {familyData?.currentCow && (
                  <Grid container spacing={2} alignItems="center">
                    <Grid item>
                      <WcIcon sx={{ fontSize: '4rem', color: colors.grey[100] }} />
                    </Grid>
                    <Grid item xs>
                      <Typography variant="h4" fontWeight="bold" color={colors.grey[100]}>{familyData.currentCow.name}</Typography>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body1" color={colors.grey[100]}>**Breed:** {familyData.currentCow.breed}</Typography>
                        <Typography variant="body1" color={colors.grey[100]}>**Age:** {familyData.currentCow.age}</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Offspring Section */}
          <Grid item xs={12}>
            <Card sx={{ background: colors.primary[400], p: 2, borderRadius: '16px' }}>
              <CardContent>
                <Typography variant="h5" fontWeight="600" color={colors.grey[100]} mb={2}>
                  Offspring
                </Typography>
                {Array.isArray(familyData?.offspring) && familyData.offspring.length > 0 ? (
                  <List>
                    {familyData.offspring.map((child, index) => (
                      <Card key={index} sx={{ background: colors.primary[500], p: 2, mb: 2, borderRadius: '12px' }}>
                        <Typography variant="h6" fontWeight="bold" color={colors.blueAccent[300]}>
                          {child.name}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <Chip
                            icon={child.gender === 'Female' ? <FemaleIcon /> : <MaleIcon />}
                            label={child.gender}
                            sx={{ mr: 1, backgroundColor: child.gender === 'Female' ? colors.pinkAccent[500] : colors.blueAccent[500], color: 'white' }}
                          />
                          <Chip
                            icon={<ChildCareIcon />}
                            label={child.stage}
                            sx={{ backgroundColor: colors.greenAccent[600], color: 'white' }}
                          />
                        </Box>
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color={colors.grey[300]}>**Age:** {child.age}</Typography>
                        </Box>
                      </Card>
                    ))}
                  </List>
                ) : (
                  <Typography color={colors.grey[300]}>{familyData?.offspring || 'No calves recorded for this cow.'}</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default CowFamilyTree;