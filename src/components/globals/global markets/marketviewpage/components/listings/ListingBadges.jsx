// marketviewpage/components/listings/ListingBadges.jsx
import React from "react";
import { Box, Chip } from "@mui/material";

export default function ListingBadges({ listing }) {
  return (
    <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
      {listing.animal_id?.gender && (
        <Chip
          label={`${listing.animal_id.gender === "male" ? "♂" : "♀"} ${
            listing.animal_id.gender
          }`}
          size="small"
          variant="outlined"
          sx={{ fontSize: "0.75rem" }}
        />
      )}
      {listing.animal_id?.stage && (
        <Chip
          label={listing.animal_id.stage}
          size="small"
          variant="outlined"
          sx={{ fontSize: "0.75rem" }}
        />
      )}
      {listing.animal_id?.status === "pregnant" && (
        <Chip
          label="🤰 Pregnant"
          size="small"
          sx={{
            backgroundColor: "#fef3c7",
            color: "#92400e",
            fontSize: "0.75rem",
          }}
        />
      )}
    </Box>
  );
}