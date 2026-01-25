// marketviewpage/components/states/MarketLoader.jsx
import React from "react";
import { Skeleton } from "@mui/material";

export default function MarketLoader() {
  return (
    <div className="container-fluid px-3 py-4" style={{ backgroundColor: "#ffffff" }}>
      {/* Hero Skeleton */}
      <Skeleton 
        variant="rectangular" 
        height={200} 
        sx={{ borderRadius: 4, mb: 4, backgroundColor: "#f1f5f9" }} 
      />

      {/* Stats Skeleton */}
      <div className="row g-3 mb-4">
        {[1, 2, 3, 4].map((i) => (
          <div className="col-md-3" key={i}>
            <Skeleton 
              variant="rectangular" 
              height={100} 
              sx={{ borderRadius: 4, backgroundColor: "#f1f5f9" }} 
            />
          </div>
        ))}
      </div>

      {/* Trending Skeleton */}
      <Skeleton 
        variant="text" 
        width={200} 
        height={40} 
        sx={{ mb: 3, backgroundColor: "#f1f5f9" }} 
      />
      <div className="row g-3 mb-4">
        {[1, 2, 3, 4].map((i) => (
          <div className="col-lg-3 col-md-6" key={i}>
            <Skeleton 
              variant="rectangular" 
              height={300} 
              sx={{ borderRadius: 4, backgroundColor: "#f1f5f9" }} 
            />
          </div>
        ))}
      </div>

      {/* Listings Skeleton */}
      <Skeleton 
        variant="text" 
        width={200} 
        height={40} 
        sx={{ mb: 3, backgroundColor: "#f1f5f9" }} 
      />
      <div className="row g-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div className="col-xl-3 col-lg-4 col-md-6" key={i}>
            <Skeleton 
              variant="rectangular" 
              height={350} 
              sx={{ borderRadius: 4, backgroundColor: "#f1f5f9" }} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}