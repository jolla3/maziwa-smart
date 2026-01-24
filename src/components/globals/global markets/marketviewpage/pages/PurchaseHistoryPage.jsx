// marketviewpage/pages/PurchaseHistoryPage.jsx
import React from "react";
import {
  Box,
  Container,
  Typography,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import { ArrowLeft, ShoppingBag } from "lucide-react";

export default function PurchaseHistoryPage({ onBack }) {
  return (
    <Box sx={{ backgroundColor: "#ffffff", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton onClick={onBack} sx={{ color: "#000" }}>
            <ArrowLeft size={24} />
          </IconButton>
          <Typography variant="h4" fontWeight="bold" sx={{ color: "#000" }}>
            Purchase History
          </Typography>
        </Box>

        <Card sx={{ p: 6, textAlign: "center" }}>
          <ShoppingBag size={64} color="#ccc" style={{ marginBottom: 16 }} />
          <Typography variant="h6" sx={{ color: "#000", mb: 2 }}>
            No purchase history yet
          </Typography>
          <Typography variant="body2" sx={{ color: "#6b7280" }}>
            Your completed purchases will appear here
          </Typography>
        </Card>
      </Container>
    </Box>
  );
}