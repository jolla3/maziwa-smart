import React, { useState, useEffect, useContext } from "react";
import { User, Phone, Mail, MapPin, Save } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../../PrivateComponents/AuthContext";
import { Box, TextField, Typography, Button, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

const UpdateFarmer = ({ farmerData, onCancel, onUpdateSuccess }) => {
  const { token } = useContext(AuthContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [formData, setFormData] = useState({
    fullname: "",
    phone: "",
    email: "",
    location: "",
  });

  useEffect(() => {
    if (farmerData) {
      setFormData({
        fullname: farmerData.fullname || "",
        phone: farmerData.phone || "",
        email: farmerData.email || "",
        location: farmerData.location || "",
      });
    }
  }, [farmerData]);

  const handleChange = (e) =>
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!farmerData?._id) {
      toast.error("Invalid farmer data");
      return;
    }

    try {
      toast.info("Updating farmer...");

      const response = await axios.put(
        `https://maziwasmart.onrender.com/api/farmers/${farmerData._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedFarmer = response.data;

      onUpdateSuccess(updatedFarmer);

      toast.dismiss();
      toast.success("Farmer updated successfully");

      onCancel();
    } catch (err) {
      toast.dismiss();
      toast.error("Update failed");
      console.error(err);
    }
  };

  // Icon selector based on field
  const iconByField = {
    fullname: <User size={16} />,
    phone: <Phone size={16} />,
    email: <Mail size={16} />,
    location: <MapPin size={16} />,
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      {["fullname", "phone", "email", "location"].map((field) => (
        <Box key={field} mb={3}>
          <Typography
            component="label"
            htmlFor={field}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontWeight: "600",
              color: colors.greenAccent[400],
              textTransform: "capitalize",
              mb: 0.5,
            }}
          >
            {iconByField[field]} {field}
          </Typography>
          <TextField
            id={field}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            type={field === "email" ? "email" : "text"}
            variant="outlined"
            fullWidth
            required
            sx={{
              backgroundColor:
                theme.palette.mode === "dark"
                  ? colors.primary[600]
                  : colors.grey[100],
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: colors.greenAccent[400],
                },
                "&:hover fieldset": {
                  borderColor: colors.greenAccent[500],
                },
                "&.Mui-focused fieldset": {
                  borderColor: colors.greenAccent[600],
                },
              },
            }}
          />
        </Box>
      ))}

      <Box
        display="flex"
        justifyContent="flex-end"
        gap={2}
        mt={4}
      >
        <Button
          variant="outlined"
          color="secondary"
          onClick={onCancel}
          size="medium"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          size="medium"
          startIcon={<Save size={18} />}
        >
          Update Farmer
        </Button>
      </Box>
    </Box>
  );
};

export default UpdateFarmer;
