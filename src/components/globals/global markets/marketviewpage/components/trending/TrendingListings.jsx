// marketviewpage/components/trending/TrendingListings.jsx
import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Award, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { imgUrl, getFirstImage } from "../../utils/image.utils";
import { formatCurrency } from "../../utils/currency.utils";

export default function TrendingListings({ listings }) {
  const navigate = useNavigate();

  const handleView = (listing) => {
    navigate("/view-market", { state: { listing } });
  };

  // Remove duplicates
  const uniqueListings = Array.from(
    new Map(listings.map(item => [item._id, item])).values()
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mb-4"
    >
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="fw-bold d-flex align-items-center mb-0" style={{ color: "#0f172a" }}>
          <div className="bg-danger bg-opacity-10 rounded-3 p-2 me-3">
            <TrendingUp style={{ color: "#ef4444" }} size={24} />
          </div>
          Trending Listings
        </h4>
        <span className="badge bg-danger rounded-pill px-3 py-2">
          Hot Deals 🔥
        </span>
      </div>

      <div className="row g-3">
        {uniqueListings.slice(0, 4).map((listing, idx) => (
          <div key={listing._id} className="col-lg-3 col-md-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="card border-0 shadow-sm rounded-4 overflow-hidden h-100"
              onClick={() => handleView(listing)}
              style={{ cursor: "pointer" }}
            >
              <div className="position-absolute top-0 end-0 m-2" style={{ zIndex: 3 }}>
                <span className="badge bg-danger shadow-sm">
                  <Award size={14} className="me-1" />
                  Trending
                </span>
              </div>
              <div className="ratio ratio-4x3 bg-light position-relative overflow-hidden">
                <img
                  src={imgUrl(getFirstImage(listing))}
                  alt={listing.title}
                  style={{ 
                    objectFit: "cover", 
                    width: "100%", 
                    height: "100%",
                    transition: "transform 0.4s ease"
                  }}
                  className="card-zoom-img"
                />
              </div>
              <div className="card-body p-3">
                <h6 className="fw-bold mb-2 text-truncate" style={{ color: "#0f172a" }}>
                  {listing.title}
                </h6>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="h5 mb-0 fw-bold" style={{ color: "#10b981" }}>
                    {formatCurrency(listing.price)}
                  </span>
                  <span className="badge bg-light" style={{ color: "#0f172a" }}>
                    <Eye size={12} className="me-1" />
                    {listing.views || 0}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      <style>{`
        .card-zoom-img:hover {
          transform: scale(1.08);
        }
      `}</style>
    </motion.div>
  );
}