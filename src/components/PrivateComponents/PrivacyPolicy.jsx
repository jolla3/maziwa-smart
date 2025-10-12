import React from "react";
import { Container, Typography, Box } from "@mui/material";

const PrivacyPolicy = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h3" gutterBottom fontWeight={700}>
        Privacy Policy
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
        Last updated: October 2025
      </Typography>

      <Typography variant="body1" sx={{ mb: 3 }}>
        MaziwaSmart (“we”, “our”, “us”) respects your privacy and is committed to protecting your personal data.
        This policy explains how we collect, use, and share information when you use our application.
      </Typography>

      <Typography variant="h6" gutterBottom>
        1. Information We Collect
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        We collect information you provide directly such as your name, phone number, and farm details.
        We may also collect usage data like device information and login activity.
      </Typography>

      <Typography variant="h6" gutterBottom>
        2. How We Use Your Information
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        The information helps us provide services like milk tracking, market insights, and user verification.
        We never sell your data to third parties.
      </Typography>

      <Typography variant="h6" gutterBottom>
        3. Data Security
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        We use encryption, secure connections, and restricted access to protect your information.
      </Typography>

      <Typography variant="h6" gutterBottom>
        4. Google Sign-In
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        If you sign in using Google, we only access your name, email address, and profile picture for authentication.
        We do not share this data outside MaziwaSmart.
      </Typography>

      <Typography variant="h6" gutterBottom>
        5. Contact Us
      </Typography>
      <Typography variant="body1">
        If you have questions, contact us at: <strong>support@maziwasmart.co.ke</strong>
      </Typography>
    </Container>
  );
};

export default PrivacyPolicy;
