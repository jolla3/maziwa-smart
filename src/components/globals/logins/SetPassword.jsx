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
import { Lock, Eye, EyeOff } from "lucide-react";

const SetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [token, setToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const API_BASE_URL =
    process.env.REACT_APP_API_URL || "https://maziwasmart.onrender.com";

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const t = params.get("token");

    // If token missing → redirect to login automatically
    if (!t) {
      setAlert({
        type: "error",
        message: "Invalid or missing access token. Redirecting...",
      });
      setTimeout(() => navigate("/login", { replace: true }), 2500);
    } else {
      setToken(t);
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      return setAlert({ type: "error", message: "Passwords do not match." });
    }
    if (password.length < 6) {
      return setAlert({
        type: "error",
        message: "Password must be at least 6 characters long.",
      });
    }

    try {
      setLoading(true);
      setAlert({ type: "", message: "" });

      const res = await axios.post(`${API_BASE_URL}/api/userAuth/set-password`, {
        token,
        password,
      });

      setAlert({
        type: "success",
        message: res.data.message || "Password set successfully!",
      });

      // Redirect to login after success
      setTimeout(() => navigate("/login", { replace: true }), 2000);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Failed to set password. Please try again.";
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
            Set Your Password
          </Typography>
          <Typography
            variant="body2"
            align="center"
            sx={{ mb: 3, color: "text.secondary" }}
          >
            You signed up using Google. Please set a password to complete
            registration.
          </Typography>

          {alert.message && (
            <Alert severity={alert.type} sx={{ mb: 3 }}>
              {alert.message}
            </Alert>
          )}

          {token && (
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="New Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                margin="normal"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={20} />
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
              />

              <TextField
                fullWidth
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                margin="normal"
                variant="outlined"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 3,
                  py: 1.5,
                  fontWeight: 600,
                  bgcolor: theme.palette.primary.main,
                  "&:hover": {
                    bgcolor: theme.palette.primary.dark,
                    transform: "translateY(-2px)",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Set Password"
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
