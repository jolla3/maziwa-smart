// marketviewpage/components/trending/TrendingListings.jsx
import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, TrendingUp, Eye, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../../PrivateComponents/AuthContext";
import { marketApi } from "../../api/market.api";
import { imgUrl, getFirstImage } from "../../utils/image.utils";
import { formatCurrency } from "../../utils/currency.utils";

export default function TrendingListings({ listings }) {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewCounts, setViewCounts] = useState({});

  const uniqueListings = Array.from(
    new Map(listings.map(item => [item._id, item])).values()
  );

  // Fetch view counts for all trending listings
  useEffect(() => {
    const fetchViews = async () => {
      const counts = {};
      for (const listing of uniqueListings) {
        try {
          const data = await marketApi.getListingViews(listing._id, token);
          counts[listing._id] = data.total_views || 0;
        } catch (err) {
          counts[listing._id] = 0;
        }
      }
      setViewCounts(counts);
    };

    if (uniqueListings.length > 0) {
      fetchViews();
    }
  }, [uniqueListings, token]);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 2));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(uniqueListings.length - 2, prev + 2));
  };

  const handleView = async (listing) => {
    await marketApi.incrementViews(listing._id, token);
    navigate("/view-market", { state: { listing } });
  };

  if (uniqueListings.length === 0) return null;

  const visibleListings = uniqueListings.slice(currentIndex, currentIndex + 2);
  const hasNext = currentIndex + 2 < uniqueListings.length;
  const hasPrev = currentIndex > 0;

  return (
    <div className="mb-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center">
          <div className="bg-danger bg-opacity-10 rounded-3 p-2 me-3">
            <TrendingUp style={{ color: "#ef4444" }} size={24} />
          </div>
          <h4 className="fw-bold mb-0" style={{ color: "#0f172a" }}>
            Trending Livestock
          </h4>
        </div>
        <span className="badge bg-danger px-3 py-2" style={{ fontSize: "0.9rem" }}>
          🔥 Hot Deals
        </span>
      </div>

      <div className="position-relative">
        <div className="row g-3">
          {visibleListings.map((listing) => (
            <div key={listing._id} className="col-md-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card border-0 shadow-sm rounded-4 overflow-hidden"
                onClick={() => handleView(listing)}
                style={{ cursor: "pointer", height: "280px" }}
              >
                <div className="row g-0 h-100">
                  {/* Image - 50% */}
                  <div className="col-5 position-relative">
                    <div className="position-absolute top-0 end-0 m-2" style={{ zIndex: 2 }}>
                      <span className="badge bg-danger shadow-sm">
                        <Award size={12} className="me-1" />
                        Trending
                      </span>
                    </div>
                    <img
                      src={imgUrl(getFirstImage(listing))}
                      alt={listing.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.3s ease",
                      }}
                      className="trending-img"
                    />
                  </div>

                  {/* Content - 50% */}
                  <div className="col-7">
                    <div className="card-body p-3 d-flex flex-column h-100">
                      <h6 className="fw-bold mb-2" style={{ color: "#0f172a", fontSize: "1rem" }}>
                        {listing.title}
                      </h6>

                      <div className="mb-2">
                        <h4 className="fw-bold mb-0" style={{ color: "#10b981" }}>
                          {formatCurrency(listing.price)}
                        </h4>
                      </div>

                      <div className="d-flex gap-1 flex-wrap mb-2">
                        {listing.animal_id?.species && (
                          <span className="badge" style={{ backgroundColor: "#10b981", color: "white", fontSize: "0.75rem" }}>
                            {listing.animal_id.species}
                          </span>
                        )}
                        {listing.animal_id?.gender && (
                          <span className="badge" style={{ backgroundColor: "#3b82f6", color: "white", fontSize: "0.75rem" }}>
                            {listing.animal_id.gender}
                          </span>
                        )}
                        {listing.animal_id?.stage && (
                          <span className="badge" style={{ backgroundColor: "#8b5cf6", color: "white", fontSize: "0.75rem" }}>
                            {listing.animal_id.stage}
                          </span>
                        )}
                      </div>

                      <div className="mt-auto">
                        <div className="d-flex align-items-center" style={{ color: "#0f172a" }}>
                          <Eye size={14} className="me-1" />
                          <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                            {viewCounts[listing._id] || 0} views
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {hasPrev && (
          <button
            onClick={handlePrev}
            className="btn btn-light shadow position-absolute top-50 start-0 translate-middle-y"
            style={{
              zIndex: 10,
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              padding: 0,
              marginLeft: "-20px",
              border: "none",
            }}
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {hasNext && (
          <button
            onClick={handleNext}
            className="btn btn-light shadow position-absolute top-50 end-0 translate-middle-y"
            style={{
              zIndex: 10,
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              padding: 0,
              marginRight: "-20px",
              border: "none",
            }}
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>

      {/* Indicators */}
      <div className="d-flex justify-content-center gap-2 mt-3">
        {Array.from({ length: Math.ceil(uniqueListings.length / 2) }).map((_, idx) => (
          <div
            key={idx}
            onClick={() => setCurrentIndex(idx * 2)}
            style={{
              width: currentIndex / 2 === idx ? "32px" : "8px",
              height: "8px",
              borderRadius: "4px",
              backgroundColor: currentIndex / 2 === idx ? "#10b981" : "#e5e7eb",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
          />
        ))}
      </div>

      <style>{`
        .card:hover .trending-img {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
}