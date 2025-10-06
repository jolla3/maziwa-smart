// src/components/globals/PrivacyPolicy.jsx
import React from "react";
import { Box, Container, Typography, Paper } from "@mui/material";

const PrivacyPolicy = () => {
  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={4}
          sx={{
            p: 4,
            borderRadius: 3,
            bgcolor: "background.paper",
          }}
        >
          <Typography variant="h4" gutterBottom fontWeight={600}>
            Privacy Policy
          </Typography>

          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Effective Date:</strong> October 2025
          </Typography>

          <Typography variant="body1" paragraph>
            At <strong>MaziwaSmart</strong>, we respect your privacy. This policy explains how we collect, use, and protect your personal information.
          </Typography>

          <Typography variant="h6" gutterBottom>
            Information We Collect
          </Typography>
          <Typography variant="body2" paragraph>
            We collect your name, email address, and other basic details only to authenticate you through Google or manual sign-up. We do not collect unnecessary personal data.
          </Typography>

          <Typography variant="h6" gutterBottom>
            How We Use Your Information
          </Typography>
          <Typography variant="body2" paragraph>
            Your information is used solely to create your account, provide services, and improve user experience. We do not sell or share your data with third parties.
          </Typography>

          <Typography variant="h6" gutterBottom>
            Data Security
          </Typography>
          <Typography variant="body2" paragraph>
            We implement secure authentication, encryption, and restricted data access to protect your information. However, no online platform is completely risk-free.
          </Typography>

          <Typography variant="h6" gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="body2" paragraph>
            If you have questions about our privacy policy, reach us at:
          </Typography>
          <Typography variant="body2">
            📧 <strong>its.jolla6@gmail.com</strong>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;
