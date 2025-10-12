import React from "react";
import { Container, Typography, Box, Link } from "@mui/material";

const TermsOfService = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h3" gutterBottom fontWeight={700}>
        Terms of Service
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
        Last updated: October 2025
      </Typography>

      <Typography variant="body1" sx={{ mb: 3 }}>
        Welcome to <strong>MaziwaSmart</strong>. These Terms of Service
        (“Terms”) govern your access and use of our application, services, and
        related content (collectively referred to as the “Service”).
        By using MaziwaSmart, you agree to these Terms. If you do not agree,
        please discontinue using our platform.
      </Typography>

      <Typography variant="h6" gutterBottom>
        1. Eligibility
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        You must be at least 18 years old or have parental consent to use
        MaziwaSmart. You also agree that the information you provide during
        registration is accurate and up to date.
      </Typography>

      <Typography variant="h6" gutterBottom>
        2. Account Responsibility
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        You are responsible for maintaining the confidentiality of your account
        and login credentials. Any activity under your account is your
        responsibility. Notify us immediately if you suspect unauthorized
        access.
      </Typography>

      <Typography variant="h6" gutterBottom>
        3. Use of Service
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        You agree to use MaziwaSmart only for lawful agricultural, trading, and
        logistics-related purposes. You may not upload harmful, false, or
        misleading data or use the platform to engage in illegal activities.
      </Typography>

      <Typography variant="h6" gutterBottom>
        4. Data and Privacy
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Your privacy is important to us. Please read our{" "}
        <Link href="/privacy" color="secondary">
          Privacy Policy
        </Link>{" "}
        to understand how we collect, store, and use your personal data.
      </Typography>

      <Typography variant="h6" gutterBottom>
        5. Intellectual Property
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        All content, trademarks, and software within MaziwaSmart are the
        property of MaziwaSmart or its licensors. You may not reproduce,
        distribute, or modify our platform without prior written consent.
      </Typography>

      <Typography variant="h6" gutterBottom>
        6. Service Availability
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        We strive to ensure reliable uptime but do not guarantee uninterrupted
        service. MaziwaSmart reserves the right to modify, suspend, or
        discontinue any part of the Service without prior notice.
      </Typography>

      <Typography variant="h6" gutterBottom>
        7. Limitation of Liability
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        MaziwaSmart is not liable for any direct, indirect, incidental, or
        consequential damages arising from your use of the Service, including
        loss of profits or data.
      </Typography>

      <Typography variant="h6" gutterBottom>
        8. Termination
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        We reserve the right to suspend or terminate your account if we believe
        you have violated these Terms, engaged in fraudulent activity, or
        caused harm to other users.
      </Typography>

      <Typography variant="h6" gutterBottom>
        9. Updates to These Terms
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        We may revise these Terms periodically. Updated versions will be posted
        on this page with the new effective date. Continued use of the Service
        means you accept any changes.
      </Typography>

      <Typography variant="h6" gutterBottom>
        10. Contact Us
      </Typography>
      <Typography variant="body1">
        For questions or concerns about these Terms, please contact us at{" "}
        <strong>support@maziwasmart.co.ke</strong>.
      </Typography>
    </Container>
  );
};

export default TermsOfService;
