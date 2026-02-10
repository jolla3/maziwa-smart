import React from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import ListingCard from "./ListingCard";

export default function ListingsGrid({ listings, onClearFilters }) {
  // Remove duplicates and filter out invalid listings
  const uniqueListings = Array.from(
    new Map(listings.map(item => [item._id, item])).values()
  ).filter(listing => listing && listing._id); // ✅ Filter out undefined/null listings

  if (uniqueListings.length === 0) {
    return (
      <div className="card border-0 shadow-sm rounded-4 text-center py-5">
        <AlertCircle size={64} style={{ color: "#10b981" }} className="mx-auto mb-3" />
        <h5 className="fw-bold mb-2" style={{ color: "#0f172a" }}>
          No Listings Found
        </h5>
        <p style={{ color: "#0f172a" }} className="mb-3">
          Try adjusting your filters or search query
        </p>
        <button
          className="btn rounded-pill px-4"
          onClick={onClearFilters}
          style={{
            backgroundColor: "#10b981",
            color: "white",
            border: "none",
          }}
        >
          Clear All Filters
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-3">
        <h5 className="fw-bold" style={{ color: "#0f172a" }}>
          {uniqueListings.length} Available Listing{uniqueListings.length !== 1 ? "s" : ""}
        </h5>
      </div>

      <motion.div layout className="row g-4">
        {uniqueListings.map((listing) => (
          <div key={listing._id} className="col-xl-3 col-lg-4 col-md-6">
            <ListingCard listing={listing} />
          </div>
        ))}
      </motion.div>
    </>
  );
}