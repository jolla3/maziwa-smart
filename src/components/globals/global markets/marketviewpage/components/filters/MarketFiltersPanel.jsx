// marketviewpage/components/filters/MarketFiltersPanel.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X } from "lucide-react";

export default function MarketFiltersPanel({ open, filters, onChange, onClear, onClose }) {
  const handleChange = (field, value) => {
    onChange(field, value);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4"
        >
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0 d-flex align-items-center" style={{ color: "#0f172a" }}>
                <Filter className="me-2" size={20} style={{ color: "#10b981" }} />
                Filter Your Search
              </h5>
              <button 
                className="btn btn-sm btn-light rounded-circle" 
                onClick={onClose}
                style={{ border: "none" }}
              >
                <X size={18} />
              </button>
            </div>

            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label fw-semibold" style={{ color: "#0f172a" }}>
                  Species
                </label>
                <select
                  className="form-select"
                  value={filters.species}
                  onChange={(e) => handleChange("species", e.target.value)}
                  style={{ color: "#0f172a" }}
                >
                  <option value="">All Species</option>
                  <option value="cow">Cow 🐄</option>
                  <option value="goat">Goat 🐐</option>
                  <option value="sheep">Sheep 🐑</option>
                  <option value="pig">Pig 🐖</option>
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label fw-semibold" style={{ color: "#0f172a" }}>
                  Gender
                </label>
                <select
                  className="form-select"
                  value={filters.gender}
                  onChange={(e) => handleChange("gender", e.target.value)}
                  style={{ color: "#0f172a" }}
                >
                  <option value="">All Genders</option>
                  <option value="female">Female ♀</option>
                  <option value="male">Male ♂</option>
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label fw-semibold" style={{ color: "#0f172a" }}>
                  Stage
                </label>
                <select
                  className="form-select"
                  value={filters.stage}
                  onChange={(e) => handleChange("stage", e.target.value)}
                  style={{ color: "#0f172a" }}
                >
                  <option value="">All Stages</option>
                  <option value="calf">Calf</option>
                  <option value="weaner">Weaner</option>
                  <option value="mature">Mature</option>
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label fw-semibold" style={{ color: "#0f172a" }}>
                  Pregnant
                </label>
                <select
                  className="form-select"
                  value={filters.pregnant}
                  onChange={(e) => handleChange("pregnant", e.target.value)}
                  style={{ color: "#0f172a" }}
                >
                  <option value="">All</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label fw-semibold" style={{ color: "#0f172a" }}>
                  Min Price (KES)
                </label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="0"
                  value={filters.minPrice}
                  onChange={(e) => handleChange("minPrice", e.target.value)}
                  style={{ color: "#0f172a" }}
                />
              </div>

              <div className="col-md-2">
                <label className="form-label fw-semibold" style={{ color: "#0f172a" }}>
                  Max Price (KES)
                </label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="100000"
                  value={filters.maxPrice}
                  onChange={(e) => handleChange("maxPrice", e.target.value)}
                  style={{ color: "#0f172a" }}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label fw-semibold" style={{ color: "#0f172a" }}>
                  Sort By
                </label>
                <select
                  className="form-select"
                  value={filters.sort}
                  onChange={(e) => handleChange("sort", e.target.value)}
                  style={{ color: "#0f172a" }}
                >
                  <option value="createdAt">Newest First</option>
                  <option value="price_asc">Price: Low → High</option>
                  <option value="price_desc">Price: High → Low</option>
                  <option value="views_desc">Most Viewed</option>
                </select>
              </div>

              <div className="col-md-12">
                <button
                  className="btn rounded-3"
                  onClick={onClear}
                  style={{
                    backgroundColor: "#10b981",
                    color: "white",
                    border: "none",
                  }}
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}