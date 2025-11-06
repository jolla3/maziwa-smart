// src/pages/listings/MyListings.jsx
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../PrivateComponents/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Edit, Trash2, Plus, X } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const API_BASE = "https://maziwasmart.onrender.com/api";
const CARD_BG = "linear-gradient(135deg,#f0fbff,#e6f7ff)";

const Toast = ({ id, message, type = "info", onClose }) => {
  const bg =
    type === "success" ? "bg-success text-white" :
      type === "error" ? "bg-danger text-white" :
        "bg-info text-white";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className={`d-flex align-items-center gap-3 p-3 rounded shadow-sm ${bg}`}
      role="status"
      aria-live="polite"
      style={{ minWidth: 260 }}
    >
      <div className="flex-grow-1">{message}</div>
      <button
        onClick={() => onClose(id)}
        aria-label="Close toast"
        className="btn btn-sm btn-light btn-outline-0"
        style={{ lineHeight: 1 }}
      >
        <X size={14} />
      </button>
    </motion.div>
  );
};

const ConfirmModal = ({ open, title, message, onCancel, onConfirm, busy }) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ background: "#000", zIndex: 1050 }}
          onClick={onCancel}
        />
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          className="position-fixed top-50 start-50 translate-middle bg-white rounded shadow-lg"
          style={{ zIndex: 1060, maxWidth: 520, width: "90%" }}
        >
          <div className="p-4">
            <h5 className="mb-2">{title}</h5>
            <p className="text-muted mb-3">{message}</p>
            <div className="d-flex justify-content-end gap-2">
              <button className="btn btn-light" onClick={onCancel} disabled={busy}>
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={onConfirm}
                disabled={busy}
                aria-busy={busy}
              >
                {busy ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

const MyListings = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  // Setup axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.baseURL = API_BASE;
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [token]);

  // Fetch user's listings with in-memory caching
  useEffect(() => {
    let mounted = true;
    const CACHE_KEY = "myListings_cache";
    const CACHE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

    const fetchListings = async () => {
      setLoading(true);

      // Try to load from memory cache first
      const cached = window[CACHE_KEY];
      if (cached && Date.now() - cached.timestamp < CACHE_EXPIRY_MS) {
        setListings(cached.data);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("/listing/mylistings");
        if (!mounted) return;
        if (res?.data?.success) {
          const fetchedListings = res.data.listings || [];
          setListings(fetchedListings);
          // Cache in memory
          window[CACHE_KEY] = {
            data: fetchedListings,
            timestamp: Date.now()
          };
        } else {
          setError("Failed to load listings.");
        }
      } catch (err) {
        console.error("Error loading listings:", err);
        setError("Failed to load your listings.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (token) fetchListings();
    return () => (mounted = false);
  }, [token]);

  // Toast helpers
  const pushToast = (message, type = "info") => {
    const id = Date.now() + Math.random().toString(36).slice(2, 7);
    setToasts((s) => [{ id, message, type }, ...s]);
    setTimeout(() => {
      setToasts((s) => s.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => setToasts((s) => s.filter((t) => t.id !== id));

  // Delete flow
  const requestDelete = (id) => setConfirm({ open: true, id });

  const doDelete = async () => {
    const id = confirm.id;
    if (!id) return;
    setDeletingId(id);
    try {
      setListings((prev) => prev.map(l => l._id === id ? { ...l, deleting: true } : l));

      const res = await axios.delete(`/listing/${id}`);
      if (res?.data?.success) {
        setListings((prev) => prev.filter((l) => l._id !== id));
        // Clear cache when deleting
        delete window.myListings_cache;
        pushToast("Listing deleted", "success");
      } else {
        throw new Error(res?.data?.message || "Delete failed");
      }
    } catch (err) {
      console.error("Delete error:", err);
      const errorMsg = err.response?.data?.message || err.message || "Failed to delete listing";
      pushToast(errorMsg, "error");
      setListings((prev) => prev.map(l => l._id === id ? { ...l, deleting: false } : l));
    } finally {
      setDeletingId(null);
      setConfirm({ open: false, id: null });
    }
  };

  // Format currency safely
  const formatCurrency = (num) => {
    if (num === undefined || num === null || isNaN(Number(num))) return "N/A";
    return new Intl.NumberFormat("en-KE", { style: "decimal" }).format(Number(num));
  };

  // Fixed image path helper
  const listingImageSrc = (item) => {
    if (item.photos?.[0]) {
      const photoPath = item.photos[0];
      if (photoPath.startsWith('http')) {
        return photoPath;
      }
      if (photoPath.startsWith('/')) {
        return `https://maziwasmart.onrender.com${photoPath}`;
      }
      return `https://maziwasmart.onrender.com/${photoPath}`;
    }
    if (item.animal_info?.photos?.[0]) {
      const photoPath = item.animal_info.photos[0];
      if (photoPath.startsWith('http')) {
        return photoPath;
      }
      if (photoPath.startsWith('/')) {
        return `https://maziwasmart.onrender.com${photoPath}`;
      }
      return `https://maziwasmart.onrender.com/${photoPath}`;
    }
    return "/placeholder-600x400.png";
  };

  return (
    <div className="container-fluid px-3 py-4" style={{ minHeight: "100vh", background: "#f7fbff" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0 fw-bold" style={{ color: "#0f172a" }}>
            My Listings
          </h2>
          <small className="text-muted">Manage your posted items — update, view or remove</small>
        </div>

        <div className="d-flex gap-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn text-white px-4 py-2 fw-semibold rounded-pill"
            style={{
              background: "linear-gradient(90deg,#00d4ff,#00bcd4)",
              boxShadow: "0 8px 24px rgba(0,188,212,0.16)",
            }}
            onClick={() => navigate("/create")}
            aria-label="Create new listing"
          >
            <Plus size={18} className="me-2" />
            Create New
          </motion.button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border" style={{ color: "#00bcd4" }} role="status" />
          <p className="text-muted mt-3">Loading listings...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row gx-3 gy-4">
        {!loading && listings.length === 0 && (
          <div className="col-12 text-center py-5">
            <div style={{ maxWidth: 560, margin: "0 auto" }}>
              <h5 className="fw-semibold">You have no listings yet</h5>
              <p className="text-muted">Create your first listing to get started.</p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="btn btn-primary"
                style={{ background: "#00bcd4", borderColor: "#00bcd4" }}
                onClick={() => navigate("/create")}
              >
                Create listing
              </motion.button>
            </div>
          </div>
        )}

        {listings.map((item) => (
          <motion.div
            key={item._id}
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="col-12 col-sm-6 col-lg-4"
          >
            <div
              className="card h-100 rounded-3 shadow-sm overflow-hidden"
              style={{ border: "1px solid #e6f2f7", background: CARD_BG }}
            >
              <div style={{ height: 170, overflow: "hidden" }}>
                <img
                  src={listingImageSrc(item)}
                  alt={item.title}
                  className="w-100 h-100 object-fit-cover"
                  style={{ display: "block" }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder-600x400.png";
                  }}
                />
              </div>

              <div className="card-body d-flex flex-column">
                <div className="mb-2">
                  <h5 className="fw-bold mb-1 text-truncate" title={item.title}>
                    {item.title}
                  </h5>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="small text-muted">
                      {item.animal_type || "Item"} • {item.location || "Unknown"}
                    </div>
                    <div className="fw-semibold" style={{ color: "#006d75" }}>
                      KES {formatCurrency(item.price)}
                    </div>
                  </div>
                </div>

                <p className="text-muted small mb-3" style={{ flex: "0 0 auto", minHeight: 36 }}>
                  {item.description ? (item.description.length > 100 ? item.description.slice(0, 100) + "…" : item.description) : "No description"}
                </p>

                <div className="mt-auto d-flex justify-content-between align-items-center">
                  <div className="d-flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.06 }}
                      className="btn btn-sm btn-white border-0"
                      style={{
                        background: "rgba(255,255,255,0.9)",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.04)"
                      }}
                      onClick={() => navigate("/view", { state: { listing: item } })}
                      aria-label={`View ${item.title}`}
                      title="View"
                    >
                      <Eye size={16} />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.06 }}
                      className="btn btn-sm btn-white border-0"
                      style={{
                        background: "rgba(255,255,255,0.9)",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.04)"
                      }}
                      onClick={() => navigate("/edit", { state: { listing: item } })}
                      aria-label={`Edit ${item.title}`}
                      title="Edit"
                    >
                      <Edit size={16} />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.06 }}
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => requestDelete(item._id)}
                      aria-label={`Delete ${item.title}`}
                      title="Delete"
                    >
                      {item.deleting ? (
                        <span className="spinner-border spinner-border-sm" style={{ width: 16, height: 16 }} />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </motion.button>
                  </div>

                  <span
                    className={`badge rounded-pill py-2 px-3 text-uppercase`}
                    style={{
                      background: item.status === "available" ? "#e6fffa" : "#f1f5f9",
                      color: item.status === "available" ? "#059669" : "#374151",
                      fontSize: 12,
                      fontWeight: 600,
                      border: "1px solid rgba(0,0,0,0.03)"
                    }}
                  >
                    {item.status || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <ConfirmModal
        open={confirm.open}
        title="Delete listing?"
        message="This action cannot be undone. Are you sure you want to delete this listing?"
        onCancel={() => setConfirm({ open: false, id: null })}
        onConfirm={doDelete}
        busy={Boolean(deletingId)}
      />

      <div
        aria-live="polite"
        className="position-fixed bottom-0 end-0 p-3"
        style={{ zIndex: 1200 }}
      >
        <div style={{ display: "grid", gap: 8 }}>
          <AnimatePresence initial={false}>
            {toasts.map((t) => (
              <Toast key={t.id} {...t} onClose={removeToast} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default MyListings;