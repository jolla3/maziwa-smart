import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  CircularProgress,
  InputAdornment,
  IconButton,
  useTheme,
} from "@mui/material";
import { Lock, Eye, EyeOff, User, Phone, MapPin, Hash } from "lucide-react";

const SetPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
    phone: "",
    location: "",
    farmer_code: ""
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [token, setToken] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const API_BASE_URL =
    process.env.REACT_APP_API_BASE

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const t = params.get("token");

    if (!t) {
      setAlert({
        type: "error",
        message: "Invalid or missing access token. Redirecting...",
      });
      setTimeout(() => navigate("/login", { replace: true }), 2500);
    } else {
      setToken(t);
      // Decode token to get role (basic decode, not verification)
      try {
        const payload = JSON.parse(atob(t.split('.')[1]));
        setUserRole(payload.role || "");
        setUserName(payload.name || "");
      } catch (e) {
        console.error("Could not decode token", e);
      }
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Password validation
    if (formData.password !== formData.confirmPassword) {
      return setAlert({ type: "error", message: "Passwords do not match." });
    }
    if (formData.password.length < 6) {
      return setAlert({
        type: "error",
        message: "Password must be at least 6 characters long.",
      });
    }

    // Role-specific validation
    if (userRole === "farmer") {
      if (!formData.phone) {
        return setAlert({ type: "error", message: "Phone number is required for farmers." });
      }
      if (!formData.farmer_code) {
        return setAlert({ type: "error", message: "Farmer code is required." });
      }
    }

    try {
      setLoading(true);
      setAlert({ type: "", message: "" });

      // Prepare payload based on role
      const payload = {
        token,
        password: formData.password,
      };

      // Add role-specific fields
      if (userRole === "farmer") {
        payload.phone = formData.phone;
        payload.farmer_code = formData.farmer_code;
        if (formData.location) payload.location = formData.location;
      } else {
        // For User collection (buyer, seller, etc.)
        if (formData.phone) payload.phone = formData.phone;
      }

      const res = await axios.post(`${API_BASE_URL}/userAuth/set-password`, payload);

      setAlert({
        type: "success",
        message: res.data.message || "Registration completed successfully!",
      });

      // Redirect to login after success
      setTimeout(() => navigate("/login", { replace: true }), 2000);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Failed to complete registration. Please try again.";
      setAlert({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 3,
            bgcolor: "background.paper",
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 8px 32px rgba(0,0,0,0.3)"
                : "0 8px 32px rgba(0,0,0,0.1)",
          }}
        >
          <Typography
            variant="h5"
            align="center"
            sx={{ fontWeight: 600, mb: 2 }}
          >
            Complete Your Registration
          </Typography>
          <Typography
            variant="body2"
            align="center"
            sx={{ mb: 3, color: "text.secondary" }}
          >
            {userName && `Welcome ${userName}! `}
            Please set your password and provide additional details to complete registration.
          </Typography>

          {alert.message && (
            <Alert 
              severity={alert.type} 
              sx={{ mb: 3 }}
              onClose={() => setAlert({ type: "", message: "" })}
            >
              {alert.message}
            </Alert>
          )}

          {token && (
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="New Password"
                name="password"
                type={showPassword ? "text" : "password"}
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
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={formData.confirmPassword}
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
                }}
                sx={{ mb: 2 }}
              />

              {/* Farmer-specific fields */}
              {userRole === "farmer" && (
                <>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    margin="normal"
                    variant="outlined"
                    placeholder="Enter your phone number"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone size={20} color={theme.palette.text.secondary} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Farmer Code"
                    name="farmer_code"
                    type="number"
                    value={formData.farmer_code}
                    onChange={handleChange}
                    required
                    margin="normal"
                    variant="outlined"
                    placeholder="Enter your farmer code"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Hash size={20} color={theme.palette.text.secondary} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Location (Optional)"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    margin="normal"
                    variant="outlined"
                    placeholder="Enter your location"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MapPin size={20} color={theme.palette.text.secondary} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />
                </>
              )}

              {/* Optional phone for non-farmers */}
              {userRole !== "farmer" && (
                <TextField
                  fullWidth
                  label="Phone Number (Optional)"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                  placeholder="Enter your phone number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone size={20} color={theme.palette.text.secondary} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 3,
                  py: 1.5,
                  fontWeight: 600,
                  bgcolor: userRole === "farmer" ? "success.main" : theme.palette.primary.main,
                  "&:hover": {
                    bgcolor: userRole === "farmer" ? "success.dark" : theme.palette.primary.dark,
                    transform: "translateY(-2px)",
                  },
                  "&:disabled": {
                    bgcolor: theme.palette.action.disabled,
                  },
                  transition: "all 0.3s ease",
                }}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={24} color="inherit" />
                    <span>Completing Registration...</span>
                  </Box>
                ) : (
                  "Complete Registration"
                )}
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default SetPassword;