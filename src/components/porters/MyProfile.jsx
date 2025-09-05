import React, { useState, useEffect, useContext } from "react";
import { Box, Button, TextField, Typography, useTheme, CircularProgress } from "@mui/material";
import { tokens } from "../../theme";
import { AuthContext } from "../../components/PrivateComponents/AuthContext"; // Assuming you have auth context
import axios from "axios";
import { toast } from "react-toastify";

const PorterProfileForm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { user } = useContext(AuthContext); // contains id, role, token
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    fullname: "",
    phone: "",
    email: "",
    location_description: "",
    password: "",
  });

  // Fetch current porter profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/porters/${user.id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setProfile((prev) => ({ ...prev, ...res.data }));
      } catch (error) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  // Handle input change
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const payload = { ...profile };
      if (!payload.password) delete payload.password; // remove password if empty

      await axios.put(`/api/porters/${user.id}`, payload, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profile.fullname) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 3,
        backgroundColor: colors.primary[400],
        borderRadius: "8px",
        boxShadow: 2,
        maxWidth: 500,
        mx: "auto",
      }}
    >
      <Typography variant="h4" mb={2} color={colors.blueAccent[400]}>
        My Profile
      </Typography>

      <TextField
        fullWidth
        label="Full Name"
        name="fullname"
        value={profile.fullname}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Phone"
        name="phone"
        value={profile.phone}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Email"
        name="email"
        value={profile.email}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Location Description"
        name="location_description"
        value={profile.location_description}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Password (Leave blank to keep current)"
        name="password"
        type="password"
        value={profile.password}
        onChange={handleChange}
        sx={{ mb: 3 }}
      />

      <Button
        type="submit"
        variant="contained"
        sx={{
          backgroundColor: colors.greenAccent[500],
          color: colors.grey[100],
          "&:hover": { backgroundColor: colors.greenAccent[600] },
        }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : "Update Profile"}
      </Button>
    </Box>
  );
};

export default PorterProfileForm;
