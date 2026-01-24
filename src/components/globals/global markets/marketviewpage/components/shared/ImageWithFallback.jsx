// marketviewpage/components/shared/ImageWithFallback.jsx
import React, { useState } from "react";
import { Box } from "@mui/material";

export default function ImageWithFallback({ src, alt }) {
  const [error, setError] = useState(false);

  const fallbackUrl = "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600&q=80";

  return (
    <Box
      component="img"
      src={error ? fallbackUrl : src}
      alt={alt}
      onError={() => setError(true)}
      sx={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        ".MuiCard-root:hover &": {
          transform: "scale(1.08)",
        },
      }}
    />
  );
}