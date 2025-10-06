// src/components/globals/TermsOfService.jsx
import React from "react";
import { Box, Container, Typography, Paper } from "@mui/material";

const TermsOfService = () => {
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
            Terms of Service
          </Typography>

          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Effective Date:</strong> October 2025
          </Typography>

          <Typography variant="body1" paragraph>
            Welcome to <strong>MaziwaSmart</strong>. By using our website and services, you agree to the following terms and conditions.
          </Typography>

          <Typography variant="h6" gutterBottom>
            1. Acceptance of Terms
          </Typography>
          <Typography variant="body2" paragraph>
            By creating an account or using this service, you agree to comply with these Terms of Service and our Privacy Policy.
          </Typography>

          <Typography variant="h6" gutterBottom>
            2. Account Responsibility
          </Typography>
          <Typography variant="body2" paragraph>
            You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account.
          </Typography>

          <Typography variant="h6" gutterBottom>
            3. Prohibited Actions
          </Typography>
          <Typography variant="body2" paragraph>
            You agree not to misuse the MaziwaSmart platform, including engaging in hacking, spreading malware, or unauthorized data access.
          </Typography>

          <Typography variant="h6" gutterBottom>
            4. Termination
          </Typography>
          <Typography variant="body2" paragraph>
            We may suspend or terminate your access if you violate our terms or engage in malicious behavior.
          </Typography>

          <Typography variant="h6" gutterBottom>
            5. Changes to Terms
          </Typography>
          <Typography variant="body2" paragraph>
            MaziwaSmart reserves the right to update these Terms from time to time. Updates will be posted on this page.
          </Typography>

          <Typography variant="h6" gutterBottom>
            6. Contact
          </Typography>
          <Typography variant="body2">
            For questions, email us at: <strong>jmweng574@gmail.com</strong>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default TermsOfService;
