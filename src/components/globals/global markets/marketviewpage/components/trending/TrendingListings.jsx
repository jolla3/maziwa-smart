// marketviewpage/components/trending/TrendingListings.jsx
import React, { useState, useEffect } from "react";
import { Box, IconButton, Paper } from "@mui/material";
import { ChevronLeft, ChevronRight, TrendingUp, Eye, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { imgUrl, getFirstImage } from "../../utils/image.utils";
import { formatCurrency } from "../../utils/currency.utils";

export default function TrendingListings({ listings }) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const uniqueListings = Array.from(
    new Map(listings.map(item => [item._id, item])).values()
  );

  useEffect(() => {
    if (!isAutoPlaying || uniqueListings.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % uniqueListings.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, uniqueListings.length]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + uniqueListings.length) % uniqueListings.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % uniqueListings.length);
  };

  const handleView = (listing) => {
    navigate("/view-market", { state: { listing } });
  };

  if (uniqueListings.length === 0) return null;

  const currentListing = uniqueListings[currentIndex];

  return (
    <Box sx={{ mb: 4, mt: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              backgroundColor: "#ef444415",
              borderRadius: 3,
              p: 1.5,
              mr: 2,
            }}
          >
            <TrendingUp size={24} color="#ef4444" />
          </Box>
          <Box component="h4" sx={{ fontWeight: 700, color: "#0f172a", mb: 0 }}>
            Trending Livestock
          </Box>
        </Box>
        <Box
          component="span"
          sx={{
            backgroundColor: "#ef4444",
            color: "white",
            px: 3,
            py: 1,
            borderRadius: 8,
            fontWeight: 600,
            fontSize: "0.9rem",
          }}
        >
          🔥 Hot Deals
        </Box>
      </Box>

      <Paper
        elevation={0}
        sx={{
          position: "relative",
          borderRadius: 4,
          overflow: "hidden",
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          cursor: "pointer",
        }}
        onClick={() => handleView(currentListing)}
      >
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, minHeight: 400 }}>
          {/* Image Section */}
          <Box
            sx={{
              flex: { xs: "1 1 auto", md: "0 0 60%" },
              position: "relative",
              overflow: "hidden",
              minHeight: { xs: 300, md: 400 },
            }}
          >
            <Box
              component="img"
              src={imgUrl(getFirstImage(currentListing))}
              alt={currentListing.title}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.5s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            />

            {/* Navigation Arrows */}
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              sx={{
                position: "absolute",
                left: 16,
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "rgba(255,255,255,0.9)",
                "&:hover": {
                  backgroundColor: "white",
                },
              }}
            >
              <ChevronLeft size={24} color="#0f172a" />
            </IconButton>

            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              sx={{
                position: "absolute",
                right: 16,
                top: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "rgba(255,255,255,0.9)",
                "&:hover": {
                  backgroundColor: "white",
                },
              }}
            >
              <ChevronRight size={24} color="#0f172a" />
            </IconButton>

            {/* Indicators */}
            <Box
              sx={{
                position: "absolute",
                bottom: 16,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: 1,
              }}
            >
              {uniqueListings.map((_, idx) => (
                <Box
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                    setIsAutoPlaying(false);
                  }}
                  sx={{
                    width: idx === currentIndex ? 32 : 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: idx === currentIndex ? "white" : "rgba(255,255,255,0.5)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Content Section */}
          <Box
            sx={{
              flex: { xs: "1 1 auto", md: "0 0 40%" },
              p: 4,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              color: "white",
            }}
          >
            <Box
              sx={{
                backgroundColor: "rgba(255,255,255,0.2)",
                px: 2,
                py: 0.5,
                borderRadius: 2,
                display: "inline-block",
                mb: 2,
                width: "fit-content",
              }}
            >
              <Box component="span" sx={{ fontSize: "0.85rem", fontWeight: 600 }}>
                FEATURED LISTING
              </Box>
            </Box>

            <Box
              component="h2"
              sx={{
                fontSize: { xs: "1.75rem", md: "2.5rem" },
                fontWeight: 800,
                mb: 2,
                color: "white",
              }}
            >
              {currentListing.title}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <MapPin size={20} style={{ marginRight: 8 }} />
              <Box component="span" sx={{ fontSize: "1.1rem", opacity: 0.9 }}>
                {currentListing.location || "Location not specified"}
              </Box>
            </Box>

            <Box
              component="h3"
              sx={{
                fontSize: { xs: "2rem", md: "3rem" },
                fontWeight: 800,
                mb: 3,
                color: "white",
              }}
            >
              {formatCurrency(currentListing.price)}
            </Box>

            <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
              {currentListing.animal_id?.species && (
                <Box
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    fontWeight: 600,
                  }}
                >
                  {currentListing.animal_id.species}
                </Box>
              )}
              {currentListing.animal_id?.gender && (
                <Box
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    fontWeight: 600,
                  }}
                >
                  {currentListing.animal_id.gender === "male" ? "♂" : "♀"} {currentListing.animal_id.gender}
                </Box>
              )}
              {currentListing.animal_id?.stage && (
                <Box
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.2)",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    fontWeight: 600,
                  }}
                >
                  {currentListing.animal_id.stage}
                </Box>
              )}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", opacity: 0.9 }}>
              <Eye size={18} style={{ marginRight: 8 }} />
              <Box component="span" sx={{ fontSize: "1rem" }}>
                {currentListing.views || 0} views
              </Box>
            </Box>

            <Box
              sx={{
                mt: 4,
                backgroundColor: "white",
                color: "#10b981",
                px: 4,
                py: 1.5,
                borderRadius: 3,
                fontWeight: 700,
                fontSize: "1.1rem",
                textAlign: "center",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#f0fdf4",
                  transform: "scale(1.05)",
                },
              }}
            >
              View Details →
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}