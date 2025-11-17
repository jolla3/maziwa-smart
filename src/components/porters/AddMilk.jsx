
// src/pages/porter/AddMilk.jsx
import React, { useState, useContext } from "react";
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Alert, 
  useTheme,
  Card,
  CardContent,
  Chip,
  Divider,
  CircularProgress,
  Grid
} from "@mui/material";
import { tokens } from "../../theme";
import { AuthContext } from "../PrivateComponents/AuthContext";
import axios from "axios";

const AddMilk = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode)
  const { token } = useContext(AuthContext)

  const [farmerCode, setFarmerCode] = useState("")
  const [litres, setLitres] = useState("")
  const [response, setResponse] = useState(null)
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false)

   const Base_API = process.env.REACT_APP_API_BASE


  // Get current time slot for display
  const getCurrentTimeSlot = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 10) return "morning";
    if (hour >= 10 && hour < 12) return "midmorning";
    if (hour >= 12 && hour < 17) return "afternoon";
    return "evening";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponse(null);
    setError(null);
    setLoading(true);

    // Client-side validation
    if (!farmerCode.trim()) {
      setError("Please enter a farmer code");
      setLoading(false);
      return;
    }

    if (!litres || parseFloat(litres) <= 0) {
      setError("Please enter a valid amount of litres (greater than 0)");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        `${Base_API}/api/milk/add`,
        {
          farmer_code: farmerCode.trim(),
          litres: parseFloat(litres),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setResponse(res.data);
        // Clear form on successful new record, keep form for updates
        if (res.data.data.action === "created") {
          setFarmerCode("");
          setLitres("");
        }
      } else {
        setError(res.data.message || "Operation failed");
      }

    } catch (err) {
      console.error("Error:", err);
      
      if (err.response?.data) {
        setError(err.response.data.message || "Something went wrong");
        // If it's a detailed error response, store it
        if (err.response.data.details) {
          setResponse(err.response.data);
        }
      } else if (err.message) {
        setError(`Network error: ${err.message}`);
      } else {
        setError("Network error - please check your connection");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFarmerCode("");
    setLitres("");
    setResponse(null);
    setError(null);
  };

  const renderSuccessDetails = (data) => {
    const isUpdate = data.action === "updated";
    
    return (
      <Card sx={{ mt: 2, bgcolor: colors.primary[500] }}>
        <CardContent>
          <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>
            {isUpdate ? "📝 Record Updated" : "✨ New Record Created"}
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color={colors.grey[100]}>
                <strong>Farmer:</strong> {data.farmer_name} ({farmerCode})
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color={colors.grey[100]}>
                <strong>Time Slot:</strong> {data.time_slot}
              </Typography>
            </Grid>
            
            {isUpdate && (
              <>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color={colors.grey[100]}>
                    <strong>Previous:</strong> {data.previous_litres}L
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color={colors.grey[100]}>
                    <strong>New:</strong> {data.new_litres}L
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" color={
                    data.difference?.startsWith('+') ? colors.greenAccent[400] : colors.redAccent[400]
                  }>
                    <strong>Change:</strong> {data.difference}
                  </Typography>
                </Grid>
              </>
            )}
            
            {!isUpdate && (
              <Grid item xs={12}>
                <Typography variant="body2" color={colors.greenAccent[400]}>
                  <strong>Litres Collected:</strong> {data.litres}L
                </Typography>
              </Grid>
            )}
          </Grid>

          <Divider sx={{ my: 2, bgcolor: colors.grey[700] }} />
          
          <Box display="flex" alignItems="center" gap={1}>
            <Chip 
              label={`${data.updates_remaining} update${data.updates_remaining !== 1 ? 's' : ''} remaining`}
              color={data.updates_remaining > 0 ? "success" : "error"}
              size="small"
            />
            <Typography variant="caption" color={colors.grey[300]}>
              for this farmer in {data.time_slot} slot today
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const renderErrorDetails = (errorData) => {
    if (!errorData.details) return null;

    return (
      <Card sx={{ mt: 2, bgcolor: colors.primary[500], border: `1px solid ${colors.redAccent[500]}` }}>
        <CardContent>
          <Typography variant="h6" color={colors.redAccent[400]} gutterBottom>
            🚫 Update Limit Reached
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color={colors.grey[100]}>
                <strong>Farmer:</strong> {errorData.details.farmer_name} ({farmerCode})
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color={colors.grey[100]}>
                <strong>Current Litres:</strong> {errorData.details.current_litres}L
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color={colors.grey[100]}>
                <strong>Time Slot:</strong> {errorData.details.time_slot}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color={colors.redAccent[400]}>
                <strong>Updates Used:</strong> {errorData.details.updates_used}/{errorData.details.max_updates}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box m="20px">
      <Typography variant="h4" mb={2} color={colors.grey[900]}>
        Add Milk Record
      </Typography>
      
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Chip 
          label={`Current Time Slot: ${getCurrentTimeSlot()}`}
          color="primary"
          variant="outlined"
        />
        <Typography variant="caption" color={colors.grey[300]}>
          Records are organized by time slots throughout the day
        </Typography>
      </Box>

      <Box
        p="25px"
        bgcolor={colors.primary[400]}
        borderRadius="8px"
        boxShadow={3}
        maxWidth="600px"
      >
        <form onSubmit={handleSubmit}>
          <TextField
            label="Farmer Code"
            variant="outlined"
            fullWidth
            value={farmerCode}
            onChange={(e) => setFarmerCode(e.target.value)}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                color: colors.grey[100],
                "& fieldset": { borderColor: colors.grey[500] },
                "&:hover fieldset": { borderColor: colors.grey[400] },
                "&.Mui-focused fieldset": { borderColor: colors.greenAccent[500] }
              },
              "& .MuiInputLabel-root": { 
                color: colors.grey[300],
                "&.Mui-focused": { color: colors.greenAccent[500] }
              }
            }}
            disabled={loading}
            required
            autoComplete="off"
          />
          
          <TextField
            label="Litres"
            type="number"
            variant="outlined"
            fullWidth
            value={litres}
            onChange={(e) => setLitres(e.target.value)}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                color: colors.grey[100],
                "& fieldset": { borderColor: colors.grey[500] },
                "&:hover fieldset": { borderColor: colors.grey[400] },
                "&.Mui-focused fieldset": { borderColor: colors.greenAccent[500] }
              },
              "& .MuiInputLabel-root": { 
                color: colors.grey[300],
                "&.Mui-focused": { color: colors.greenAccent[500] }
              }
            }}
            disabled={loading}
            required
            inputProps={{ min: 0, step: 0.1 }}
          />
          
          <Box display="flex" gap={2}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: colors.greenAccent[500],
                "&:hover": { bgcolor: colors.greenAccent[600] },
                "&:disabled": { bgcolor: colors.grey[600] },
                flex: 1
              }}
              disabled={loading}
            >
              {loading ? (
                <Box display="flex" alignItems="center" gap={1}>
                  <CircularProgress size={20} color="inherit" />
                  Processing...
                </Box>
              ) : (
                "Add/Update Milk"
              )}
            </Button>
            
            <Button
              type="button"
              variant="outlined"
              onClick={handleReset}
              sx={{
                borderColor: colors.grey[500],
                color: colors.grey[100],
                "&:hover": { 
                  borderColor: colors.grey[400],
                  bgcolor: colors.primary[500]
                }
              }}
              disabled={loading}
            >
              Reset
            </Button>
          </Box>
        </form>

        {/* Success Message */}
        {response && response.success && (
          <>
            <Alert 
              severity="success" 
              sx={{ 
                mt: 2,
                bgcolor: colors.greenAccent[800],
                color: colors.grey[100],
                "& .MuiAlert-icon": { color: colors.greenAccent[400] }
              }}
            >
              {response.message}
            </Alert>
            {renderSuccessDetails(response.data)}
          </>
        )}

        {/* Error Message */}
        {error && (
          <>
            <Alert 
              severity="error" 
              sx={{ 
                mt: 2,
                bgcolor: colors.redAccent[800],
                color: colors.grey[100],
                "& .MuiAlert-icon": { color: colors.redAccent[400] }
              }}
            >
              {error}
            </Alert>
            {response && !response.success && renderErrorDetails(response)}
          </>
        )}

        {/* Helper Info */}
        <Box mt={3} p={2} bgcolor={colors.primary[500]} borderRadius="4px">
          <Typography variant="caption" color={colors.grey[300]} display="block" gutterBottom>
            💡 <strong>How it works:</strong>
          </Typography>
          <Typography variant="caption" color={colors.grey[400]} display="block">
            • First entry creates a new record<br/>
            • Subsequent entries for the same farmer in the same time slot update the existing record<br/>
            • You can only update each farmer's record once per time slot per day<br/>
            • Time slots: Morning (5-10), Mid-morning (10-12), Afternoon (12-17), Evening (17+)
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AddMilk;