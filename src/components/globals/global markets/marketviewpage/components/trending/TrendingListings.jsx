import React, { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, TrendingUp, Eye, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../../PrivateComponents/AuthContext";
import { marketApi } from "../../api/market.api";
import { imgUrl, getFirstImage } from "../../utils/image.utils";
import { formatCurrency } from "../../utils/currency.utils";
import useListingViews from "../../hooks/useListingViews";

// Vertical card component
const TrendingCard = ({ listing }) => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const { views, loading: viewsLoading } = useListingViews(listing._id);

  const handleView = async () => {
    await marketApi.incrementViews(listing._id, token);
    navigate("/view-market", { state: { listing } });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 30 }}
      onClick={handleView}
      className="card border-0 shadow-lg overflow-hidden"
      style={{
        cursor: "pointer",
        borderRadius: "16px",
        width: "100%",
      }}
    >
      {/* Image Container - Vertical */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "200px",
          overflow: "hidden",
          backgroundColor: "#f3f4f6",
        }}
      >
        <motion.img
          src={imgUrl(getFirstImage(listing))}
          alt={listing.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.4 }}
          className="trending-img"
        />

        {/* Trending Badge */}
        <div
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            backgroundColor: "#ef4444",
            color: "white",
            padding: "4px 10px",
            borderRadius: "6px",
            fontSize: "0.65rem",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "4px",
            backdropFilter: "blur(4px)",
            zIndex: 5,
          }}
        >
          <Award size={12} />
          HOT
        </div>
      </div>

      {/* Details Container - Below Image */}
      <div
        className="card-body p-3"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {/* Title */}
        <h6
          className="fw-bold mb-0"
          style={{
            color: "#0f172a",
            fontSize: "0.95rem",
            lineHeight: "1.2",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {listing.title}
        </h6>

        {/* Price */}
        <div>
          <h6 className="fw-bold mb-0" style={{ color: "#10b981", fontSize: "1.1rem" }}>
            {formatCurrency(listing.price)}
          </h6>
        </div>

        {/* Animal Details Badges */}
        {(listing.animal_id?.species || listing.animal_id?.gender || listing.animal_id?.stage) && (
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
            {listing.animal_id?.species && (
              <span
                className="badge"
                style={{
                  backgroundColor: "#10b981",
                  color: "white",
                  fontSize: "0.65rem",
                  padding: "3px 8px",
                }}
              >
                {listing.animal_id.species}
              </span>
            )}
            {listing.animal_id?.gender && (
              <span
                className="badge"
                style={{
                  backgroundColor: "#3b82f6",
                  color: "white",
                  fontSize: "0.65rem",
                  padding: "3px 8px",
                }}
              >
                {listing.animal_id.gender}
              </span>
            )}
            {listing.animal_id?.stage && (
              <span
                className="badge"
                style={{
                  backgroundColor: "#8b5cf6",
                  color: "white",
                  fontSize: "0.65rem",
                  padding: "3px 8px",
                }}
              >
                {listing.animal_id.stage}
              </span>
            )}
          </div>
        )}

        {/* Views */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#0f172a" }}>
          <Eye size={13} style={{ color: "#10b981" }} />
          <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>
            {viewsLoading ? "..." : views}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// Single Carousel Component
const SingleCarousel = ({ listingsChunk, startIndex }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (listingsChunk.length === 0) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % listingsChunk.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [listingsChunk.length]);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + listingsChunk.length) % listingsChunk.length);
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % listingsChunk.length);
  };

  if (listingsChunk.length === 0) return null;

  const currentListing = listingsChunk[currentIndex];

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "0 35px",
      }}
    >
      {/* Cards Display */}
      <div style={{ position: "relative", width: "100%" }}>
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <TrendingCard key={currentIndex} listing={currentListing} />
        </AnimatePresence>
      </div>

      {/* Previous Button */}
      <button
        onClick={handlePrev}
        style={{
          position: "absolute",
          left: "0px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "white",
          border: "1px solid #e5e7eb",
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.3s ease",
          color: "#0f172a",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          zIndex: 10,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#10b981";
          e.currentTarget.style.color = "white";
          e.currentTarget.style.borderColor = "#10b981";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(16, 185, 129, 0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "white";
          e.currentTarget.style.color = "#0f172a";
          e.currentTarget.style.borderColor = "#e5e7eb";
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
        }}
        aria-label="Previous listing"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Next Button */}
      <button
        onClick={handleNext}
        style={{
          position: "absolute",
          right: "0px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "white",
          border: "1px solid #e5e7eb",
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.3s ease",
          color: "#0f172a",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          zIndex: 10,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#10b981";
          e.currentTarget.style.color = "white";
          e.currentTarget.style.borderColor = "#10b981";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(16, 185, 129, 0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "white";
          e.currentTarget.style.color = "#0f172a";
          e.currentTarget.style.borderColor = "#e5e7eb";
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
        }}
        aria-label="Next listing"
      >
        <ChevronRight size={18} />
      </button>

      {/* Indicators */}
      <div style={{ position: "absolute", bottom: "-50px", left: "50%", transform: "translateX(-50%)", display: "flex", justifyContent: "center", gap: "6px", flexWrap: "wrap" }}>
        {listingsChunk.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setDirection(idx > currentIndex ? 1 : -1);
              setCurrentIndex(idx);
            }}
            style={{
              width: idx === currentIndex ? "24px" : "8px",
              height: "8px",
              borderRadius: "4px",
              background: idx === currentIndex ? "#10b981" : "#d1d5db",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              if (idx !== currentIndex) {
                e.currentTarget.style.background = "#9ca3af";
              }
            }}
            onMouseLeave={(e) => {
              if (idx !== currentIndex) {
                e.currentTarget.style.background = "#d1d5db";
              }
            }}
            aria-label={`Go to listing ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default function TrendingListings({ listings }) {
  // Filter unique listings
  const uniqueListings = Array.from(
    new Map(listings.map((item) => [item._id, item])).values()
  ).filter((listing) => listing && listing._id);

  if (uniqueListings.length === 0) return null;

  // Split listings into chunks of 10 for each carousel
  const carouselChunks = [];
  for (let i = 0; i < uniqueListings.length; i += 10) {
    carouselChunks.push(uniqueListings.slice(i, i + 10));
  }

  return (
    <div className="mb-4">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4" style={{ paddingX: "20px" }}>
        <div className="d-flex align-items-center gap-3">
          <div
            style={{
              backgroundColor: "#ef444415",
              borderRadius: "12px",
              padding: "8px 12px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <TrendingUp style={{ color: "#ef4444" }} size={24} />
          </div>
          <h4 className="fw-bold mb-0" style={{ color: "#0f172a", fontSize: "1.4rem" }}>
            Trending Livestock
          </h4>
        </div>
        <span
          className="badge"
          style={{
            backgroundColor: "#ef4444",
            color: "white",
            padding: "8px 16px",
            fontSize: "0.9rem",
            fontWeight: 700,
          }}
        >
          🔥 Hot Deals
        </span>
      </div>

      {/* Grid of Carousels - 1 col on mobile, 2 cols on tablet, 4 cols on desktop */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "32px",
          padding: "0 12px",
        }}
      >
        {carouselChunks.map((chunk, idx) => (
          <div key={idx} style={{ paddingBottom: "60px" }}>
            <SingleCarousel listingsChunk={chunk} startIndex={idx * 10} />
          </div>
        ))}
      </div>
    </div>
  );
}