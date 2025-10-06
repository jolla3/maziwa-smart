import React from "react";
import {
  Box,
  Button,
  TextField,
  InputAdornment,
  Breadcrumbs,
} from "@mui/material";
import { User, Phone, MapPin } from "lucide-react";
import { Formik } from "formik";
import * as yup from "yup";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../../theme";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../scenes/Header";

const CreatePorter = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const initialValues = {
    name: "",
    phone: "",
    assigned_route: "",
  };

  const phoneRegExp =
    /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

  const validationSchema = yup.object().shape({
    name: yup.string().required("Full Name is required"),
    phone: yup
      .string()
      .matches(phoneRegExp, "Phone number is not valid")
      .required("Phone is required"),
    assigned_route: yup.string().required("Assigned Route is required"),
  });

  const handleServerErrors = (error) => {
    if (error.response && error.response.data) {
      if (typeof error.response.data === "string") {
        toast.error(error.response.data);
      } else if (error.response.data.message) {
        toast.error(error.response.data.message);
      } else if (error.response.data.errors) {
        Object.values(error.response.data.errors).forEach((errMsg) =>
          toast.error(errMsg)
        );
      } else {
        toast.error("Failed to create porter. Try again.");
      }
    } else {
      toast.error("Network error or server unavailable.");
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    toast.info("Submitting porter...", { autoClose: 2000 });

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://maziwasmart.onrender.com/api/porters",
        values,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // If message indicates success (you could adjust this based on your backend)
      if (
        response.data &&
        response.data.message &&
        !response.data.message.toLowerCase().includes("already exists")
      ) {
        toast.success(response.data.message, {
          autoClose: 2000,
          onClose: () => {
            resetForm();
            navigate("/admindashboard/view-porters");
          },
        });
      } else {
        // Handle duplicates or any error messages sent back as message
        toast.error(response.data.message || "Failed to create porter.");
        // Keep user on the form
      }
    } catch (error) {
      console.error("Error creating porter:", error);
      toast.error(
        error.response?.data?.message ||
        "Network or server error. Please try again."
      );
      // Stay on form to allow fixing
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box m="20px" sx={{ color: colors.grey[100] }}>
      <ToastContainer />

      {/* Breadcrumb back button styled exactly as your farmers component */}
      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{
          mb: 3,
          cursor: "pointer",
          color: colors.blueAccent[500],
          "& a:hover": { textDecoration: "underline", color: colors.greenAccent[400] },
        }}
      >
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate("/admindashboard/view-porters")}
          sx={{
            borderColor: colors.blueAccent[400],
            color: colors.blueAccent[400],
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: colors.blueAccent[700],
              borderColor: colors.blueAccent[700],
              color: colors.grey[100],
            },
          }}
        >
          Back
        </Button>
      </Breadcrumbs>

      <Header title="CREATE PORTER" subtitle="Register a New Porter" />

      <Box
        mt={3}
        p={4}
        borderRadius="8px"
        sx={{
          backgroundColor:
            theme.palette.mode === "dark" ? colors.primary[400] : "#fff",
          boxShadow: theme.shadows[3],
          color: theme.palette.mode === "dark" ? colors.grey[100] : colors.grey[900],
        }}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
          }) => (
            <form onSubmit={handleSubmit} noValidate>
              <Box
                display="grid"
                gap="20px"
                gridTemplateColumns="repeat(4, 1fr)"
                sx={{
                  "& > div": { gridColumn: "span 4" },
                  "@media (min-width:600px)": {
                    "& > div": { gridColumn: "span 2" },
                  },
                }}
              >
                <TextField
                  label="Full Name"
                  variant="filled"
                  fullWidth
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <User color={colors.greenAccent[500]} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ gridColumn: "span 2" }}
                  autoComplete="name"
                  required
                />

                <TextField
                  label="Phone Number"
                  variant="filled"
                  fullWidth
                  name="phone"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.phone && Boolean(errors.phone)}
                  helperText={touched.phone && errors.phone}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone color={colors.greenAccent[400]} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ gridColumn: "span 2" }}
                  autoComplete="tel"
                  required
                />

                <TextField
                  label="Assigned Route"
                  variant="filled"
                  fullWidth
                  name="assigned_route"
                  value={values.assigned_route}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.assigned_route && Boolean(errors.assigned_route)}
                  helperText={touched.assigned_route && errors.assigned_route}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MapPin color={colors.greenAccent[400]} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ gridColumn: "span 4" }}
                  required
                />
              </Box>

              <Box display="flex" justifyContent="flex-end" mt="30px">
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  disabled={isSubmitting}
                  sx={{
                    backgroundColor: colors.greenAccent[600],
                    color: colors.grey[900],
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: colors.greenAccent[700],
                    },
                  }}
                  aria-label="Submit porter form"
                >
                  {isSubmitting ? "Submitting..." : "Submit Porter"}
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default CreatePorter;
