import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Pagination,
  Card,
  Divider,
  Stack,
  Chip,
} from "@mui/material";
import { ArrowBack, Lock, Shield } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const privacyContent = [
  {
    title: "1. Information We Collect",
    icon: "📋",
    content:
      "We collect information you provide directly such as your name, phone number, and farm details. We may also collect usage data like device information and login activity. This helps us improve our services and provide better agricultural insights.",
  },
  {
    title: "2. How We Use Your Information",
    icon: "🔍",
    content:
      "The information helps us provide services like milk tracking, market insights, and user verification. We use data to personalize your experience, analyze trends, and ensure platform security. Your data is never used for advertising purposes.",
  },
  {
    title: "3. Data Security",
    icon: "🔐",
    content:
      "We use encryption, secure connections, and restricted access to protect your information. Our servers are monitored 24/7 for potential security breaches. We comply with international data protection standards.",
  },
  {
    title: "4. Google Sign-In",
    icon: "🔑",
    content:
      "If you sign in using Google, we only access your name, email address, and profile picture for authentication. We do not share this data outside MaziwaSmart and do not request any additional permissions.",
  },
  {
    title: "5. Data Retention",
    icon: "📅",
    content:
      "We retain your personal data as long as your account is active or as needed to provide services. You can request data deletion at any time. We will remove your data within 30 days of your request.",
  },
  {
    title: "6. Third-Party Sharing",
    icon: "🤝",
    content:
      "We do not sell or share your personal data with third parties without your explicit consent. We may share anonymized data with partners for improving agricultural services and market analysis.",
  },
  {
    title: "7. Your Rights",
    icon: "✋",
    content:
      "You have the right to access, correct, or delete your personal data. You can update your profile settings at any time. Contact us to exercise these rights. We will respond to requests within 7 business days.",
  },
  {
    title: "8. Contact Us",
    icon: "📧",
    content:
      "If you have questions about our privacy practices, contact us at support@maziwasmart.co.ke. Our privacy team is available Monday-Friday, 9AM-5PM EAT.",
  },
];

const itemsPerPage = 2;

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const startIdx = (page - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const currentItems = privacyContent.slice(startIdx, endIdx);
  const totalPages = Math.ceil(privacyContent.length / itemsPerPage);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f3ff 0%, #f0f9ff 50%, #fef2f2 100%)",
        py: 6,
        animation: "fadeIn 0.6s ease-in-out",
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>

      <Container maxWidth="lg">
        {/* Header with Back Button */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4, animation: "slideInLeft 0.5s ease-out" }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{
              color: "#000",
              fontWeight: 700,
              fontSize: "1rem",
              backgroundColor: "#fff",
              border: "2px solid #a78bfa",
              borderRadius: 3,
              px: 3,
              py: 1.5,
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#a78bfa",
                color: "#fff",
                transform: "translateX(-5px)",
              },
            }}
          >
            Back
          </Button>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              background: "linear-gradient(135deg, #a78bfa 0%, #000 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontSize: { xs: "2rem", md: "3.5rem" },
            }}
          >
            Privacy Policy
          </Typography>
        </Box>

        {/* Intro Section */}
        <Card
          sx={{
            background: "#fff",
            borderRadius: 4,
            boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
            border: "2px solid #a78bfa",
            p: 4,
            mb: 4,
            animation: "fadeUp 0.6s ease-out 0.1s backwards",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Shield sx={{ color: "#a78bfa", fontSize: 32 }} />
            <Typography
              variant="h6"
              sx={{
                color: "#000",
                fontWeight: 800,
                fontSize: "1.3rem",
              }}
            >
              Your Privacy Matters to Us
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{
              color: "#374151",
              fontSize: "1.1rem",
              lineHeight: 1.8,
              mb: 2,
            }}
          >
            MaziwaSmart ("we", "our", "us") respects your privacy and is
            committed to protecting your personal data. This policy explains how
            we collect, use, and share information when you use our application.
          </Typography>
          <Typography variant="caption" sx={{ color: "#999" }}>
            Last updated: October 2025
          </Typography>
        </Card>

        {/* Privacy Content */}
        <Box sx={{ mb: 4 }}>
          {currentItems.map((item, idx) => (
            <Card
              key={idx}
              sx={{
                background: "#fff",
                borderRadius: 3,
                boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
                border: "1px solid #e5e7eb",
                p: 3.5,
                mb: 3,
                animation: `fadeUp 0.6s ease-out ${0.2 + idx * 0.15}s backwards`,
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                  boxShadow: "0 15px 40px rgba(167, 139, 250, 0.15)",
                  transform: "translateY(-4px)",
                  borderColor: "#a78bfa",
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: "linear-gradient(90deg, #a78bfa 0%, #c084fc 100%)",
                  transform: "scaleX(0)",
                  transformOrigin: "left",
                  transition: "transform 0.3s ease",
                },
                "&:hover::before": {
                  transform: "scaleX(1)",
                },
              }}
            >
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <Typography sx={{ fontSize: "2rem" }}>{item.icon}</Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    color: "#000",
                    fontSize: "1.3rem",
                    background: "linear-gradient(135deg, #a78bfa 0%, #c084fc 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {item.title}
                </Typography>
              </Box>
              <Divider sx={{ mb: 2, backgroundColor: "#e5e7eb" }} />
              <Typography
                variant="body1"
                sx={{
                  color: "#4b5563",
                  fontSize: "1rem",
                  lineHeight: 1.8,
                  letterSpacing: "0.3px",
                }}
              >
                {item.content}
              </Typography>
            </Card>
          ))}
        </Box>

        {/* Pagination */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            animation: "fadeUp 0.6s ease-out 0.5s backwards",
            mt: 6,
            pt: 4,
            borderTop: "2px solid #e5e7eb",
          }}
        >
          <Typography sx={{ fontWeight: 700, color: "#000", fontSize: "1rem" }}>
            Page {page} of {totalPages}
          </Typography>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, val) => {
              setPage(val);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            sx={{
              "& .MuiPaginationItem-root": {
                fontWeight: 700,
                fontSize: "1rem",
                color: "#000",
                border: "2px solid #e5e7eb",
                borderRadius: 2,
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#f5f3ff",
                  borderColor: "#a78bfa",
                },
              },
              "& .MuiPaginationItem-page.Mui-selected": {
                background: "linear-gradient(135deg, #a78bfa 0%, #c084fc 100%)",
                color: "#fff",
                border: "2px solid #a78bfa",
                fontWeight: 800,
              },
            }}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;