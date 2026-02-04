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
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const termsContent = [
  {
    title: "1. Eligibility",
    content:
      "You must be at least 18 years old or have parental consent to use MaziwaSmart. You also agree that the information you provide during registration is accurate and up to date.",
  },
  {
    title: "2. Account Responsibility",
    content:
      "You are responsible for maintaining the confidentiality of your account and login credentials. Any activity under your account is your responsibility. Notify us immediately if you suspect unauthorized access.",
  },
  {
    title: "3. Use of Service",
    content:
      "You agree to use MaziwaSmart only for lawful agricultural, trading, and logistics-related purposes. You may not upload harmful, false, or misleading data or use the platform to engage in illegal activities.",
  },
  {
    title: "4. Data and Privacy",
    content:
      "Your privacy is important to us. Please read our Privacy Policy to understand how we collect, store, and use your personal data.",
  },
  {
    title: "5. Intellectual Property",
    content:
      "All content, trademarks, and software within MaziwaSmart are the property of MaziwaSmart or its licensors. You may not reproduce, distribute, or modify our platform without prior written consent.",
  },
  {
    title: "6. Service Availability",
    content:
      "We strive to ensure reliable uptime but do not guarantee uninterrupted service. MaziwaSmart reserves the right to modify, suspend, or discontinue any part of the Service without prior notice.",
  },
  {
    title: "7. Limitation of Liability",
    content:
      "MaziwaSmart is not liable for any direct, indirect, incidental, or consequential damages arising from your use of the Service, including loss of profits or data.",
  },
  {
    title: "8. Termination",
    content:
      "We reserve the right to suspend or terminate your account if we believe you have violated these Terms, engaged in fraudulent activity, or caused harm to other users.",
  },
  {
    title: "9. Updates to These Terms",
    content:
      "We may revise these Terms periodically. Updated versions will be posted on this page with the new effective date. Continued use of the Service means you accept any changes.",
  },
  {
    title: "10. Contact Us",
    content:
      "For questions or concerns about these Terms, please contact us at support@maziwasmart.co.ke.",
  },
];

const itemsPerPage = 2;

const TermsOfService = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const startIdx = (page - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const currentItems = termsContent.slice(startIdx, endIdx);
  const totalPages = Math.ceil(termsContent.length / itemsPerPage);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f9ff 0%, #f0fdf4 50%, #fef3c7 100%)",
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
              border: "2px solid #10b981",
              borderRadius: 3,
              px: 3,
              py: 1.5,
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#10b981",
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
              background: "linear-gradient(135deg, #10b981 0%, #000 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontSize: { xs: "2rem", md: "3.5rem" },
            }}
          >
            Terms of Service
          </Typography>
        </Box>

        {/* Intro Section */}
        <Card
          sx={{
            background: "#fff",
            borderRadius: 4,
            boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
            border: "2px solid #10b981",
            p: 4,
            mb: 4,
            animation: "fadeUp 0.6s ease-out 0.1s backwards",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              color: "#374151",
              fontSize: "1.1rem",
              lineHeight: 1.8,
              mb: 2,
            }}
          >
            Welcome to <strong style={{ color: "#000" }}>MaziwaSmart</strong>.
            These Terms of Service ("Terms") govern your access and use of our
            application, services, and related content (collectively referred to
            as the "Service"). By using MaziwaSmart, you agree to these Terms.
            If you do not agree, please discontinue using our platform.
          </Typography>
          <Typography variant="caption" sx={{ color: "#999" }}>
            Last updated: October 2025
          </Typography>
        </Card>

        {/* Terms Content */}
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
                "&:hover": {
                  boxShadow: "0 15px 40px rgba(16, 185, 129, 0.15)",
                  transform: "translateY(-4px)",
                  borderColor: "#10b981",
                },
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  color: "#000",
                  mb: 2,
                  fontSize: "1.3rem",
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {item.title}
              </Typography>
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
                  backgroundColor: "#f0fdf4",
                  borderColor: "#10b981",
                },
              },
              "& .MuiPaginationItem-page.Mui-selected": {
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "#fff",
                border: "2px solid #10b981",
                fontWeight: 800,
              },
            }}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default TermsOfService;