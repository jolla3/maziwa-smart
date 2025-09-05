import React from "react";
import {
  Box,
  Button,
  TextField,
  InputAdornment,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import { User, Phone, MapPin, Barcode, UserPlus, ChevronLeft } from "lucide-react";
import { Formik } from "formik";
import * as yup from "yup";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../../theme";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../../scenes/Header";

const CreateFarmer = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const initialValues = {
    fullname: "",
    phone: "",
    farmer_code: "",
    location_description: "",
  };

  const phoneRegExp =
    /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

  const validationSchema = yup.object().shape({
    fullname: yup.string().required("Full Name is required"),
    phone: yup
      .string()
      .matches(phoneRegExp, "Phone number is not valid")
      .required("Phone is required"),
    farmer_code: yup.string().required("Farmer Code is required"),
    location_description: yup.string().required("Location Description is required"),
  });

  // Handle server errors with detailed toast messages
  const handleServerErrors = (error) => {
    if (error.response && error.response.data) {
      // Show message from backend if available
      if (typeof error.response.data === "string") {
        toast.error(error.response.data);
      } else if (error.response.data.message) {
        toast.error(error.response.data.message);
      } else if (error.response.data.errors) {
        // Handle multiple validation errors from backend
        Object.values(error.response.data.errors).forEach((errMsg) =>
          toast.error(errMsg)
        );
      } else {
        toast.error("Failed to create farmer. Try again.");
      }
    } else {
      toast.error("Network error or server unavailable.");
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    toast.info("Submitting farmer...", { autoClose: 2000 });

    // Map location_description to location for backend
    const submitValues = {
      ...values,
      location: values.location_description,
    };
    delete submitValues.location_description;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://maziwasmart.onrender.com/api/farmers",
        submitValues,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (
        response.data.message &&
        response.data.message.toLowerCase().includes("already exists")
      ) {
        toast.error(response.data.message);
        // Stay on form
      } else {
        toast.success(response.data.message || "Farmer created successfully!", {
          autoClose: 2000,
          onClose: () => {
            resetForm();
            navigate("/admindashboard/view-farmers");
          },
        });
      }
    } catch (error) {
      console.error("Error creating farmer:", error);
      // Handle network or unexpected errors
      toast.error(
        error.response?.data?.message || "Failed to create farmer. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box m="20px " sx={{ color: colors.grey[100] }}>
      <ToastContainer />

      {/* Breadcrumb with back button */}
      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{
          mb: 3,
          cursor: "pointer",
          color: colors.blueAccent[500],
          "& a:hover": { textDecoration: "underline", color: colors.greenAccent[400] },
        }}
      >
        {/* <MuiLink
          underline="hover"
          color="inherit"
          onClick={() => navigate(-1)}
          sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") navigate(-1);
          }}
        >
          <ChevronLeft size={20} /> Back to Dashboard
        </MuiLink> */}
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate("/admindashboard/view-farmers")}
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



      <Header title="CREATE FARMER" subtitle="Register a New Farmer" />

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
                  name="fullname"
                  value={values.fullname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.fullname && Boolean(errors.fullname)}
                  helperText={touched.fullname && errors.fullname}
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
                  label="Farmer Code"
                  variant="filled"
                  fullWidth
                  name="farmer_code"
                  value={values.farmer_code}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.farmer_code && Boolean(errors.farmer_code)}
                  helperText={touched.farmer_code && errors.farmer_code}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Barcode color={colors.greenAccent[400]} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ gridColumn: "span 4" }}
                  required
                />

                <TextField
                  label="Location Description"
                  variant="filled"
                  fullWidth
                  name="location_description"
                  value={values.location_description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={
                    touched.location_description &&
                    Boolean(errors.location_description)
                  }
                  helperText={
                    touched.location_description && errors.location_description
                  }
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
                  aria-label="Submit farmer form"
                >
                  {isSubmitting ? "Submitting..." : "Submit Farmer"}
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default CreateFarmer;
