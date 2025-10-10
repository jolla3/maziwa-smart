// src/pages/ViewListing.jsx
import React, { useContext, useEffect, useState } from "react";
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
import { AuthContext } from "../PrivateComponents/AuthContext";
import { FaCow } from "react-icons/fa6";
const API_BASE =
  process.env.REACT_APP_API_BASE || "https://maziwasmart.onrender.com/api";

// 🧮 Helper to calculate age from birth_date
const calculateAge = (birthDate) => {
  if (!birthDate) return "Unknown";
  const b = new Date(birthDate);
  const now = new Date();
  const years = now.getFullYear() - b.getFullYear();
  const months = now.getMonth() - b.getMonth();
  const adjMonths = months < 0 ? months + 12 : months;
  return `${years > 0 ? `${years} year${years > 1 ? "s" : ""}` : ""}${
    years && adjMonths ? ", " : ""
  }${adjMonths ? `${adjMonths} month${adjMonths > 1 ? "s" : ""}` : ""}`;
};

export default function ViewListing() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { listing: passedListing } = location.state || {};

  const [listing, setListing] = useState(passedListing || null);
  const [loading, setLoading] = useState(!passedListing);
  const [error, setError] = useState("");

  // 🧠 Fetch Listing by ID if not passed from state
  useEffect(() => {
    const fetchListing = async () => {
      try {
        if (!passedListing?._id) return;
        const res = await axios.get(`${API_BASE}/listing/${passedListing._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) setListing(res.data.listing);
        else setError(res.data.message || "Failed to fetch listing");
      } catch (err) {
        console.error(err);
        setError("Server error fetching listing");
      } finally {
        setLoading(false);
      }
    };

    if (!passedListing && token) fetchListing();
  }, [passedListing, token]);

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      maximumFractionDigits: 0,
    }).format(val || 0);

  const handleBack = () => navigate("/my-listings");
  const handleEdit = () => navigate("/edit", { state: { listing } });

  const imgUrl = (path) =>
    path?.startsWith("/")
      ? `${API_BASE.replace("/api", "")}${path}`
      : path || "https://placehold.co/600x400?text=No+Image";

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
        {/* 🖼️ Image Section */}
        <div className="col-12 col-lg-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card border-0 shadow-sm rounded-4"
          >
            <div className="card-body p-3">
              <h6 className="fw-semibold text-info mb-3 d-flex align-items-center gap-2">
               <FaCow size={18} />Photos
              </h6>
              <div className="d-flex flex-wrap gap-3">
                {(photos && photos.length ? photos : [""]).map((p, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.03 }}
                    className="rounded-4 overflow-hidden shadow-sm"
                    style={{ width: "48%", height: 180 }}
                  >
                    <img
                      src={imgUrl(p)}
                      alt={`photo-${i}`}
                      className="w-100 h-100 object-fit-cover"
                      style={{ borderRadius: "12px" }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* 🧾 Listing Info */}
        <div className="col-12 col-lg-6">
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

          {/* 🐄 Animal Profile Card */}
          {animal_info && (
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              className="card border-0 shadow-sm rounded-4 mb-4"
            >
              <div className="card-body p-4">
                <h6 className="fw-semibold text-info mb-3 d-flex align-items-center gap-2">
                  <FaCow size={18} />Animal Profile
                </h6>

                <div className="row g-3">
                  <div className="col-6">
                    <p className="mb-1">
                      <strong>Breed:</strong>{" "}
                      {animal_info.breed?.name || "Unknown"}
                    </p>
                    <p className="mb-1">
                      <strong>Gender:</strong> {animal_info.gender}
                    </p>
                    <p className="mb-1">
                      <strong>Stage:</strong> {animal_info.stage}
                    </p>
                  </div>

                  <div className="col-6">
                    <p className="mb-1">
                      <strong>Age:</strong> {calculateAge(animal_info.birth_date)}
                    </p>
                    <p className="mb-1">
                      <strong>Status:</strong> {animal_info.status}
                    </p>
                    {animal_info.lifetime_milk > 0 && (
                      <p className="mb-1">
                        <Droplet size={14} className="text-info me-1" />
                        <strong>Lifetime Milk:</strong>{" "}
                        {animal_info.lifetime_milk.toLocaleString()} L
                      </p>
                    )}
                  </div>
                </div>

                {/* Pregnancy Info */}
                {pregnancy?.is_pregnant && (
                  <div className="mt-3">
                    <h6 className="fw-semibold text-danger d-flex align-items-center gap-2">
                      <Heart size={16} /> Pregnancy Details
                    </h6>
                    <p className="mb-1">
                      <strong>Expected Due Date:</strong>{" "}
                      {new Date(
                        pregnancy.expected_due_date
                      ).toLocaleDateString("en-KE", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    {insemination && (
                      <p className="mb-0">
                        <strong>Bull:</strong> {insemination.bull_name} (
                        {insemination.bull_breed})
                      </p>
                    )}
                  </div>
                )}

                {/* Offspring */}
                {animal_info.offspring?.length > 0 && (
                  <div className="mt-3">
                    <h6 className="fw-semibold text-success d-flex align-items-center gap-2">
                      <Baby size={16} /> Offspring ({animal_info.offspring.length})
                    </h6>
                    <ul className="list-unstyled small mb-0">
                      {animal_info.offspring.map((o, i) => (
                        <li key={i}>
                          • {o.stage} ({o.gender}), born{" "}
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
                <p className="mb-1">
                  <strong>Name:</strong> {farmer.fullname}
                </p>
                <p className="mb-1">
                  <strong>Phone:</strong> {farmer.phone}
                </p>
                <p className="mb-1">
                  <strong>Email:</strong> {farmer.email}
                </p>
                <p className="mb-0">
                  <strong>Location:</strong> {farmer.location}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
