import React, { useState, useEffect, useContext } from "react";
import { User, Phone, Mail, MapPin, Save } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../../PrivateComponents/AuthContext";
import { Box, TextField, Typography, Button, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

const UpdatePorterForm = ({ porterData, onCancel, onUpdateSuccess }) => {
  const { token } = useContext(AuthContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    assigned_route: "",
  });

   const Base_API = process.env.REACT_APP_API_BASE


  useEffect(() => {
    if (porterData) {
      setFormData({
        name: porterData.name || "",
        phone: porterData.phone || "",
        email: porterData.email || "",
        assigned_route: porterData.assigned_route || "",
      });
    }
  }, [porterData]);

  const handleChange = (e) =>
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!porterData?._id) {
      toast.error("Invalid porter data");
      return;
    }

    try {
      toast.info("Updating porter...");

      const response = await axios.put(
        `${Base_API}/porters/${porterData._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedPorter = response.data;

      toast.dismiss();
      toast.success("Porter updated successfully");

      onUpdateSuccess(updatedPorter);
    } catch (err) {
      toast.dismiss();
      toast.error("Update failed");
      console.error(err);
    }
  };

  // Icons mapped by field name
  const iconByField = {
    name: <User size={16} />,
    phone: <Phone size={16} />,
    email: <Mail size={16} />,
    assigned_route: <MapPin size={16} />,
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
      {["name", "phone", "email", "assigned_route"].map((field) => (
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
            {iconByField[field]} {field.replace("_", " ")}
          </Typography>
          <TextField
            id={field}
            name={field}
            value={formData[field]}
            onChange={handleChange}
            type={field === "email" ? "email" : "text"}
            variant="outlined"
            fullWidth
            required={field !== "email"}
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

      <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
        <Button variant="outlined" color="secondary" onClick={onCancel} size="medium">
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          size="medium"
          startIcon={<Save size={18} />}
        >
          Update Porter
        </Button>
      </Box>
    </Box>
  );
};

export default UpdatePorterForm;
