import React, { useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Edit,
  MapPin,
  Tag,
  DollarSign,
  Info,
  Droplet,
  User,
  Heart,
  Baby,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../../PrivateComponents/AuthContext";
import { FaCow } from "react-icons/fa6";
import { useApiCache } from "../../../../hooks/useApiCache"; // ✅ Import the reusable hook

const API_BASE = process.env.REACT_APP_API_BASE;

// 🧮 Helper: calculate age from birth_date
const calculateAge = (birthDate) => {
  if (!birthDate) return "Unknown";
  const b = new Date(birthDate);
  const now = new Date();
  const years = now.getFullYear() - b.getFullYear();
  const months = now.getMonth() - b.getMonth();
  const adjMonths = months < 0 ? months + 12 : months;
  return `${years > 0 ? `${years} year${years > 1 ? "s" : ""}` : ""}${years && adjMonths ? ", " : ""
    }${adjMonths ? `${adjMonths} month${adjMonths > 1 ? "s" : ""}` : ""}`;
};

export default function ViewListing() {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { listing: passedListing } = location.state || {};
  const listingId = passedListing?._id;

  // ✅ Use the reusable useApiCache hook for the listing
  const { data: listing, loading, error } = useApiCache(
    `cache_${user?.id}_listing_${listingId}`, // Unique key per user and listing
    async () => {
      if (!listingId) throw new Error("No listing ID provided");
      const res = await axios.get(`${API_BASE}/listing/${listingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        return res.data.listing;
      } else {
        throw new Error(res.data.message || "Failed to fetch listing");
      }
    },
    [listingId, user, token] // Refetch if listingId, user, or token changes
  );

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      maximumFractionDigits: 0,
    }).format(val || 0);

  const handleBack = () => navigate("/slr.drb/my-listings");
  const handleEdit = () => navigate("/slr.drb/edit", { state: { listing } });

  const imgUrl = (path) =>
    path?.startsWith("/uploads/listings")
      ? `${API_BASE.replace("/api", "")}${path}`
      : path;

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-white">
        <div className="spinner-border text-info" role="status" />
      </div>
    );

  if (error || !listing)
    return (
      <div className="container py-5 text-center">
        <h5 className="text-danger mb-3">{error || "Listing not found"}</h5>
        <button className="btn btn-outline-secondary" onClick={handleBack}>
          <ArrowLeft size={16} className="me-2" /> Back
        </button>
      </div>
    );

  const { title, price, animal_type, description, location: loc, photos, farmer, animal_info } =
    listing;

  const pregnancy = animal_info?.pregnancy;
  const insemination = pregnancy?.insemination;

  return (
    <div className="container-fluid px-3 py-4 bg-light min-vh-100">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="btn btn-outline-secondary rounded-circle shadow-sm"
            onClick={handleBack}
          >
            <ArrowLeft size={18} />
          </motion.button>
          <h3 className="fw-bold text-dark mb-0">{title}</h3>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          className="btn btn-info text-white fw-semibold"
          onClick={handleEdit}
        >
          <Edit size={16} className="me-1" /> Edit
        </motion.button>
      </div>

      <div className="row g-4">
        {/* 🖼️ Photos */}
        <div className="col-12 col-lg-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card border-0 shadow-sm rounded-4"
          >
            <div className="card-body p-3">
              <h6 className="fw-semibold text-info mb-3 d-flex align-items-center gap-2">
                <FaCow size={18} /> Photos
              </h6>

              {(() => {
                let photoArray = [];
                try {
                  photoArray = Array.isArray(photos)
                    ? photos
                    : typeof photos === "string"
                      ? JSON.parse(photos)
                      : [];
                } catch {
                  photoArray = [];
                }

                return (
                  <div className="d-flex flex-wrap gap-3">
                    {photoArray.length > 0 ? (
                      photoArray.map((p, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.03 }}
                          className="rounded-4 overflow-hidden shadow-sm"
                          style={{ width: "48%", height: 180 }}
                        >
                          <img
                            src={imgUrl(p)}
                            alt={`photo-${i}`}
                            className="w-100 h-100 object-fit-cover rounded-4"
                          />
                        </motion.div>
                      ))
                    ) : (
                      <img
                        src="https://placehold.co/600x400?text=No+Image"
                        alt="placeholder"
                        className="w-100 rounded-4"
                      />
                    )}
                  </div>
                );
              })()}
            </div>
          </motion.div>
        </div>

        {/* 📋 Info Section */}
        <div className="col-12 col-lg-6">
          {/* Listing Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="card border-0 shadow-sm rounded-4 mb-4"
          >
            <div className="card-body p-4">
              <h6 className="fw-semibold text-info mb-3 d-flex align-items-center gap-2">
                <Info size={18} /> Listing Information
              </h6>
              <h5 className="fw-bold text-dark mb-2">{title}</h5>
              <p className="text-muted mb-3">{description}</p>
              <div className="d-flex flex-column gap-2">
                <div>
                  <Tag size={16} className="text-primary me-2" />
                  <strong>Type:</strong> {animal_type}
                </div>
                <div>
                  <DollarSign size={16} className="text-success me-2" />
                  <strong>Price:</strong> {formatCurrency(price)}
                </div>
                {loc && (
                  <div>
                    <MapPin size={16} className="text-danger me-2" />
                    <strong>Location:</strong> {loc}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* 🐄 Animal Info */}
          {animal_info && (
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              className="card border-0 shadow-sm rounded-4 mb-4"
            >
              <div className="card-body p-4">
                <h6 className="fw-semibold text-info mb-3 d-flex align-items-center gap-2">
                  <FaCow size={18} /> Animal Details
                </h6>

                <div className="row g-3">
                  <div className="col-md-6">
                    <p><strong>Breed:</strong> {animal_info.breed?.name || animal_info.breed_name || "Unknown"}</p>
                    <p><strong>Gender:</strong> {animal_info.gender || "N/A"}</p>
                    <p><strong>Stage:</strong> {animal_info.stage || "N/A"}</p>
                    <p><strong>Status:</strong> {animal_info.status || "N/A"}</p>
                    {animal_info.lifetime_milk > 0 && (
                      <p><Droplet size={14} className="text-info me-1" /> <strong>Lifetime Milk:</strong> {animal_info.lifetime_milk} L</p>
                    )}
                    {animal_info.daily_average > 0 && (
                      <p><strong>Daily Average:</strong> {animal_info.daily_average} L</p>
                    )}
                    {animal_info.total_offspring > 0 && (
                      <p><strong>Total Offspring:</strong> {animal_info.total_offspring}</p>
                    )}
                  </div>

                  <div className="col-md-6">
                    <p><strong>Age:</strong> {animal_info.age || calculateAge(animal_info.birth_date)}</p>
                    {animal_info.mother && (
                      <div className="mt-2">
                        <h6 className="text-info fw-semibold">Mother Info</h6>
                        <p><strong>Name:</strong> {animal_info.mother.name || "N/A"}</p>
                        <p><strong>Breed:</strong> {animal_info.mother.breed?.name || "Unknown"}</p>
                        <p><strong>Milk Avg:</strong> {animal_info.mother.daily_average} L</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 🩷 Pregnancy */}
                {pregnancy && (
                  <div className="mt-3">
                    <h6 className="fw-semibold text-danger d-flex align-items-center gap-2">
                      <Heart size={16} /> Pregnancy
                    </h6>
                    <p><strong>Pregnant:</strong> {pregnancy.is_pregnant ? "Yes" : "No"}</p>
                    {pregnancy.expected_due_date && (
                      <p>
                        <strong>Expected Due Date:</strong>{" "}
                        {new Date(pregnancy.expected_due_date).toLocaleDateString("en-KE")}
                      </p>
                    )}
                    {insemination && (
                      <>
                        <p><strong>Bull Code:</strong> {insemination.bull_code}</p>
                        <p><strong>Bull Name:</strong> {insemination.bull_name}</p>
                        <p><strong>Bull Breed:</strong> {insemination.bull_breed}</p>
                        <p><strong>Method:</strong> {insemination.method}</p>
                      </>
                    )}
                  </div>
                )}

                {/* 👶 Offspring */}
                {animal_info.offspring?.length > 0 && (
                  <div className="mt-3">
                    <h6 className="fw-semibold text-success d-flex align-items-center gap-2">
                      <Baby size={16} /> Offspring ({animal_info.offspring.length})
                    </h6>
                    <ul className="list-unstyled small mb-0">
                      {animal_info.offspring.map((o, i) => (
                        <li key={i}>
                          - {o.name || "Unnamed"} ({o.stage}, {o.gender}) —{" "}
                          {new Date(o.birth_date).toLocaleDateString()}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* 👤 Farmer Info */}
          {farmer && (
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              className="card border-0 shadow-sm rounded-4"
            >
              <div className="card-body p-4">
                <h6 className="fw-semibold text-info mb-3 d-flex align-items-center gap-2">
                  <User size={18} /> Farmer Contact
                </h6>
                <p><strong>Name:</strong> {farmer.fullname}</p>
                <p><strong>Phone:</strong> {farmer.phone}</p>
                <p><strong>Email:</strong> {farmer.email}</p>
                <p><strong>Location:</strong> {farmer.location}</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}