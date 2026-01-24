// marketviewpage/components/listings/ListingCard.jsx
import React from "react";
import { Card, CardMedia, CardContent, Typography, Box, Chip } from "@mui/material";
import { MapPin, Eye, Calendar, Award, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ImageWithFallback from "../shared/ImageWithFallback";
import PriceTag from "../shared/PriceTag";
import TimeAgo from "../shared/TimeAgo";
import ListingBadges from "./ListingBadges";
import ListingActions from "./ListingActions";
import { getFirstImage, imgUrl } from "../../utils/image.utils";

export default function ListingCard({ listing, isTrending }) {
  const navigate = useNavigate();
  const isSold = listing.status === "sold";

  const handleView = () => {
    navigate("/view-market", { state: { listing } });
  };

  const imageCount = listing.photos?.length || listing.images?.length || 0;

  return (
    <motion.div whileHover={{ y: -10 }}>
      <Card
        elevation={0}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          height: "100%",
          cursor: "pointer",
          border: "1px solid transparent",
          transition: "all 0.3s ease",
          opacity: isSold ? 0.6 : 1,
          "&:hover": {
            boxShadow: 4,
            borderColor: "rgba(102, 126, 234, 0.3)",
          },
        }}
      >
        <Box sx={{ position: "relative" }} onClick={handleView}>
          <CardMedia
            sx={{
              height: 200,
              position: "relative",
              overflow: "hidden",
              backgroundColor: "#f5f5f5",
            }}
          >
            <ImageWithFallback
              src={imgUrl(getFirstImage(listing))}
              alt={listing.title}
            />

            {imageCount > 1 && (
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                  color: "white",
                  px: 1,
                  py: 0.5,
                  fontSize: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <ImageIcon size={14} style={{ marginRight: 4 }} />
                {imageCount} photos
              </Box>
            )}
          </CardMedia>

          <ListingActions listing={listing} isSold={isSold} />

          <Box sx={{ position: "absolute", bottom: 8, left: 8 }}>
            <Chip
              label={`${listing.animal_id?.species || "Livestock"}`}
              size="small"
              sx={{
                backgroundColor:
                  listing.animal_id?.species === "cow"
                    ? "#667eea"
                    : listing.animal_id?.species === "goat"
                    ? "#10b981"
                    : listing.animal_id?.species === "sheep"
                    ? "#f59e0b"
                    : listing.animal_id?.species === "pig"
                    ? "#ef4444"
                    : "#6b7280",
                color: "white",
                fontWeight: "bold",
              }}
            />
          </Box>

          {isTrending && (
            <Chip
              icon={<Award size={14} />}
              label="Trending"
              color="error"
              size="small"
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                fontWeight: "bold",
              }}
            />
          )}

          {isSold && (
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                color: "white",
                px: 3,
                py: 1,
                borderRadius: 2,
                fontWeight: "bold",
                fontSize: "1.2rem",
              }}
            >
              SOLD
            </Box>
          )}
        </Box>

        <CardContent sx={{ p: 2 }} onClick={handleView}>
          <Typography variant="h6" fontWeight="bold" noWrap gutterBottom>
            {listing.title}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <MapPin size={14} color="#9e9e9e" style={{ marginRight: 4 }} />
            <Typography variant="body2" color="text.secondary" noWrap>
              {listing.location || "Location N/A"}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <PriceTag value={listing.price} />
            <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary" }}>
              <Eye size={14} style={{ marginRight: 4 }} />
              <Typography variant="body2">{listing.views || 0}</Typography>
            </Box>
          </Box>

          <ListingBadges listing={listing} />

          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <Calendar size={12} color="#9e9e9e" style={{ marginRight: 4 }} />
            <Typography variant="caption" color="text.secondary">
              <TimeAgo date={listing.createdAt} />
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}