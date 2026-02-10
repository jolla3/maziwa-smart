import React from "react";
import { motion } from "framer-motion";
import { Eye, Calendar, MapPin } from "lucide-react";

const StatsBar = ({ views, createdAt, location }) => {
  const timeAgo = (date) => {
    const days = Math.floor((Date.now() - new Date(date)) / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="row g-3 mt-2"
    >
      <style>{`
        .stat-card {
          transition: all 0.3s ease;
        }
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.1) !important;
        }
      `}</style>

       <div className="col-4">
        <div className="card border-0 shadow-sm rounded-4 stat-card">
          <div className="card-body text-center py-3">
            <Eye className="text-primary mb-2" size={24} />
            <h5 className="fw-bold mb-0">{views || 0}</h5> {/* ✅ Views from prop (already a number) */}
            <small className="text-muted">Views</small>
          </div>
        </div>
      </div>
      
      <div className="col-4">
        <div className="card border-0 shadow-sm rounded-4 stat-card">
          <div className="card-body text-center py-3">
            <Calendar className="text-success mb-2" size={24} />
            <h6 className="fw-bold mb-0 small">{timeAgo(createdAt)}</h6>
            <small className="text-muted">Posted</small>
          </div>
        </div>
      </div>
      
      <div className="col-4">
        <div className="card border-0 shadow-sm rounded-4 stat-card">
          <div className="card-body text-center py-3">
            <MapPin className="text-danger mb-2" size={24} />
            <h6 className="fw-bold mb-0 small text-truncate">{location || "Kenya"}</h6>
            <small className="text-muted">Location</small>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatsBar;